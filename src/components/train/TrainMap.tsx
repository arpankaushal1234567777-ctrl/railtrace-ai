"use client";

import { useEffect, useState } from "react";

import "@/lib/fixLeaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

interface Station {
  stationName: string;
  lat: number;
  lng: number;
}

interface Props {
  route: Station[];
}

const trainIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/713/713311.png",

  iconSize: [38, 38],

  iconAnchor: [19, 19],

  popupAnchor: [0, -20],
});

export default function TrainMap({
  route,
}: Props) {

  const [currentIndex, setCurrentIndex] =
    useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentIndex((prev) => {

        if (prev >= route.length - 1) {
          return 0;
        }

        return prev + 1;
      });

    }, 3000);

    return () => clearInterval(interval);

  }, [route]);

  const positions = route.map((station) => [
    station.lat,
    station.lng,
  ]) as [number, number][];

  return (
    <div className="rt-map-wrapper">

      <MapContainer
        center={positions[0]}
        zoom={5}
        scrollWheelZoom={true}
        className="rt-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {route.map((station, index) => (
          <Marker
            key={index}
            position={[station.lat, station.lng]}
          >
            <Popup>
              {station.stationName}
            </Popup>
          </Marker>
        ))}

        <Marker
  icon={trainIcon}
  position={[
    route[currentIndex].lat,
    route[currentIndex].lng,
  ]}
>
          <Popup>
            🚆 Live Train Position
          </Popup>
        </Marker>

        <Polyline positions={positions} />

      </MapContainer>

    </div>
  );
}