import React from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiaGltYXZhcnNoaXRoNzc3IiwiYSI6ImNtNzZsZHBnZjA5NGoya285MXRybG0ycW0ifQ.zzE8yJ1AcOhd_Qe5CGs0SQ"; // Replace with your actual token

const SimpleMap = () => {
  const [selectedNews, setSelectedNews] = React.useState(null);

  // Example news locations (Static for now, but you can fetch from API)
  const newsLocations = [
    { id: 1, title: "Breaking News in New York", coords: [-74.006, 40.7128] },
    { id: 2, title: "Tech News in London", coords: [-0.1276, 51.5074] },
    { id: 3, title: "Politics Update in India", coords: [78.9629, 20.5937] },
  ];

  return (
    <Map
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 2,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {newsLocations.map((news) => (
        <Marker key={news.id} longitude={news.coords[0]} latitude={news.coords[1]}>
          <button
            onClick={() => setSelectedNews(news)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            📍
          </button>
        </Marker>
      ))}

      {selectedNews && (
        <Popup
          longitude={selectedNews.coords[0]}
          latitude={selectedNews.coords[1]}
          closeOnClick={true}
          onClose={() => setSelectedNews(null)}
        >
          {selectedNews.title}
        </Popup>
      )}
    </Map>
  );
};

export default SimpleMap;
