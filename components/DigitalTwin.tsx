// components/DigitalTwin.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DigitalTwinSystem } from '@/utils/digitalTwin';
import { changeIsolation } from '@/lib/changeIsolation';
import { persistentBody } from '@/lib/persistentBody';

interface DigitalTwinProps {
  bodyType: any;
  outfitDesign?: any;
  readonly?: boolean;
  onCoordsUpdate?: (coords: any) => void;
}

export default function DigitalTwin({ bodyType, outfitDesign, readonly = false, onCoordsUpdate }: DigitalTwinProps) {
  const [coords, setCoords] = useState(() => 
    DigitalTwinSystem.generateCoordinates(bodyType.ratios)
  );
  const [adjustments, setAdjustments] = useState({ shoulder: 0, waist: 0, hip: 0 });

  useEffect(() => {
    const baseCoords = DigitalTwinSystem.generateCoordinates(bodyType.ratios);
    const adjusted = DigitalTwinSystem.applyUserAdjustments(baseCoords, adjustments);
    setCoords(adjusted);
  }, [bodyType, adjustments]);

  const silhouettePath = DigitalTwinSystem.generateSilhouettePath(coords);
  const outfitPath = outfitDesign ? DigitalTwinSystem.generateOutfitOverlay(coords, outfitDesign) : '';

  const handleAdjustment = (type: keyof typeof adjustments, value: number) => {
    const parameterMap: Record<string, any> = {
      shoulder: 'body_shoulder',
      waist: 'body_waist',
      hip: 'body_hip',
      height: 'body_bust'
    };

    const result = changeIsolation.updateParameter(parameterMap[type], value);

    if (result.success) {
      const newAdjustments = { ...adjustments, [type]: value };
      setAdjustments(newAdjustments);
      
      // SYNC STEP: Generate new coordinates and push to parent
      const baseCoords = DigitalTwinSystem.generateCoordinates(bodyType.ratios);
      const updatedCoords = DigitalTwinSystem.applyUserAdjustments(baseCoords, newAdjustments);
      
      // This call is vital for the Recommendation Engine to see changes
      onCoordsUpdate?.(updatedCoords); 
      
      try {
        persistentBody.updateProportions({ [type]: 1.0 + (value / 100) });
      } catch (error) {
        console.error('Proportion update error:', error);
      }
    }
  };

  return (
    <div className="relative bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
      <svg viewBox="0 0 400 600" className="w-full h-[500px]">
        {/* Silhouette Layer */}
        <motion.path 
          d={silhouettePath} 
          fill="#f3f4f6" 
          stroke="#9ca3af" 
          strokeWidth="2" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        {/* Outfit/Canvas Layer */}
        {outfitPath && (
          <motion.path 
            d={outfitPath} 
            fill={outfitDesign.color_scheme.primary_color + '44'} 
            stroke={outfitDesign.color_scheme.primary_color}
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </svg>
      
      {!readonly && (
        <div className="mt-4 space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Waist Adjustment</label>
          <input 
            type="range" min="-15" max="15" 
            onChange={(e) => setAdjustments(prev => ({ ...prev, waist: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}