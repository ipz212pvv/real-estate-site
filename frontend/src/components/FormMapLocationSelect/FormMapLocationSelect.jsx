import { Marker } from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/geocoding-control/style.css";

import { Map } from "@/components/common/Map.jsx";

export function FormMapLocationSelect({ initialValue, onChange }) {
  const handleMapLoad = (mapInstance) => {
    let marker = null;

    const gc = new GeocodingControl({
      placeholder: "Пошук",
      country: "ua",
    });

    const addMarker = (lngLat) => {
      const { lng, lat } = lngLat;

      if(marker) {
        marker.remove();
      }

      marker = new Marker({
        color: "#f4801a",
      })
      .setLngLat([lng, lat])
      .addTo(mapInstance);
    }

    if (initialValue) {
      addMarker(initialValue);
    }

    mapInstance.addControl(gc, 'top-left');

    mapInstance.on('click', (e) => {
      addMarker(e.lngLat);

      onChange(e.lngLat);
    })
  }

  return(
    <Map style={{ height: 400 }} onLoad={handleMapLoad} />
  )
}