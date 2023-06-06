import React, { Fragment } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
const containerStyle = {
  width : '100%',
  height : '600px',
  marginTop : '20px',
 
};

const center = {
  lat: 	26.922070,
  lng: 75.778885
};
function GoogleMapC() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCu_iJ7k3FD95uLMmOHiZMRYECHZdWgFq8"  //need to define your google api key 
      })
      const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
    return ( 
        <div style={{position:'relative'}}>
    {isLoaded ? <GoogleMap
    id="map-container"
    center={center}
    zoom={10}
    onLoad={onLoad}
    onUnmount={onUnmount}
  >
    { /* Child components, such as markers, info windows, etc. */ }
    <></>
  </GoogleMap>
  :<></>
    }

  </div>

  

     );
}

export default GoogleMapC;