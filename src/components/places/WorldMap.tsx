import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

interface MappablePlace {
  id: string;
  name: string;
  region?: string;
  lat?: number;
  lng?: number;
  artwork_ids?: string[];
}

// Region-colored pins so the map reads as a visual summary of Leah's travels
const REGION_COLOR: Record<string, string> = {
  'bay-area':            '#8B7355',
  'california':          '#A08060',
  'desert':              '#C47A3A',
  'high-sierra':         '#5B6B7A',
  'france':              '#5A7AAA',
  'italy':               '#B84C3E',
  'greece':              '#3E8FC4',
  'turkey':              '#C49650',
  'japan':               '#B95370',
  'india':               '#D68A30',
  'nepal':               '#5E7850',
  'botanizing-in-kenya': '#7A5A3A',
  'britain':             '#4C6B8C',
  'other':               '#888888',
};

interface Props {
  places: MappablePlace[];
  height?: number;
}

export default function WorldMap({ places, height = 460 }: Props): JSX.Element {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-soft border border-[#E8E2D5]"
      style={{ height }}
    >
      <MapContainer
        center={[30, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: '#F4EEE3' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {places.map((p) => {
          const color = REGION_COLOR[p.region || 'other'] || '#888';
          const count = p.artwork_ids?.length || 0;
          const radius = Math.max(5, Math.min(14, 4 + Math.sqrt(count) * 2));
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat!, p.lng!]}
              radius={radius}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: color,
                fillOpacity: 0.85,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14 }}>
                  <strong>{p.name}</strong>
                  {count > 0 && (
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {count} work{count > 1 ? 's' : ''}
                    </div>
                  )}
                  <Link
                    to={`/places/${p.id}`}
                    style={{ fontSize: 11, color: '#8B7355', textDecoration: 'underline' }}
                  >
                    Open →
                  </Link>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
