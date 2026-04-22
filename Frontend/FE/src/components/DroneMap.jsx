import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix lỗi hiển thị icon mặc định của Leaflet trong React
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Icon Drone (Bạn có thể thay link ảnh khác nếu thích)
const droneIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3124/3124165.png', 
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const DroneMap = ({ dronePosition, destination, routePath }) => {
    // Tọa độ trung tâm mặc định (Ví dụ: TP.HCM)
    const defaultCenter = [10.8411, 106.8099]; 

    return (
        <MapContainer center={defaultCenter} zoom={15} style={{ height: "400px", width: "100%", borderRadius: "10px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* Drone Marker */}
            {dronePosition && (
                <Marker position={dronePosition} icon={droneIcon}>
                    <Popup>Drone đang bay</Popup>
                </Marker>
            )}

            {/* Điểm đến (Khách hàng) */}
            {destination && (
                <Marker position={destination} icon={defaultIcon}>
                    <Popup>Vị trí khách hàng</Popup>
                </Marker>
            )}

            {/* Đường bay (Vẽ đường nối) */}
            {routePath && <Polyline positions={routePath} color="blue" dashArray="5, 10" />}
        </MapContainer>
    );
};

export default DroneMap;