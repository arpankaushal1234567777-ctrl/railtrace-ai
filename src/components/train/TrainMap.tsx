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
  lat?: number;
  lng?: number;
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

export default function TrainMap({ route }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keep only stations with valid coordinates
  const validRoute = (route || []).filter(
    (station) =>
      typeof station.lat === "number" &&
      !Number.isNaN(station.lat) &&
      typeof station.lng === "number" &&
      !Number.isNaN(station.lng)
  );

  useEffect(() => {
    if (validRoute.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= validRoute.length - 1) {
          return 0;
        }

        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [validRoute.length]);

  // No valid coordinates available
  if (validRoute.length === 0) {
    return (
      <div className="rt-map-wrapper">
        <div className="flex h-[400px] items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400">
          🚆 Route map not available for this train yet.
        </div>
      </div>
    );
  }

  const positions = validRoute.map(
    (station) => [station.lat!, station.lng!] as [number, number]
  );

  const currentStation =
    validRoute[currentIndex] || validRoute[0];

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

        {validRoute.map((station, index) => (
          <Marker
            key={index}
            position={[station.lat!, station.lng!]}
          >
            <Popup>{station.stationName}</Popup>
          </Marker>
        ))}

        <Marker
          icon={trainIcon}
          position={[
            currentStation.lat!,
            currentStation.lng!,
          ]}
        >
          <Popup>🚆 Live Train Position</Popup>
        </Marker>

        <Polyline positions={positions} />
      </MapContainer>
    </div>
  );
}