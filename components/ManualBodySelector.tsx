'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BodyShape, BodyType } from '@/types';
import { createBodyTypeFromManual } from '@/utils/bodyTypeInference';

interface ManualBodySelectorProps {
  onBodyTypeSelected: (bodyType: BodyType) => void;
  onSwitchToImage: () => void;
}

const bodyShapeInfo = {
  hourglass: {
    name: 'Hourglass',
    description: 'Balanced shoulders and hips with a defined waist',
    characteristics: ['Similar shoulder and hip measurements', 'Defined waistline', 'Curves in proportion'],
    icon: '⏳',
    color: 'from-pink-400 to-rose-500'
  },
  pear: {
    name: 'Pear',
    description: 'Hips wider than shoulders with a defined waist',
    characteristics: ['Narrower shoulders', 'Fuller hips and thighs', 'Defined waist'],
    icon: '🍐',
    color: 'from-green-400 to-emerald-500'
  },
  apple: {
    name: 'Apple',
    description: 'Broader shoulders with fullness around the midsection',
    characteristics: ['Broader shoulders', 'Fuller midsection', 'Narrower hips'],
    icon: '🍎',
    color: 'from-red-400 to-pink-500'
  },
  rectangle: {
    name: 'Rectangle',
    description: 'Similar measurements throughout with less defined waist',
    characteristics: ['Similar shoulder, waist, hip measurements', 'Straighter silhouette', 'Athletic build'],
    icon: '📐',
    color: 'from-blue-400 to-indigo-500'
  }
};

export default function ManualBodySelector({ onBodyTypeSelected, onSwitchToImage }: ManualBodySelectorProps) {
  const [selectedShape, setSelectedShape] = useState<BodyShape | null>(null);
  const [hoveredShape, setHoveredShape] = useState<BodyShape | null>(null);

  const handleShapeSelect = (shape: BodyShape) => {
    setSelectedShape(shape);
  };

  const handleConfirm = () => {
    if (selectedShape) {
      const bodyType = createBodyTypeFromManual(selectedShape);
      onBodyTypeSelected(bodyType);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Choose Your Body Shape
          </h3>
          <p className="text-gray-600">
            Select the shape that best describes your natural silhouette. 
            Remember, every body is beautiful and unique!
          </p>
        </div>

        {/* Body Shape Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(Object.entries(bodyShapeInfo) as [BodyShape, typeof bodyShapeInfo.hourglass][]).map(([shape, info]) => (
            <motion.div
              key={shape}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                selectedShape === shape
                  ? 'border-primary-500 bg-primary-50'
                  : hoveredShape === shape
                  ? 'border-primary-300 bg-primary-25'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => handleShapeSelect(shape)}
              onMouseEnter={() => setHoveredShape(shape)}
              onMouseLeave={() => setHoveredShape(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection Indicator */}
              {selectedShape === shape && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}

              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center text-2xl`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{info.name}</h4>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Key characteristics:</p>
                  {info.characteristics.map((characteristic, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      <span className="text-sm text-gray-600">{characteristic}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Representation */}
                <div className="mt-4 flex justify-center">
                  <BodyShapeIllustration shape={shape} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirmation */}
        {selectedShape && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary-900">
                  Selected: {bodyShapeInfo[selectedShape].name}
                </h4>
                <p className="text-sm text-primary-700">
                  {bodyShapeInfo[selectedShape].description}
                </p>
              </div>
              <button
                onClick={handleConfirm}
                className="btn-primary"
              >
                Continue with {bodyShapeInfo[selectedShape].name}
              </button>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-gray-500 text-lg">💡</span>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Remember</h4>
              <p className="text-sm text-gray-600">
                Body shapes are just guidelines for styling. The most important thing is how confident 
                and comfortable you feel in your clothes. Our recommendations are suggestions that you 
                can always customize to your personal preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Switch to Image Option */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-3">
            Want more personalized analysis?
          </p>
          <button
            onClick={onSwitchToImage}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Try camera analysis instead
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Body Shape Illustration Component
function BodyShapeIllustration({ shape }: { shape: BodyShape }) {
  const getShapePath = (shape: BodyShape) => {
    switch (shape) {
      case 'hourglass':
        return 'M50 20 Q60 20 65 35 Q70 50 65 65 Q60 80 50 80 Q40 80 35 65 Q30 50 35 35 Q40 20 50 20 Z';
      case 'pear':
        return 'M50 20 Q55 20 58 35 Q60 50 65 65 Q70 80 50 80 Q30 80 35 65 Q40 50 42 35 Q45 20 50 20 Z';
      case 'apple':
        return 'M50 20 Q65 20 70 35 Q68 50 65 65 Q60 80 50 80 Q40 80 35 65 Q32 50 30 35 Q35 20 50 20 Z';
      case 'rectangle':
        return 'M50 20 Q58 20 60 35 Q58 50 60 65 Q58 80 50 80 Q42 80 40 65 Q42 50 40 35 Q42 20 50 20 Z';
      default:
        return '';
    }
  };

  return (
    <svg width="60" height="80" viewBox="0 0 100 100" className="text-gray-400">
      <path
        d={getShapePath(shape)}
        fill="currentColor"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}