import { Pagination, Space, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

import { Map } from "@/components/common/Map.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { AdvertList } from "@/components/AdvertList/AdvertList.jsx";
import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";
import { AdvertModal } from "@/components/AdvertModal/AdvertModal.jsx";

import { useGetAdvertByIdQuery, useSearchAdvertsQuery } from "@/store/services/adverts.js";
import { useSearchParams } from "@/hooks/useSearchParams.js";
import { useMapMarkers } from "@/hooks/useMapMarkers.js";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";
import { formatSourceFeatures } from "@/utils/format.js";
import styles from "./AdvertsMap.module.css";

const ITEMS_PER_PAGE = 20;

export function AdvertsMap() {
  const screen = useBreakpoint();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRealtyId, setSelectedRealtyId] = useState(null);
  const { searchParams, updateSearchParams } = useSearchParams();

  const map = useRef(null);
  const { removeAllMarkers, createMarkers } = useMapMarkers();
  const hoveredPointId = useRef(null);
  const activePointId = useRef(null);

  const { data: advertsResponse, isLoading, isFetching } = useSearchAdvertsQuery(
    { ...searchParams, limit: ITEMS_PER_PAGE },
    { refetchOnMountOrArgChange: true }
  );

  const { data: advert, isFetching: loadingAdvert } = useGetAdvertByIdQuery(
    selectedRealtyId,
    { skip: !selectedRealtyId, refetchOnMountOrArgChange: true }
  );

  const { total = 0, adverts = [] } = useMemo(() => advertsResponse || {}, [advertsResponse]);

  const updateFeatureState = (id, states) => {
    Object.entries(states).forEach(([key, value]) => {
      map.current.setFeatureState(
        { source: 'property', id },
        { [key]: value }
      );
    });
  };

  const selectRealty = (id, coordinates) => {
    const selectedMarker = document.querySelector('.property-marker--selected');
    const marker = document.querySelector(`.property-marker[data-marker-id="${id}"]`);

    selectedMarker?.classList?.remove('property-marker--selected');

    if(activePointId.current !== null) {
      updateFeatureState(activePointId.current, { active: false });
    }

    activePointId.current = id;
    setSelectedRealtyId(id);

    if (!screen.md) setOpenModal(true);

    marker.classList.add('property-marker--selected');
    updateFeatureState(id, { active: true });

    if (coordinates) {
      map.current.flyTo({ center: coordinates });
    }
  };

  const unselectRealty = () => {
    const selectedMarker = document.querySelector('.property-marker--selected');
    selectedMarker?.classList?.remove('property-marker--selected');

    updateFeatureState(activePointId.current, { active: false });
    activePointId.current = null;
    setSelectedRealtyId(null);
  }

  const handleMapClick = (e) => {
    const target = e.originalEvent.target;
    const isMarkerClick = target?.classList?.contains('property-marker');

    if (!isMarkerClick && activePointId.current !== null) {
      const features = map.current.queryRenderedFeatures(e.point, { layers: ['property'] });

      if (features.length === 0) {
        unselectRealty();

        if (!screen.md) setOpenModal(false);
      }
    }
  };

  const handlePropertyClick = (e) => {
    const realty = e.features[0];
    selectRealty(realty.id, [e.lngLat.lng, e.lngLat.lat]);
  };

  const handlePropertyHover = (e, isEntering) => {
    const realty = e.features[0];

    if (hoveredPointId.current !== null) {
      updateFeatureState(hoveredPointId.current, { hover: false });
    }

    if (isEntering) {
      hoveredPointId.current = realty.id;
      updateFeatureState(hoveredPointId.current, { hover: true });
      map.current.getCanvas().style.cursor = 'pointer';
    } else {
      hoveredPointId.current = null;
      map.current.getCanvas().style.cursor = '';
    }
  };

  const handleMapLoad = (mapInstance) => {
    map.current = mapInstance;

    mapInstance.addSource('property', {
      'type': 'geojson',
      'data': formatSourceFeatures(adverts)
    });

    createMarkers(mapInstance, adverts, selectRealty);

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

    mapInstance.on('click', handleMapClick);
    mapInstance.on('click', 'property', handlePropertyClick);
    mapInstance.on('mouseenter', 'property', e => handlePropertyHover(e, true));
    mapInstance.on('mouseleave', 'property', e => handlePropertyHover(e, false));
  };

  const closeRealtyPopup = () => {
    setOpenModal(false);
    unselectRealty()
  }

  useEffect(() => {
    if (map.current) {
      removeAllMarkers();
      map.current.getSource("property").setData(formatSourceFeatures(adverts));
      createMarkers(map.current, adverts, selectRealty);
    }
  }, [adverts]);

  if (isLoading) return <Loading />;

  return (
    <Space style={{ width: "100%" }} size="middle" direction="vertical">
      <div style={{ position: "relative" }}>
        {selectedRealtyId && !loadingAdvert && (
          !screen.md ? (
            <AdvertModal
              open={openModal}
              onClose={closeRealtyPopup}
              loading={loadingAdvert}
              advert={advert}
            />
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
        defaultPageSize={ITEMS_PER_PAGE}
        total={total}
      />
    </Space>
  );
}