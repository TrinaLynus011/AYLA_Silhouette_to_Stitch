'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BodyType, 
  FabricType, 
  BlouseDesign, 
  StyleRecommendation,
  NecklineType,
  SleeveLength,
  BackDepth,
  BlouseLength,
  FitLooseness
} from '@/types';
import { StylingEngine } from '@/utils/stylingEngine';
import { isFabricCompatible } from '@/utils/fabricEngine';

interface BlouseCustomizerProps {
  bodyType: BodyType;
  fabricType: FabricType;
  customFabric?: string;
  onDesignComplete: (design: BlouseDesign, recommendation: StyleRecommendation) => void;
  onBack: () => void;
}

const designOptions = {
  neckline: [
    { value: 'round' as NecklineType, label: 'Round', icon: '⭕' },
    { value: 'boat' as NecklineType, label: 'Boat', icon: '🛥️' },
    { value: 'deep_round' as NecklineType, label: 'Deep Round', icon: '🔵' },
    { value: 'square' as NecklineType, label: 'Square', icon: '⬜' },
    { value: 'sweetheart' as NecklineType, label: 'Sweetheart', icon: '💖' },
    { value: 'halter' as NecklineType, label: 'Halter', icon: '🎀' }
  ],
  sleeve_length: [
    { value: 'sleeveless' as SleeveLength, label: 'Sleeveless', icon: '👕' },
    { value: 'cap' as SleeveLength, label: 'Cap', icon: '🧢' },
    { value: 'short' as SleeveLength, label: 'Short', icon: '👔' },
    { value: 'elbow' as SleeveLength, label: 'Elbow', icon: '💪' },
    { value: 'three_quarter' as SleeveLength, label: '3/4', icon: '👘' },
    { value: 'full' as SleeveLength, label: 'Full', icon: '👗' }
  ],
  back_depth: [
    { value: 'high' as BackDepth, label: 'High Back', icon: '⬆️' },
    { value: 'medium' as BackDepth, label: 'Medium', icon: '➡️' },
    { value: 'deep' as BackDepth, label: 'Deep', icon: '⬇️' },
    { value: 'very_deep' as BackDepth, label: 'Very Deep', icon: '⏬' }
  ],
  blouse_length: [
    { value: 'crop' as BlouseLength, label: 'Crop', icon: '✂️' },
    { value: 'regular' as BlouseLength, label: 'Regular', icon: '📏' },
    { value: 'long' as BlouseLength, label: 'Long', icon: '📐' }
  ],
  fit_looseness: [
    { value: 'fitted' as FitLooseness, label: 'Fitted', icon: '🎯' },
    { value: 'regular' as FitLooseness, label: 'Regular', icon: '👕' },
    { value: 'loose' as FitLooseness, label: 'Loose', icon: '🥋' }
  ]
};

export default function BlouseCustomizer({ 
  bodyType, 
  fabricType, 
  customFabric,
  onDesignComplete, 
  onBack 
}: BlouseCustomizerProps) {
  const [design, setDesign] = useState<BlouseDesign>(() => {
    // Get AI recommendation as starting point
    const recommendation = StylingEngine.generateRecommendation(bodyType, fabricType, customFabric);
    return recommendation.blouse;
  });
  
  const [showRecommended, setShowRecommended] = useState(true);
  const [compatibilityWarnings, setCompatibilityWarnings] = useState<Record<string, string>>({});

  // Check fabric compatibility when design changes
  useEffect(() => {
    const warnings: Record<string, string> = {};
    
    Object.entries(design).forEach(([key, value]) => {
      const compatibility = isFabricCompatible(fabricType, key, value);
      if (!compatibility.compatible && compatibility.reason) {
        warnings[key] = compatibility.reason;
      }
    });
    
    setCompatibilityWarnings(warnings);
  }, [design, fabricType]);

  const handleDesignChange = <K extends keyof BlouseDesign>(
    key: K, 
    value: BlouseDesign[K]
  ) => {
    setDesign(prev => ({ ...prev, [key]: value }));
    setShowRecommended(false);
  };

  const resetToRecommended = () => {
    const recommendation = StylingEngine.generateRecommendation(bodyType, fabricType, customFabric);
    setDesign(recommendation.blouse);
    setShowRecommended(true);
  };

  const handleComplete = () => {
    const recommendation = StylingEngine.generateRecommendation(bodyType, fabricType, customFabric);
    // Update recommendation with current design
    const updatedRecommendation: StyleRecommendation = {
      ...recommendation,
      blouse: design
    };
    onDesignComplete(design, updatedRecommendation);
  };

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Customize Your Blouse
          </h3>
          {!showRecommended && (
            <button
              onClick={resetToRecommended}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ↻ Reset to AI Recommended
            </button>
          )}
        </div>
        
        {showRecommended && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✨</span>
              <span className="text-sm font-medium text-green-800">
                AI Recommended Design
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Neckline */}
        <DesignSection
          title="Neckline"
          options={designOptions.neckline}
          selected={design.neckline}
          onChange={(value) => handleDesignChange('neckline', value)}
          warning={compatibilityWarnings.neckline}
        />

        {/* Sleeve Length */}
        <DesignSection
          title="Sleeve Length"
          options={designOptions.sleeve_length}
          selected={design.sleeve_length}
          onChange={(value) => handleDesignChange('sleeve_length', value)}
          warning={compatibilityWarnings.sleeve_length}
        />

        {/* Back Depth */}
        <DesignSection
          title="Back Depth"
          options={designOptions.back_depth}
          selected={design.back_depth}
          onChange={(value) => handleDesignChange('back_depth', value)}
          warning={compatibilityWarnings.back_depth}
        />

        {/* Blouse Length */}
        <DesignSection
          title="Blouse Length"
          options={designOptions.blouse_length}
          selected={design.blouse_length}
          onChange={(value) => handleDesignChange('blouse_length', value)}
          warning={compatibilityWarnings.blouse_length}
        />

        {/* Fit */}
        <DesignSection
          title="Fit"
          options={designOptions.fit_looseness}
          selected={design.fit_looseness}
          onChange={(value) => handleDesignChange('fit_looseness', value)}
          warning={compatibilityWarnings.fit_looseness}
        />
      </div>

      {/* Design Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Design Summary</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Neckline:</span>
            <span className="ml-2 font-medium capitalize">{design.neckline.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-600">Sleeves:</span>
            <span className="ml-2 font-medium capitalize">{design.sleeve_length.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-600">Back:</span>
            <span className="ml-2 font-medium capitalize">{design.back_depth}</span>
          </div>
          <div>
            <span className="text-gray-600">Length:</span>
            <span className="ml-2 font-medium capitalize">{design.blouse_length}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Fit:</span>
            <span className="ml-2 font-medium capitalize">{design.fit_looseness}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Fabric
        </button>
        
        <button
          onClick={handleComplete}
          className="btn-primary"
        >
          Get Styling Recommendations →
        </button>
      </div>
    </div>
  );
}

// Design Section Component
interface DesignSectionProps<T> {
  title: string;
  options: Array<{ value: T; label: string; icon: string }>;
  selected: T;
  onChange: (value: T) => void;
  warning?: string;
}

function DesignSection<T extends string>({ 
  title, 
  options, 
  selected, 
  onChange, 
  warning 
}: DesignSectionProps<T>) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      
      {warning && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-sm">⚠️</span>
            <p className="text-sm text-yellow-800">{warning}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              selected === option.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-lg mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}