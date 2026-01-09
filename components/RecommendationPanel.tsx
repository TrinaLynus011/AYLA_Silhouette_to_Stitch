'use client';

import { motion } from 'framer-motion';
import { StyleRecommendation } from '@/types';

interface RecommendationPanelProps {
  recommendation: StyleRecommendation;
  onExport: () => void;
  onCustomize: () => void;
}

export default function RecommendationPanel({ 
  recommendation, 
  onExport, 
  onCustomize 
}: RecommendationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your Personalized Styling Recommendations
          </h3>
          <p className="text-gray-600">
            AI-curated suggestions based on your body type, fabric choice, and cultural preferences
          </p>
        </div>

        {/* Design Summary */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-primary-900 mb-3">Your Outfit Design</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-primary-700">Outfit:</span>
              <span className="font-medium text-primary-900 capitalize">
                {recommendation.outfit.outfit_type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Neckline:</span>
              <span className="font-medium text-primary-900 capitalize">
                {recommendation.outfit.top_design.neckline.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Sleeves:</span>
              <span className="font-medium text-primary-900 capitalize">
                {recommendation.outfit.top_design.sleeve_length.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Back:</span>
              <span className="font-medium text-primary-900 capitalize">
                {recommendation.outfit.top_design.back_design.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Length:</span>
              <span className="font-medium text-primary-900 capitalize">{recommendation.outfit.top_design.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Fit:</span>
              <span className="font-medium text-primary-900 capitalize">{recommendation.outfit.top_design.fit}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button onClick={onCustomize} className="btn-secondary flex-1">
            ← Modify Design
          </button>
          <button onClick={onExport} className="btn-primary flex-1">
            Export for Tailor →
          </button>
        </div>
      </motion.div>

      {/* AI Reasoning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-sm">🧠</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why This Design Works</h4>
            <p className="text-gray-700 leading-relaxed">{recommendation.reasoning}</p>
          </div>
        </div>
      </motion.div>

      {/* Accessories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 text-sm">💎</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-3">Accessory Recommendations</h4>
            <div className="space-y-2">
              {/* The ?. and || [] ensure that if accessories is undefined, it won't crash */}
              {(recommendation?.accessories || []).map((accessory, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{accessory}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Makeup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-pink-600 text-sm">💄</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Makeup Suggestions</h4>
            <p className="text-gray-700 leading-relaxed">{recommendation.makeup}</p>
          </div>
        </div>
      </motion.div>

      {/* Things to Avoid */}
      {recommendation.avoid.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-3">Things to Avoid</h4>
              <div className="space-y-2">
                {recommendation.avoid.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tailor Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-green-600 text-sm">✂️</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-3">Notes for Your Tailor</h4>
            <div className="space-y-2">
              {recommendation.tailor_notes.map((note, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Boost */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-xl">💫</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">You're Going to Look Amazing!</h4>
          <p className="text-gray-700">
            This design is carefully crafted to enhance your natural beauty and make you feel confident. 
            Remember, the most important accessory is your smile!
          </p>
        </div>
      </motion.div>
    </div>
  );
}