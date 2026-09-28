import React from "react";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
  marginTop: "20px",
};

const circleOptions = {
  strokeColor: "#145a48",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#145a48",
  fillOpacity: 0.22,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 1000,
};

function GoogleMapC(props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });
  const lat = Number(props.latitude);
  const lng = Number(props.longitude);
  const center = {
    lat,
    lng,
  };
  const mapStyle = {
    ...containerStyle,
    height: props.height || containerStyle.height,
    marginTop:
      props.marginTop !== undefined ? props.marginTop : containerStyle.marginTop,
    borderRadius: props.borderRadius || "0px",
  };
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return <div>Location unavailable</div>;
  }
  return isLoaded ? (
    <GoogleMap
      id="map-container"
      mapContainerStyle={mapStyle}
      center={center}
      zoom={props.zoom || 14}
      options={{
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: props.gestureHandling || "cooperative",
        keyboardShortcuts: false,
      }}
    >
      {props.showCircle !== false && (
        <Circle center={center} radius={circleOptions.radius} options={circleOptions} />
      )}
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
}

export default GoogleMapC;
