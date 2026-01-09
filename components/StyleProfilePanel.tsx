'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BodyType, UndertoneAnalysis } from '@/types';
import { StylePreference } from './PreferenceSelector';

interface StyleProfilePanelProps {
  bodyType: BodyType;
  undertone: UndertoneAnalysis;
  preference: StylePreference;
  outfitType?: string;
  onEdit: () => void;
  collapsed?: boolean;
}

export default function StyleProfilePanel({
  bodyType,
  undertone,
  preference,
  outfitType,
  onEdit,
  collapsed = false
}: StyleProfilePanelProps) {
  
  const getBodyDescription = (shape: string): string => {
    const descriptions = {
      hourglass: 'Balanced shoulders with defined waist - creates beautiful proportions',
      pear: 'Graceful silhouette with fuller lower body - perfect for A-line styles',
      apple: 'Strong shoulders with fuller midsection - ideal for empire waists',
      rectangle: 'Balanced proportions throughout - versatile for all styles',
      'inverted-triangle': 'Defined shoulders - great for volume at the bottom'
    };
    return descriptions[shape as keyof typeof descriptions] || 'Unique body structure';
  };

  if (collapsed) {
    return (
      <motion.div
        className="fixed top-20 right-4 z-40"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <button
          onClick={onEdit}
          className="bg-white shadow-lg rounded-lg p-3 border-2 border-primary-200 hover:border-primary-400 transition-all"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {bodyType.shape.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-900">Your Profile</div>
              <div className="text-xs text-gray-600 capitalize">{undertone.undertone}</div>
            </div>
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">👤</span>
              Your Style Profile
            </h3>
            <p className="text-sm text-gray-600">
              Personalized recommendations based on your unique features
            </p>
          </div>
          <button
            onClick={onEdit}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            ✏️ Edit
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Body Structure */}
          <div className="bg-white rounded-lg p-4 border border-primary-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {bodyType.shape.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Body Structure</h4>
                <p className="text-xs text-gray-600 capitalize">{bodyType.shape}</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {getBodyDescription(bodyType.shape)}
            </p>
          </div>

          {/* Skin Undertone */}
          <div className="bg-white rounded-lg p-4 border border-secondary-100">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">
              Skin Undertone: <span className="capitalize text-secondary-600">{undertone.undertone}</span>
            </h4>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {undertone.recommended_colors.slice(0, 8).map((color, idx) => (
                <div
                  key={idx}
                  className="w-full h-6 rounded border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">
              Colors that enhance your natural beauty
            </p>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg p-4 border border-accent-100">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Your Preferences</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Coverage:</span>
                <span className="font-medium text-gray-900 capitalize">{preference.modesty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occasion:</span>
                <span className="font-medium text-gray-900 capitalize">{preference.occasion}</span>
              </div>
              {outfitType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Outfit:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {outfitType.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-4 bg-white/50 rounded-lg p-3 border border-primary-100">
          <p className="text-xs text-gray-700 text-center">
            ✨ All recommendations are tailored to your profile. You have full control to customize any suggestion.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
