import { useParams } from "react-router";
import { useEffect, useRef } from "react";
import { Marker, Popup } from "@maptiler/sdk";
import { Button, List, notification, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { Map } from "@/components/common/Map.jsx";

import {
  useAddAdvertNearbyPlaceMutation,
  useDeleteAdvertNearbyPlaceMutation
} from "@/store/services/advert-nearby-places.js";
import { formatSecondsToMinutes } from "@/utils/format.js";
import { gray } from "@ant-design/colors";
import styles from "./NearbyPlacesSelect.module.css";

export function NearbyPlacesSelect({ initialValue = [], location }) {
  const { id } = useParams();

  const [createPlace] = useAddAdvertNearbyPlaceMutation();
  const [deletePlace] = useDeleteAdvertNearbyPlaceMutation();

  const markers = useRef([]);
  const map = useRef(null);
  const popup = useRef(null);

  const zoomToLocation = () => {
    map.current.jumpTo({ center: location, zoom: 16 });
  }

  const createMarker = (id, coordinates) => {
    const { lng, lat } = coordinates;
    const marker = document.createElement('div');

    marker.className = 'place-marker';
    marker.textContent = markers.current.length + 1;

    const markerInstance = new Marker({
      element: marker,
      anchor: "center",
      offset: [0, 0]
    })
    .setLngLat([lng, lat])
    .addTo(map.current);

    markers.current.push({ id, marker: markerInstance });
  }

  const removeMarker = (id) => {
    markers.current = markers.current.filter(marker => {
      const currentMarker = marker.id === id;

      if (currentMarker) {
        marker.marker.remove();
      }

      return !currentMarker;
    });
  }

  const renderMarkers = (markers) => {
    markers.forEach(({ id, placeForAdvertNearby }) => {
      const { lat, lon } = placeForAdvertNearby.locationForNearbyPlace;
      createMarker(id, { lng: lon, lat })
    });
  }

  const openPopup = (coordinates) => {
    const { lng, lat } = coordinates;

    popup.current?.remove();

    const newPopup = new Popup()
      .setLngLat([lng, lat])
      .setHTML(`
        <div>
          <h3>Додати це місце?</h3>
        </div>
      `)
      .addTo(map.current);

    popup.current = newPopup;

    const popupDiv = newPopup._content;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.marginTop = '10px';

    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Додати';
    confirmButton.style.padding = '5px 10px';
    confirmButton.style.backgroundColor = '#f4801a';
    confirmButton.style.color = 'white';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '2px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.type = 'button';

    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Скасувати';
    cancelButton.style.padding = '5px 10px';
    cancelButton.style.backgroundColor = '#f5f5f5';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '2px';
    cancelButton.style.cursor = 'pointer';

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    popupDiv.appendChild(buttonContainer);

    confirmButton.addEventListener('click', () => {
      addPlace(coordinates);
    });

    cancelButton.addEventListener('click', () => {
      newPopup.remove();
    });
  }

  const handleMapLoad = (mapInstance) => {
    map.current = mapInstance;

    if (location) {
      zoomToLocation()
    }

    renderMarkers(initialValue);

    map.current.on('click', (e) => openPopup(e.lngLat));
  };

  const addPlace = (coordinates) => {
    const { lng, lat } = coordinates;

    popup.current._content.classList.add('loading');

    createPlace({ advertId: id, lat, lon: lng })
      .unwrap()
      .then(({ id }) => {
        createMarker(id, coordinates)
        popup.current.remove();
      })
      .catch(err => {
        popup.current._content.classList.remove('loading');

        notification.error({
          message: "Помилка",
          description: err.message,
        })
      })
  };

  const removePlace = (placeId) => {
    deletePlace({ advertId: id, placeId: placeId })
      .unwrap()
      .then(() => removeMarker(placeId))
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        })
      })
  };

  useEffect(() => {
    if (map.current && location) {
      zoomToLocation()
    }
  }, [location]);

  return (
    <div>
      <Map className={styles.map} style={{ height: 400 }} onLoad={handleMapLoad} />
      
      {initialValue.length > 0 && (
        <List
          style={{ marginTop: 16 }}
          size="small"
          bordered
          dataSource={initialValue}
          renderItem={({ id, duration, placeForAdvertNearby: { name } }, i) => (
            <List.Item
              actions={[
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removePlace(id)}
                />
              ]}
            >
              <Typography.Text><span style={{ color: gray[3], marginRight: 8 }}>{i + 1}.</span> {name}</Typography.Text>
              <Typography.Text style={{ color: gray[3] }}>{formatSecondsToMinutes(duration)}</Typography.Text>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}