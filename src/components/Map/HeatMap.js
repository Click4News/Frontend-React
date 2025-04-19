import React, { Component, createRef } from "react";
import Map, { Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import DisplayControls from "../Features/DisplayControls";
import NewsFilters from "../Features/NewsFilters";
import HeatLayers from "./HeatLayers";
import PopupCard from "./PopupCard";
import UserDetailsPanel from "../User/UserStatsPanel";
import AddNewsButton from "../User/AddNewsButton";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const viewZoomMap = {
  world: 2,
  country: 4,
  state: 6,
  city: 10,
};

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.circleInterval = null;
    this.state = {
      theme: "light",
      viewLevel: "world",
      zoom: viewZoomMap.world,
      viewState: {
        longitude: -105.0,
        latitude: 39.7392,
        zoom: viewZoomMap.world,
      },
      geoJsonData: null,
      clickedLocation: null,
      sortedNearbyNews: [],
      currentNewsIndex: 0,
      showPopup: false,
      circleRadius: 0,
      keyword: "",
      selectedCategories: [],
    };
  }

  componentDidMount() {
    fetch("https://fastapi-service-34404463322.us-central1.run.app/geojson")
      .then((res) => res.json())
      .then((data) => {
        const jittered = this.jitterOverlappingPoints(data.features);
        this.setState({
          geoJsonData: {
            type: "FeatureCollection",
            features: jittered,
          },
        });
      });
  }

  jitterOverlappingPoints = (features) => {
    const seen = new Set();
    return features.map((f) => {
      let [lng, lat] = f.geometry.coordinates;
      const key = `${lng.toFixed(4)}|${lat.toFixed(4)}`;
      if (seen.has(key)) {
        lng += (Math.random() - 0.5) * 0.01;
        lat += (Math.random() - 0.5) * 0.01;
      }
      seen.add(key);
      return { ...f, geometry: { ...f.geometry, coordinates: [lng, lat] } };
    });
  };

  handleThemeChange = (theme) => this.setState({ theme });

  handleViewLevelChange = (viewLevel) => {
    const zoom = viewZoomMap[viewLevel];
    this.setState((prev) => ({
      viewLevel,
      zoom,
      viewState: { ...prev.viewState, zoom },
    }));
    if (this.mapRef.current) {
      this.mapRef.current.flyTo({ zoom, duration: 300 });
    }
  };

  handleZoomChange = (zoom, source = "manual") => {
    const matched = Object.entries(viewZoomMap).find(([_, z]) => Math.abs(z - zoom) < 0.6);
    const newLevel = matched ? matched[0] : this.state.viewLevel;

    this.setState((prev) => ({
      zoom,
      viewLevel: newLevel,
      viewState: { ...prev.viewState, zoom },
    }));

    if (source === "button" && this.mapRef.current) {
      this.mapRef.current.flyTo({ zoom, duration: 300 });
    }
  };

  handleKeywordChange = (keyword) => this.setState({ keyword });
  handleCategoryChange = (selectedCategories) => this.setState({ selectedCategories });

  handleResetView = () => {
    const viewState = {
      longitude: -105.0,
      latitude: 39.7392,
      zoom: viewZoomMap.world,
    };
    this.setState({
      viewLevel: "world",
      zoom: viewZoomMap.world,
      viewState,
    });
    if (this.mapRef.current) {
      this.mapRef.current.flyTo({ center: [-105.0, 39.7392], zoom: viewZoomMap.world, duration: 300 });
    }
  };

  getFilteredFeatures = () => {
    const { geoJsonData, keyword, selectedCategories } = this.state;
    if (!geoJsonData) return [];

    return geoJsonData.features.filter((f) => {
      const combinedText = `${f.properties.title || ""} ${f.properties.summary || ""} ${f.properties.category || ""}`;
      const textMatch = combinedText.toLowerCase().includes(keyword.toLowerCase());
      const catMatch = selectedCategories.length === 0 || selectedCategories.includes(f.properties.category);
      return textMatch && catMatch;
    });
  };

  handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    const filteredFeatures = this.getFilteredFeatures();
    if (!filteredFeatures || !this.mapRef.current) return;

    const map = this.mapRef.current.getMap();
    const clickedPixel = map.project([lng, lat]);
    const thresholdPixels = 30;

    const nearbyNews = filteredFeatures.filter((f) => {
      const screenCoords = map.project(f.geometry.coordinates);
      const dx = screenCoords.x - clickedPixel.x;
      const dy = screenCoords.y - clickedPixel.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < thresholdPixels;
    });

    if (nearbyNews.length === 0) return;

    this.setState({
      clickedLocation: { longitude: lng, latitude: lat },
      sortedNearbyNews: nearbyNews,
      currentNewsIndex: 0,
      circleRadius: 10,
    });

    if (this.circleInterval) clearInterval(this.circleInterval);
    let radius = 10;
    this.circleInterval = setInterval(() => {
      radius += 3;
      if (radius >= 50) {
        clearInterval(this.circleInterval);
        this.setState({ circleRadius: 50 ,showPopup: true });
      } else {
        this.setState({ circleRadius: radius });
      }
    }, 30);
  };

  render() {
    const {
      theme, viewLevel, zoom, viewState,
      clickedLocation, sortedNearbyNews, currentNewsIndex,
      showPopup, circleRadius, keyword, selectedCategories
    } = this.state;

    const selectedNews = sortedNearbyNews[currentNewsIndex];
    const filteredData = {
      type: "FeatureCollection",
      features: this.getFilteredFeatures(),
    };

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div style={styles.controlsWrapper}>
          <DisplayControls
            theme={theme}
            viewLevel={viewLevel}
            zoom={zoom}
            onThemeChange={this.handleThemeChange}
            onViewLevelChange={this.handleViewLevelChange}
            onZoomChange={this.handleZoomChange}
            onResetView={this.handleResetView}
          />
          <NewsFilters
            keyword={keyword}
            selectedCategories={selectedCategories}
            onKeywordChange={this.handleKeywordChange}
            onCategoryChange={this.handleCategoryChange}
          />
        </div>

        <div style={styles.rightPanel}>
          <UserDetailsPanel
            userStats={{
              articles: 17,
              likes: 142,
              dislikes: 9,
              credibility: 86,
            }}
          />
        </div>

        <Map
          ref={this.mapRef}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={viewState}
          onClick={this.handleMapClick}
          onMove={(evt) => {
            this.handleZoomChange(evt.viewState.zoom, "scroll");
          }}
          mapStyle={{
            light: "mapbox://styles/mapbox/outdoors-v12",
            dark: "mapbox://styles/mapbox/dark-v11",
          }[theme]}
          style={{ width: "100%", height: "100%" }}
        >
          <HeatLayers
            filteredData={filteredData}
            clickedLocation={clickedLocation}
            circleRadius={circleRadius}
          />

          {selectedNews && showPopup && (
            <Popup
              longitude={selectedNews.geometry.coordinates[0]}
              latitude={selectedNews.geometry.coordinates[1]}
              closeButton={false}
              closeOnClick={false}
            >
              <PopupCard
                selectedNews={selectedNews}
                multipleNews={sortedNearbyNews.length > 1}
                onClose={() =>
                  this.setState({
                    showPopup: false,
                    clickedLocation: null,
                    circleRadius: 0,
                  })
                }
                onNext={() => {
                  const nextIndex = (currentNewsIndex + 1) % sortedNearbyNews.length;
                  this.setState({ currentNewsIndex: nextIndex });
                }}
              />
            </Popup>
          )}
        </Map>

        <AddNewsButton />
      </div>
    );
  }
}

const styles = {
  controlsWrapper: {
    position: "absolute",
    top: "12px",
    left: "10px",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "260px",
  },
  rightPanel: {
    position: "absolute",
    top: "12px",
    right: "10px",
    zIndex: 2,
    width: "260px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
};

export default HeatMap;