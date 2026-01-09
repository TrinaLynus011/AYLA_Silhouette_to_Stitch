'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FabricType } from '@/types';
import { FABRIC_INFO, getFabricsByOccasion } from '@/utils/fabricEngine';

interface FabricSelectorProps {
  onFabricSelected: (fabricType: FabricType, customFabric?: string) => void;
  onBack: () => void;
}

type OccasionFilter = 'all' | 'daily' | 'festive' | 'bridal';

export default function FabricSelector({ onFabricSelected, onBack }: FabricSelectorProps) {
  const [selectedFabric, setSelectedFabric] = useState<FabricType | null>(null);
  const [customFabricText, setCustomFabricText] = useState('');
  const [occasionFilter, setOccasionFilter] = useState<OccasionFilter>('all');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleFabricSelect = (fabric: FabricType) => {
    setSelectedFabric(fabric);
    if (fabric === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomFabricText('');
    }
  };

  const handleConfirm = () => {
    if (!selectedFabric) return;
    
    if (selectedFabric === 'custom' && !customFabricText.trim()) {
      return;
    }
    
    onFabricSelected(
      selectedFabric, 
      selectedFabric === 'custom' ? customFabricText.trim() : undefined
    );
  };

  const getFilteredFabrics = (): FabricType[] => {
    if (occasionFilter === 'all') {
      return Object.keys(FABRIC_INFO) as FabricType[];
    }
    return getFabricsByOccasion(occasionFilter);
  };

  const filteredFabrics = getFilteredFabrics();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Choose Your Fabric
          </h3>
          <p className="text-gray-600">
            The fabric choice influences the blouse design, fit, and styling recommendations
          </p>
        </div>

        {/* Occasion Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            {(['all', 'daily', 'festive', 'bridal'] as OccasionFilter[]).map((occasion) => (
              <button
                key={occasion}
                onClick={() => setOccasionFilter(occasion)}
                className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                  occasionFilter === occasion
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {occasion === 'all' ? 'All Fabrics' : `${occasion} Wear`}
              </button>
            ))}
          </div>
        </div>

        {/* Fabric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredFabrics.map((fabric) => {
            const info = FABRIC_INFO[fabric];
            const isSelected = selectedFabric === fabric;
            
            return (
              <motion.div
                key={fabric}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25'
                }`}
                onClick={() => handleFabricSelect(fabric)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm">✓</span>
                  </motion.div>
                )}

                {/* Fabric Icon */}
                <div className="text-center mb-3">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    {info.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{info.name}</h4>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  {info.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Fabric Input */}
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your fabric:
              </label>
              <textarea
                value={customFabricText}
                onChange={(e) => setCustomFabricText(e.target.value)}
                placeholder="e.g., Heavy cotton with gold thread work, Handloom silk with traditional motifs..."
                className="input-field resize-none h-20"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {customFabricText.length}/200 characters
                </span>
                {customFabricText.trim() && (
                  <span className="text-xs text-green-600">✓ Description added</span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Fabric Info */}
        {selectedFabric && selectedFabric !== 'custom' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{FABRIC_INFO[selectedFabric].icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary-900">
                  {FABRIC_INFO[selectedFabric].name} Selected
                </h4>
                <p className="text-sm text-primary-700">
                  {FABRIC_INFO[selectedFabric].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Custom Fabric Preview */}
        {selectedFabric === 'custom' && customFabricText.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📝</div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary-900 mb-1">
                  Custom Fabric Description
                </h4>
                <p className="text-sm text-primary-700 italic">
                  "{customFabricText}"
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fabric Care Tips */}
        {selectedFabric && selectedFabric !== 'custom' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-lg">💡</span>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Fabric Tip</h4>
                <p className="text-sm text-blue-800">
                  {getFabricTip(selectedFabric)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="btn-secondary">
            ← Back to Body Type
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!selectedFabric || (selectedFabric === 'custom' && !customFabricText.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Design →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function for fabric tips
function getFabricTip(fabric: FabricType): string {
  const tips: Record<FabricType, string> = {
    cotton: 'Cotton is breathable and comfortable for daily wear. Works well with structured designs.',
    silk: 'Silk drapes beautifully and adds elegance. Perfect for fitted blouses and special occasions.',
    georgette: 'Georgette flows gracefully. Ideal for softer necklines and flowing sleeves.',
    chiffon: 'Chiffon is delicate and sheer. Consider lining and avoid very fitted styles.',
    linen: 'Linen has a crisp structure. Great for tailored looks and defined silhouettes.',
    satin: 'Satin has a luxurious sheen. Works beautifully with classic cuts and evening wear.',
    velvet: 'Velvet is rich and textured. Best with simpler cuts to showcase the fabric.',
    organza: 'Organza is crisp and transparent. Perfect for layering and structured designs.',
    brocade: 'Brocade has ornate patterns. Let the fabric be the star with minimal embellishments.',
    custom: ''
  };
  
  return tips[fabric] || '';
}