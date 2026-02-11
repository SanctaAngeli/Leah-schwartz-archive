import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Location } from '../../types';

interface SFBayAreaMapProps {
  locations: Location[];
  artworkCounts: Record<string, number>;
}

// Approximate coordinates for SF Bay Area locations (normalized to map viewBox)
const locationCoordinates: Record<string, { x: number; y: number }> = {
  'the-house': { x: 52, y: 48 },          // Home/Studio in SF
  'mount-tam': { x: 25, y: 25 },           // Mount Tamalpais
  'golden-gate': { x: 35, y: 42 },         // Golden Gate Bridge area
  'marin-headlands': { x: 30, y: 38 },     // Marin Headlands
  'point-reyes': { x: 8, y: 18 },          // Point Reyes
  'sausalito': { x: 38, y: 40 },           // Sausalito
  'berkeley': { x: 72, y: 45 },            // Berkeley
  'oakland': { x: 75, y: 55 },             // Oakland
  'mission-district': { x: 55, y: 55 },    // Mission District, SF
};

function SFBayAreaMap({ locations, artworkCounts }: SFBayAreaMapProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg
        viewBox="0 0 100 80"
        className="w-full h-auto"
        style={{ minHeight: '300px' }}
      >
        {/* Background - water */}
        <rect x="0" y="0" width="100" height="80" fill="#E8F4F8" />

        {/* San Francisco Bay - stylized */}
        <path
          d="M 40 35 Q 45 25 55 30 Q 75 30 80 50 Q 85 65 70 70 Q 55 75 50 65 Q 45 55 40 50 Q 35 40 40 35"
          fill="#C5DDE8"
          opacity="0.7"
        />

        {/* Pacific Ocean hint */}
        <rect x="0" y="30" width="20" height="50" fill="#C5DDE8" opacity="0.5" />

        {/* Land masses - simplified */}
        {/* Marin County */}
        <path
          d="M 5 0 L 40 0 L 40 35 Q 35 40 30 35 L 25 45 L 15 50 L 5 45 Z"
          fill="#E8E4D9"
          stroke="#D4CFC3"
          strokeWidth="0.5"
        />

        {/* San Francisco Peninsula */}
        <path
          d="M 40 40 L 60 38 L 65 50 L 60 70 L 45 75 L 35 65 L 35 50 Z"
          fill="#E8E4D9"
          stroke="#D4CFC3"
          strokeWidth="0.5"
        />

        {/* East Bay */}
        <path
          d="M 65 30 L 100 25 L 100 80 L 60 80 L 60 65 Q 70 60 75 50 Q 70 35 65 30"
          fill="#E8E4D9"
          stroke="#D4CFC3"
          strokeWidth="0.5"
        />

        {/* Golden Gate Bridge indicator */}
        <line
          x1="38"
          y1="39"
          x2="42"
          y2="41"
          stroke="#C7472A"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Location markers */}
        {locations.map((location, index) => {
          const coords = locationCoordinates[location.id];
          if (!coords) return null;

          const count = artworkCounts[location.id] || 0;
          const size = Math.min(6, 3 + Math.sqrt(count) * 0.5);

          return (
            <motion.g
              key={location.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/locations/${location.id}`)}
            >
              {/* Outer glow */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={size + 2}
                fill="rgba(26, 26, 26, 0.1)"
              />

              {/* Main marker */}
              <motion.circle
                cx={coords.x}
                cy={coords.y}
                r={size}
                fill="#1A1A1A"
                whileHover={{ scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />

              {/* Count indicator */}
              <text
                x={coords.x}
                y={coords.y + 0.8}
                textAnchor="middle"
                fontSize="3"
                fill="white"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {count}
              </text>

              {/* Label */}
              <text
                x={coords.x}
                y={coords.y + size + 5}
                textAnchor="middle"
                fontSize="3"
                fill="#4A4A4A"
                fontFamily="Inter, sans-serif"
              >
                {location.name}
              </text>
            </motion.g>
          );
        })}

        {/* Map title */}
        <text
          x="5"
          y="76"
          fontSize="3.5"
          fill="#8A8A8A"
          fontFamily="EB Garamond, serif"
          fontStyle="italic"
        >
          San Francisco Bay Area
        </text>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-text-primary" />
          <span className="font-body">Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body">Click to explore works</span>
        </div>
      </div>
    </div>
  );
}

export default SFBayAreaMap;
