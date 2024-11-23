import React from 'react';

export default function StockGraph() {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
      >
        <defs>
          <linearGradient id="stockLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A90E2" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#4A90E2; #9B4DCA; #4A90E2"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#9B4DCA" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#9B4DCA; #4A90E2; #9B4DCA"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background bars */}
        {[...Array(10)].map((_, i) => (
          <rect
            key={`bar-${i}`}
            x={i * 100}
            y={100 - (i * 8 + 20)}
            width="80"
            height={i * 8 + 20}
            fill="url(#stockLine)"
            opacity="0.1"
            rx="4"
          >
            <animate
              attributeName="height"
              values={`${i * 8 + 20};${i * 8 + 25};${i * 8 + 20}`}
              dur="2s"
              repeatCount="indefinite"
              begin={`${i * 0.2}s`}
            />
          </rect>
        ))}

        {/* Main trend line */}
        <path
          d="M0,80 Q250,70 500,50 T1000,20"
          fill="none"
          stroke="url(#stockLine)"
          strokeWidth="3"
          filter="url(#glow)"
          className="animate-draw"
        >
          <animate
            attributeName="d"
            values="
              M0,80 Q250,70 500,50 T1000,20;
              M0,70 Q250,60 500,40 T1000,10;
              M0,80 Q250,70 500,50 T1000,20
            "
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Glowing dots */}
        {[0, 250, 500, 750, 1000].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={50}
            r="3"
            fill="#fff"
            className="animate-pulse"
            filter="url(#glow)"
          >
            <animate
              attributeName="cy"
              values={`${80 - i * 15};${70 - i * 15};${80 - i * 15}`}
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}