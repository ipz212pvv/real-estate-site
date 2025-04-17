import { Modal, Pagination, Space, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { Marker } from "@maptiler/sdk";

import { Map } from "@/components/common/Map.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { AdvertList } from "@/components/AdvertList/AdvertList.jsx";
import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

import { useGetAdvertByIdQuery, useSearchAdvertsQuery } from "@/store/services/adverts.js";
import { useSearchParams } from "@/hooks/useSearchParams.js";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";
import styles from "./AdvertsMap.module.css";

function formatSourceFeatures(data) {
  const features = data.map(({ id, locationForAdvert: { lat, lon } }) => ({
    id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    },
  }));

  return {
    'type': 'FeatureCollection',
    'features': features
  }
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
  const screen = useBreakpoint();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRealtyId, setSelectedRealtyId] = useState(null);
  const { searchParams, updateSearchParams } = useSearchParams();

  const map = useRef(null);
  const markers = useRef([]);
  const hoveredPointId = useRef(null);
  const activePointId = useRef(null);

  const { data: advertsResponse, isLoading, isFetching } = useSearchAdvertsQuery(
    { ...searchParams, limit: 20 },
    { refetchOnMountOrArgChange: true }
  );
  const { data: advert, isFetching: loadingAdvert } = useGetAdvertByIdQuery(
    selectedRealtyId,
    { skip: !selectedRealtyId, refetchOnMountOrArgChange: true }
  );

  const { total = 0, adverts = [] } = useMemo(() => advertsResponse || {}, [advertsResponse]);

  const selectRealty = (id) => {
    const selectedMarker = document.querySelector('.property-marker--selected');
    const marker = document.querySelector(`.property-marker[data-marker-id="${id}"]`);

    selectedMarker?.classList?.remove('property-marker--selected');

    if(activePointId.current !== null) {
      map.current.setFeatureState(
        { source: 'property', id: activePointId.current },
        { active: false }
      );
    }

    activePointId.current = id
    setSelectedRealtyId(id);

    if (!screen.md) setOpenModal(true);

    marker.classList.add('property-marker--selected');

    map.current.setFeatureState(
      { source: 'property', id: activePointId.current },
      { active: true }
    );
  }

  const removeAllMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  }

  const createAdvertsMarkers = () => {
    adverts.forEach(({ id, locationForAdvert, price_usd }) => {
      const { lat, lon } = locationForAdvert;
      const coordinates = [lon, lat];
      const marker = document.createElement('div');

      marker.className = 'property-marker';
      marker.textContent = formatCurrency(price_usd);
      marker.dataset.markerId = id;

      marker.addEventListener('click', () => {
        selectRealty(id);

        map.current.flyTo({
          center: coordinates,
        });
      })

      const markerInstance = new Marker({ element: marker, anchor: "bottom", offset: [0, -5] })
        .setLngLat(coordinates)
        .addTo(map.current);

      markers.current.push(markerInstance);
    })
  }

  useEffect(() => {
    if (map.current) {
      removeAllMarkers();
      map.current.getSource("property").setData(formatSourceFeatures(adverts));
      createAdvertsMarkers()
    }
  }, [adverts])

  if (isLoading) return <Loading />;

  const handleMapLoad = (mapInstance) => {
    map.current = mapInstance;

    mapInstance.addSource('property', {
      'type': 'geojson',
      'data': formatSourceFeatures(adverts)
    });

    createAdvertsMarkers()

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

    mapInstance.on('click', (e) => {
      const target = e.originalEvent.target;
      const isMarkerClick = target?.classList?.contains('property-marker');

      if (!isMarkerClick && activePointId.current !== null) {
        const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['property'] });

        if (features.length === 0) {
          const selectedMarker = document.querySelector('.property-marker--selected');
          selectedMarker?.classList?.remove('property-marker--selected');

          map.current.setFeatureState(
            { source: 'property', id: activePointId.current },
            { active: false }
          );

          activePointId.current = null;
          setSelectedRealtyId(null);

          if (!screen.md) setOpenModal(false);
        }
      }
    })

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

      if (hoveredPointId.current !== null) {
        mapInstance.setFeatureState(
          { source: 'property', id: hoveredPointId.current },
          { hover: false }
        );
      }

      hoveredPointId.current = realty.id;
      mapInstance.setFeatureState(
        { source: 'property', id: hoveredPointId.current },
        { hover: true }
      );

      mapInstance.getCanvas().style.cursor = 'pointer';
    });

    mapInstance.on('mouseleave', 'property', () => {
      if (hoveredPointId.current !== null) {
        mapInstance.setFeatureState(
          { source: 'property', id: hoveredPointId.current },
          { hover: false }
        );
      }

      hoveredPointId.current = null;

      mapInstance.getCanvas().style.cursor = '';
    });
  }

  return (
    <Space style={{ width: "100%" }} size="middle" direction="vertical">
      <div style={{ position: "relative" }}>
        {selectedRealtyId && !loadingAdvert && (
          !screen.md ? (
            <Modal
              styles={{ content: { paddingTop: 40, backgroundColor: "transparent", boxShadow: "none" } }}
              open={openModal}
              onCancel={() => setOpenModal(false)}
              loading={loadingAdvert}
              footer={null}
            >
              <AdvertCard link={`/adverts/${advert.id}`} advert={advert} />
            </Modal>
          ) : (
            <div className={styles["card-popup"]}>
              <AdvertCard link={`/adverts/${advert.id}`} advert={advert} />
            </div>
          )
        )}
        <Map className={styles.map} style={{ height: 600 }} onLoad={handleMapLoad}/>
      </div>
      <Typography.Title level={3} style={{ marginBottom: 0 }}>Оголошення</Typography.Title>
      <div style={{ minHeight: 300 }}>
        {isFetching ? <Loading /> : <AdvertList adverts={adverts} />}
      </div>
      <Pagination
        onChange={(page) => updateSearchParams("page", page)}
        align="center"
        hideOnSinglePage={true}
        defaultCurrent={1}
        defaultPageSize={20}
        total={total}
      />
    </Space>
  )
}
