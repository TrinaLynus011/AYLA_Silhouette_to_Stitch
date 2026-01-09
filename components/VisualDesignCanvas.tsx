'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BodyType, OutfitDesign, DigitalTwinCoords } from '@/types';
import { DigitalTwinSystem } from '@/utils/digitalTwin';

interface VisualDesignCanvasProps {
  bodyType: BodyType;
  outfitDesign: OutfitDesign;
  onDesignUpdate?: (design: OutfitDesign) => void;
}

export default function VisualDesignCanvas({ 
  bodyType, 
  outfitDesign,
  onDesignUpdate 
}: VisualDesignCanvasProps) {
  const [coords, setCoords] = useState<DigitalTwinCoords>(() => 
    DigitalTwinSystem.generateCoordinates(bodyType.ratios)
  );
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const newCoords = DigitalTwinSystem.generateCoordinates(bodyType.ratios);
    setCoords(newCoords);
  }, [bodyType]);

  const silhouettePath = DigitalTwinSystem.generateSilhouettePath(coords);
  const outfitPath = DigitalTwinSystem.generateOutfitOverlay(coords, outfitDesign);

  // Debug logging
  useEffect(() => {
    console.log('📐 BODY COORDS:', coords);
    console.log('👤 SILHOUETTE PATH:', silhouettePath ? 'Generated' : 'MISSING');
    console.log('👗 OUTFIT PATH:', outfitPath ? 'Generated' : 'MISSING');
  }, [coords, silhouettePath, outfitPath]);

  return (
    <div className="card h-full">
      {/* Canvas Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Design Canvas</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
          >
            −
          </button>
          <span className="text-sm text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="canvas-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#canvas-grid)" />
          </svg>
        </div>

        {/* Main Canvas SVG */}
        <motion.div
          className="relative"
          animate={{ scale: zoom }}
          transition={{ duration: 0.2 }}
        >
          <svg
            viewBox="0 0 400 600"
            className="w-full h-[500px] mx-auto"
            style={{ maxWidth: '350px' }}
          >
            {/* Body Silhouette - ALWAYS VISIBLE */}
            <motion.path
              d={silhouettePath}
              fill="rgba(249, 115, 22, 0.15)"
              stroke="rgb(249, 115, 22)"
              strokeWidth="3"
              strokeDasharray="5,5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            {/* Body Measurement Points - ALWAYS VISIBLE */}
            <circle cx={coords.shoulders.x * 400} cy={coords.shoulders.y * 600} r="4" fill="rgb(249, 115, 22)" />
            <circle cx={coords.waist.x * 400} cy={coords.waist.y * 600} r="4" fill="rgb(249, 115, 22)" />
            <circle cx={coords.hips.x * 400} cy={coords.hips.y * 600} r="4" fill="rgb(249, 115, 22)" />

            {/* Outfit Overlay with COMPLETE Construction Layers */}
            <AnimatePresence>
              <motion.g key={JSON.stringify(outfitDesign)}>
                {/* Layer 1: Base Outfit Fill */}
                <motion.path
                  d={outfitPath}
                  fill={outfitDesign.color_scheme.primary_color || 'rgba(59, 130, 246, 0.3)'}
                  stroke="none"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Layer 2: Seam Lines (Dashed, 2px, Dark Gray) */}
                <motion.path
                  d={outfitPath}
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.1 }}
                />
                
                {/* Layer 3: Panel Divisions (Solid, 1px, Medium Gray) */}
                <motion.line
                  x1={coords.shoulders.x * 400}
                  y1={coords.shoulders.y * 600}
                  x2={coords.waist.x * 400}
                  y2={coords.waist.y * 600}
                  stroke="#6b7280"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
                
                {/* Layer 4: Dart Markers (Triangular, Gray) */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }}>
                  {/* Left Bust Dart */}
                  <path
                    d={`M ${(coords.shoulders.x - 0.05) * 400} ${(coords.shoulders.y + 0.05) * 600} 
                        L ${(coords.shoulders.x - 0.03) * 400} ${(coords.shoulders.y + 0.12) * 600} 
                        L ${(coords.shoulders.x - 0.07) * 400} ${(coords.shoulders.y + 0.12) * 600} Z`}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  {/* Right Bust Dart */}
                  <path
                    d={`M ${(coords.shoulders.x + 0.05) * 400} ${(coords.shoulders.y + 0.05) * 600} 
                        L ${(coords.shoulders.x + 0.03) * 400} ${(coords.shoulders.y + 0.12) * 600} 
                        L ${(coords.shoulders.x + 0.07) * 400} ${(coords.shoulders.y + 0.12) * 600} Z`}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  {/* Waist Darts */}
                  <path
                    d={`M ${(coords.waist.x - 0.04) * 400} ${(coords.waist.y - 0.05) * 600} 
                        L ${(coords.waist.x - 0.03) * 400} ${(coords.waist.y + 0.05) * 600} 
                        L ${(coords.waist.x - 0.05) * 400} ${(coords.waist.y + 0.05) * 600} Z`}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  <path
                    d={`M ${(coords.waist.x + 0.04) * 400} ${(coords.waist.y - 0.05) * 600} 
                        L ${(coords.waist.x + 0.03) * 400} ${(coords.waist.y + 0.05) * 600} 
                        L ${(coords.waist.x + 0.05) * 400} ${(coords.waist.y + 0.05) * 600} Z`}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                </motion.g>
                
                {/* Layer 5: Border Lines (Solid, 3px, Accent) */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.4 }}>
                  {/* Neckline Border */}
                  <ellipse
                    cx={coords.shoulders.x * 400}
                    cy={(coords.shoulders.y * 600) + 20}
                    rx="30"
                    ry="15"
                    fill="none"
                    stroke={outfitDesign.color_scheme.secondary_color || '#f59e0b'}
                    strokeWidth="3"
                  />
                  {/* Hem Border */}
                  <line
                    x1={(coords.waist.x - coords.waist.width / 2) * 400}
                    y1={(coords.waist.y + 0.2) * 600}
                    x2={(coords.waist.x + coords.waist.width / 2) * 400}
                    y2={(coords.waist.y + 0.2) * 600}
                    stroke={outfitDesign.color_scheme.secondary_color || '#f59e0b'}
                    strokeWidth="3"
                  />
                </motion.g>
                
                {/* Layer 6: Embroidery Zones (Dotted Rectangles) */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.5 }}>
                  {/* Chest Embroidery Zone */}
                  <rect
                    x={(coords.shoulders.x - 0.08) * 400}
                    y={(coords.shoulders.y + 0.08) * 600}
                    width="64"
                    height="40"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={coords.shoulders.x * 400}
                    y={(coords.shoulders.y + 0.15) * 600}
                    fontSize="8"
                    fill="#8b5cf6"
                    textAnchor="middle"
                  >
                    Embroidery Zone
                  </text>
                </motion.g>
                
                {/* Layer 7: Cut Outlines (Solid, 2px, Black) */}
                <motion.path
                  d={outfitPath}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.6 }}
                />
                
                {/* Layer 8: Construction Labels */}
                <motion.g 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 0.7 }} 
                  transition={{ delay: 0.7 }}
                  fontSize="9"
                  fill="#374151"
                >
                  <text x="20" y="30">Seam Lines (dashed)</text>
                  <text x="20" y="45">Panel Divisions</text>
                  <text x="20" y="60">Darts (triangular)</text>
                  <text x="20" y="75">Borders (solid)</text>
                  <text x="20" y="90">Embroidery Zones</text>
                  <text x="20" y="105">Cut Outlines</text>
                </motion.g>
              </motion.g>
            </AnimatePresence>

            {/* Neckline Highlight */}
            {outfitDesign.top_design.neckline && (
              <motion.circle
                cx={coords.shoulders.x * 400}
                cy={(coords.shoulders.y * 600) + 20}
                r="8"
                fill={selectedElement === 'neckline' ? '#f97316' : '#3b82f6'}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSelectedElement('neckline')}
                className="cursor-pointer"
              />
            )}

            {/* Sleeve Indicators */}
            {outfitDesign.top_design.sleeve_length !== 'sleeveless' && (
              <>
                <motion.line
                  x1={(coords.shoulders.x - coords.shoulders.width / 2) * 400}
                  y1={coords.shoulders.y * 600}
                  x2={(coords.shoulders.x - coords.shoulders.width / 2 - 0.08) * 400}
                  y2={(coords.shoulders.y + 0.15) * 600}
                  stroke={outfitDesign.color_scheme.primary_color || '#3b82f6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.line
                  x1={(coords.shoulders.x + coords.shoulders.width / 2) * 400}
                  y1={coords.shoulders.y * 600}
                  x2={(coords.shoulders.x + coords.shoulders.width / 2 + 0.08) * 400}
                  y2={(coords.shoulders.y + 0.15) * 600}
                  stroke={outfitDesign.color_scheme.primary_color || '#3b82f6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </>
            )}

            {/* Measurement Lines */}
            <g opacity="0.3">
              <line x1="50" y1={coords.shoulders.y * 600} x2="350" y2={coords.shoulders.y * 600} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1={coords.waist.y * 600} x2="350" y2={coords.waist.y * 600} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1={coords.hips.y * 600} x2="350" y2={coords.hips.y * 600} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
            </g>

            {/* Labels */}
            <text x="360" y={coords.shoulders.y * 600 + 5} fontSize="10" fill="#64748b">Shoulder</text>
            <text x="360" y={coords.waist.y * 600 + 5} fontSize="10" fill="#64748b">Waist</text>
            <text x="360" y={coords.hips.y * 600 + 5} fontSize="10" fill="#64748b">Hip</text>
          </svg>
        </motion.div>

        {/* Live Update Indicator */}
        <motion.div
          className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>Live Preview</span>
        </motion.div>
      </div>

      {/* Design Info Panel */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-primary-50 rounded-lg p-3">
          <div className="text-primary-600 font-medium mb-1">Neckline</div>
          <div className="text-gray-900 capitalize">{outfitDesign.top_design.neckline.replace('_', ' ')}</div>
        </div>
        <div className="bg-secondary-50 rounded-lg p-3">
          <div className="text-secondary-600 font-medium mb-1">Sleeves</div>
          <div className="text-gray-900 capitalize">{outfitDesign.top_design.sleeve_length.replace('_', ' ')}</div>
        </div>
        <div className="bg-accent-50 rounded-lg p-3">
          <div className="text-accent-600 font-medium mb-1">Fit</div>
          <div className="text-gray-900 capitalize">{outfitDesign.top_design.fit}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-green-600 font-medium mb-1">Color</div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded border-2 border-white shadow-sm"
              style={{ backgroundColor: outfitDesign.color_scheme.primary_color }}
            />
            <span className="text-gray-900 text-xs">{outfitDesign.color_scheme.primary_color}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors">
          ↻ Rotate View
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors">
          📏 Show Measurements
        </button>
      </div>
    </div>
  );
}
