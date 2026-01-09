'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface UndertoneSelection {
  undertone: 'warm' | 'cool' | 'neutral';
  confidence: number;
  recommended_colors: string[];
}

interface UndertoneSelectorProps {
  onUndertoneSelected: (selection: UndertoneSelection) => void;
  onBack: () => void;
}

const undertoneOptions = [
  {
    value: 'warm' as const,
    label: 'Warm Undertone',
    description: 'Golden, peachy, yellow undertones',
    colors: ['#D2691E', '#CD853F', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F', '#DAA520', '#B8860B'],
    characteristics: ['Gold jewelry looks better', 'Veins appear greenish', 'Tan easily']
  },
  {
    value: 'cool' as const,
    label: 'Cool Undertone',
    description: 'Pink, red, bluish undertones',
    colors: ['#4682B4', '#6495ED', '#87CEEB', '#B0C4DE', '#E6E6FA', '#DDA0DD', '#9370DB', '#8B7D8B'],
    characteristics: ['Silver jewelry looks better', 'Veins appear bluish', 'Burn easily']
  },
  {
    value: 'neutral' as const,
    label: 'Neutral Undertone',
    description: 'Balanced mix of warm and cool',
    colors: ['#696969', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#F5F5DC', '#F0E68C', '#BDB76B', '#8B8B83'],
    characteristics: ['Both gold and silver look good', 'Veins appear blue-green', 'Tan moderately']
  }
];

export default function UndertoneSelector({ onUndertoneSelected, onBack }: UndertoneSelectorProps) {
  const [selected, setSelected] = useState<typeof undertoneOptions[0] | null>(null);

  const handleSelect = (option: typeof undertoneOptions[0]) => {
    setSelected(option);
  };

  const handleConfirm = () => {
    if (selected) {
      onUndertoneSelected({
        undertone: selected.value,
        confidence: 1.0,
        recommended_colors: selected.colors
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Discover Your Skin Undertone
        </h2>
        <p className="text-gray-600">
          Your undertone helps us recommend colors that enhance your natural beauty
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {undertoneOptions.map((option) => (
          <motion.div
            key={option.value}
            onClick={() => handleSelect(option)}
            className={`card cursor-pointer transition-all ${
              selected?.value === option.value
                ? 'ring-4 ring-primary-500 shadow-xl'
                : 'hover:shadow-lg'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {option.label}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {option.description}
              </p>
            </div>

            {/* Color Palette */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Recommended Colors:</p>
              <div className="grid grid-cols-4 gap-2">
                {option.colors.map((color) => (
                  <div
                    key={color}
                    className="w-full h-10 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Characteristics:</p>
              <ul className="space-y-1">
                {option.characteristics.map((char, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                    <span className="text-primary-500 mr-1">•</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            {selected?.value === option.value && (
              <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg p-2 text-center">
                <span className="text-sm font-medium text-primary-700">✓ Selected</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <div className="card bg-blue-50 border-blue-200 mb-8">
        <h4 className="font-medium text-blue-900 mb-3">💡 How to Identify Your Undertone</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <strong>Jewelry Test:</strong> Which looks better on you - gold or silver?
          </div>
          <div>
            <strong>Vein Test:</strong> Look at your wrist veins - are they blue or green?
          </div>
          <div>
            <strong>White Paper Test:</strong> Hold white paper to your face - does your skin look yellow or pink?
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with {selected?.label || 'Selection'} →
        </button>
      </div>
    </div>
  );
}
