import React from "react";
import { GoogleMap, useJsApiLoader, Circle,Marker  } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
  marginTop: "20px",
};



const circleOptions = {
  strokeColor: "green", // Adjust stroke color as needed
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "green", // Adjust fill color as needed
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 1000, // in meters
};

function GoogleMapC(props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCBOSXzH5COCV1vK-Zlau9oQwbt3sPawao", // Replace with your actual API key
  });
  const center = {
    lat: props.latitude, // Latitude of your default location
    lng: props.longitude, // Longitude of your default location
  };
  return isLoaded ? (
    <GoogleMap
      id="map-container"
      
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15} // Adjust the zoom level as needed
    >
      {/* Circle overlay */}
      <Circle center={center} options={circleOptions} />

      {/* Marker for the default location */}
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default GoogleMapC;
