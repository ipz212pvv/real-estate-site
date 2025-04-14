import { useEffect, useRef } from "react";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

export function Map(props) {
  const { onLoad, options, style = {}, className } = props;
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      center: [31.490773812277094, 49.01605198088264],
      zoom: 5.5,
      language: maptilersdk.Language.UKRAINIAN,
      maxBounds: [
        [21.79545514866079, 43.424418976677686],
        [42.82825058830223, 52.70793206338687],
      ],
      ...options
    });

    if (onLoad) {
      map.current.on('load', () => {
        map.current.setPaintProperty("Building 3D", 'fill-extrusion-opacity', 0.9);

        onLoad(map.current)
      });
    }
  }, [])

  return (
    <div className={className} style={{ width: "100%", borderRadius: 8, ...style }} ref={mapContainer}/>
  )
}