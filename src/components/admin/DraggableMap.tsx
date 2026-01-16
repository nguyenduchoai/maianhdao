'use client';

import { useEffect, useRef, useState } from 'react';

interface DraggableMapProps {
    lat: number;
    lng: number;
    onLocationChange: (lat: number, lng: number) => void;
}

export default function DraggableMap({ lat, lng, onLocationChange }: DraggableMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });
    }, []);

    useEffect(() => {
        if (!L || !mapRef.current || mapInstanceRef.current) return;

        // Initialize map with max zoom
        const map = L.map(mapRef.current, {
            center: [lat, lng],
            zoom: 20, // Max zoom for detail
            maxZoom: 22,
            minZoom: 15,
        });

        // Add tile layer with max zoom support
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 22,
            maxNativeZoom: 19,
        }).addTo(map);

        // Create draggable marker
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ec4899, #f472b6);
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: move;
            ">🌸</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        const marker = L.marker([lat, lng], {
            icon: customIcon,
            draggable: true,
        }).addTo(map);

        // Handle drag events
        marker.on('dragend', function (e) {
            const position = e.target.getLatLng();
            onLocationChange(position.lat, position.lng);
        });

        // Click on map to move marker
        map.on('click', function (e) {
            marker.setLatLng(e.latlng);
            onLocationChange(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, [L]);

    // Update marker position when lat/lng changes externally
    useEffect(() => {
        if (markerRef.current && mapInstanceRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstanceRef.current.setView([lat, lng]);
        }
    }, [lat, lng]);

    if (!L) {
        return (
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div
                ref={mapRef}
                className="h-80 rounded-lg border-2 border-dashed border-pink-300 overflow-hidden"
            />
            <p className="text-sm text-gray-500 text-center">
                💡 <strong>Kéo thả</strong> marker hoặc <strong>click</strong> trên bản đồ để chọn vị trí cây
            </p>
        </div>
    );
}
