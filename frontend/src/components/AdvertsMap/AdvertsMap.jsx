import { Space, Typography } from "antd";
import { useState } from "react";
import { Marker } from "@maptiler/sdk";

import { Map } from "@/components/common/Map.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { AdvertList } from "@/components/AdvertList/AdvertList.jsx";
import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

import { useGetAdvertByIdQuery, useSearchAdvertsQuery } from "@/store/services/adverts.js";
import { useSearchParams } from "@/hooks/useSearchParams.js";
import styles from "./AdvertsMap.module.css";

function formatSourceFeatures(data) {
  return data.map(({ id, locationForAdvert: { lat, lon }, price_usd }) => ({
    id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    },
    properties: { 'price': `${price_usd} $` }
  }))
}

function formatCurrency(number) {
  return new Intl.NumberFormat("uk-UA",
    {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      trailingZeroDisplay: "stripIfInteger",
    })
  .format(number);
}

export function AdvertsMap() {
  const [selectedRealtyId, setSelectedRealtyId] = useState(null);
  const { searchParams } = useSearchParams();
  const { data: adverts, isLoading } = useSearchAdvertsQuery(searchParams);
  const { data: advert, isFetching: loadingAdvert } = useGetAdvertByIdQuery(
    selectedRealtyId,
    { skip: !selectedRealtyId, refetchOnMountOrArgChange: true }
  );

  const handleMapLoad = (mapInstance) => {
    let hoveredPointId = null;
    let activePointId = null;

    const selectRealty = (id) => {
      const selectedMarker = document.querySelector('.property-marker--selected');
      const marker = document.querySelector(`.property-marker[data-marker-id="${id}"]`);

      selectedMarker?.classList?.remove('property-marker--selected');

      if(activePointId !== null) {
        mapInstance.setFeatureState(
          { source: 'property', id: activePointId },
          { active: false }
        );
      }

      activePointId = id
      setSelectedRealtyId(id);

      marker.classList.add('property-marker--selected');

      mapInstance.setFeatureState(
        { source: 'property', id: activePointId },
        { active: true }
      );
    }

    //Property source
    mapInstance.addSource('property', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': formatSourceFeatures(adverts)
      }
    });

    /*mapInstance.on('click', (e) => {
      console.log(mapInstance.queryRenderedFeatures(e.point))
    })*/

    //Property points
    mapInstance.addLayer({
      id: 'property',
      type: 'circle',
      source: 'property',
      paint: {
        "circle-radius": {
          stops: [[8, 2], [13, 3], [16, 6]]
        },
        'circle-color': [
          "case",
          ["==", ["feature-state", "active"], true],
          "#F4801A",
          "white"
        ],
        "circle-stroke-width": [
          "case",
          ["any",
            ["==", ["feature-state", "hover"], true],
            ["==", ["feature-state", "active"], true]
          ],
          3,
          1
        ],
        "circle-stroke-color": "#F4801A"
      }
    });

    //Property points marker
    adverts.forEach(({ id, locationForAdvert, price_usd }) => {
      const { lat, lon } = locationForAdvert;
      const coordinates = [lon, lat];
      const marker = document.createElement('div');

      marker.className = 'property-marker';
      marker.textContent = formatCurrency(price_usd);
      marker.dataset.markerId = id;

      marker.addEventListener('click', () => {
        selectRealty(id, coordinates);

        mapInstance.flyTo({
          center: coordinates,
        });
      })

      new Marker({ element: marker, anchor: "bottom", offset: [0, -5] })
        .setLngLat(coordinates)
        .addTo(mapInstance);
    })

    //Select realty
    mapInstance.on('click', 'property', (e) => {
      const realty = e.features[0];
      const realtyId = realty.id;

      selectRealty(realtyId);

      mapInstance.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
      });
    });

    mapInstance.on('mouseenter', 'property', (e) => {
      const realty = e.features[0];

      if (hoveredPointId !== null) {
        mapInstance.setFeatureState(
          { source: 'property', id: hoveredPointId },
          { hover: false }
        );
      }

      hoveredPointId = realty.id;
      mapInstance.setFeatureState(
        { source: 'property', id: hoveredPointId },
        { hover: true }
      );

      mapInstance.getCanvas().style.cursor = 'pointer';
    });

    mapInstance.on('mouseleave', 'property', () => {
      if (hoveredPointId !== null) {
        mapInstance.setFeatureState(
          { source: 'property', id: hoveredPointId },
          { hover: false }
        );
      }

      hoveredPointId = null;

      mapInstance.getCanvas().style.cursor = '';
    });
  }

  if (isLoading) return <Loading />;

  return (
    <Space style={{ width: "100%" }} size="middle" direction="vertical">
      <div style={{ position: "relative" }}>
        {advert && (
          <Loading spinning={loadingAdvert}>
            <div className={styles["card-popup"]}>
              <AdvertCard link={`/adverts/${advert.id}`} advert={advert} />
            </div>
          </Loading>
        )}
        <Map className={styles.map} style={{ height: 600 }} onLoad={handleMapLoad}/>
      </div>
      <Typography.Title level={3} style={{ marginBottom: 0 }}>Оголошення</Typography.Title>
      <AdvertList adverts={adverts} />
    </Space>
  )
}