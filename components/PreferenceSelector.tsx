'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface StylePreference {
  modesty: 'modest' | 'balanced' | 'bold';
  occasion: 'daily' | 'office' | 'party' | 'wedding' | 'festival';
}

interface PreferenceSelectorProps {
  onPreferenceSelected: (preference: StylePreference) => void;
  onBack: () => void;
}

const modestyOptions = [
  {
    value: 'modest' as const,
    label: 'Modest',
    icon: '🙏',
    description: 'High necklines, full sleeves, longer lengths',
    examples: 'Traditional, conservative, comfortable coverage'
  },
  {
    value: 'balanced' as const,
    label: 'Balanced',
    icon: '⚖️',
    description: 'Mid-range coverage, versatile styles',
    examples: 'Modern traditional, everyday elegance'
  },
  {
    value: 'bold' as const,
    label: 'Bold',
    icon: '✨',
    description: 'Deeper necklines, contemporary cuts',
    examples: 'Fashion-forward, statement-making, trendy'
  }
];

const occasionOptions = [
  { value: 'daily' as const, label: 'Daily Wear', icon: '☀️', description: 'Comfortable, practical' },
  { value: 'office' as const, label: 'Office', icon: '💼', description: 'Professional, elegant' },
  { value: 'party' as const, label: 'Party', icon: '🎉', description: 'Festive, stylish' },
  { value: 'wedding' as const, label: 'Wedding', icon: '💒', description: 'Grand, elaborate' },
  { value: 'festival' as const, label: 'Festival', icon: '🪔', description: 'Traditional, celebratory' }
];

export default function PreferenceSelector({ onPreferenceSelected, onBack }: PreferenceSelectorProps) {
  const [modesty, setModesty] = useState<StylePreference['modesty']>('balanced');
  const [occasion, setOccasion] = useState<StylePreference['occasion']>('party');

  const handleContinue = () => {
    onPreferenceSelected({ modesty, occasion });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Style Preferences
        </h2>
        <p className="text-gray-600">
          Help us understand your comfort level and occasion
        </p>
      </div>

      {/* Modesty Level */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Coverage Preference
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {modestyOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setModesty(option.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                modesty === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">{option.label}</h4>
              <p className="text-sm text-gray-600 mb-2">{option.description}</p>
              <p className="text-xs text-gray-500 italic">{option.examples}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Occasion
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {occasionOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setOccasion(option.value)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                occasion === option.value
                  ? 'border-secondary-500 bg-secondary-50'
                  : 'border-gray-200 hover:border-secondary-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-sm font-medium text-gray-900">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-green-50 border-green-200 mb-8">
        <h4 className="font-medium text-green-900 mb-3">Your Preferences</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-700">Coverage:</span>
            <span className="ml-2 font-semibold text-green-900 capitalize">{modesty}</span>
          </div>
          <div>
            <span className="text-green-700">Occasion:</span>
            <span className="ml-2 font-semibold text-green-900 capitalize">{occasion}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        
        <button onClick={handleContinue} className="btn-primary">
          Continue to Outfit Selection →
        </button>
      </div>
    </div>
  );
}
