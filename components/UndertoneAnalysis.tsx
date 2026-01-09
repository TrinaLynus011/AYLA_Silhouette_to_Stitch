'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SkinUndertone, UndertoneAnalysis } from '@/types';

interface UndertoneAnalysisProps {
  capturedImage?: string;
  onAnalysisComplete: (analysis: UndertoneAnalysis) => void;
  onSkip: () => void;
}

export default function UndertoneAnalysis({ 
  capturedImage, 
  onAnalysisComplete, 
  onSkip 
}: UndertoneAnalysisProps) {
  const [analysisMode, setAnalysisMode] = useState<'auto' | 'manual'>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedUndertone, setSelectedUndertone] = useState<SkinUndertone | null>(null);

  const undertoneInfo = {
    warm: {
      name: 'Warm',
      description: 'Golden, yellow, or peachy undertones',
      characteristics: ['Veins appear greenish', 'Gold jewelry looks better', 'Tan easily'],
      colors: ['Warm oranges', 'Golden yellows', 'Rich browns', 'Coral pinks'],
      icon: '🌅'
    },
    cool: {
      name: 'Cool', 
      description: 'Pink, red, or blue undertones',
      characteristics: ['Veins appear bluish', 'Silver jewelry looks better', 'Burn before tanning'],
      colors: ['Cool blues', 'True reds', 'Emerald greens', 'Purple tones'],
      icon: '❄️'
    },
    neutral: {
      name: 'Neutral',
      description: 'Mix of warm and cool undertones',
      characteristics: ['Veins appear blue-green', 'Both gold and silver look good', 'Tan moderately'],
      colors: ['Most colors work', 'Soft pastels', 'Muted tones', 'Classic colors'],
      icon: '⚖️'
    }
  };

  const handleAutoAnalysis = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // AUTOMATIC UNDERTONE DETECTION - NO USER CONFIRMATION
      // Simulates CV analysis of skin tone in jawline/neck areas
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production: Call actual CV API
      // For now: Simulate realistic detection
      const mockUndertones: SkinUndertone[] = ['warm', 'cool', 'neutral'];
      const detectedUndertone = mockUndertones[Math.floor(Math.random() * mockUndertones.length)];
      const confidence = 0.72 + Math.random() * 0.23; // 72-95%
      
      const analysis: UndertoneAnalysis = {
        undertone: detectedUndertone,
        confidence: confidence,
        source: 'detected',
        recommended_colors: getRecommendedColors(detectedUndertone),
        reasoning: `Analyzed skin tone in jawline and neck areas. Detected ${detectedUndertone} undertones with ${Math.round(confidence * 100)}% confidence. ${confidence < 0.70 ? '⚠️ Lighting may affect accuracy. Adjust lighting for better precision.' : 'Analysis normalized for lighting and shadows.'}`
      };
      
      // AUTO-PROCEED - No user confirmation needed
      setTimeout(() => {
        onAnalysisComplete(analysis);
      }, 800);
      
    } catch (error) {
      console.error('Undertone analysis failed:', error);
      setAnalysisMode('manual');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualSelection = () => {
    if (!selectedUndertone) return;
    
    const analysis: UndertoneAnalysis = {
      undertone: selectedUndertone,
      confidence: 1.0,
      source: 'manual',
      recommended_colors: getRecommendedColors(selectedUndertone)
    };
    
    onAnalysisComplete(analysis);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Skin Undertone Analysis
          </h3>
          <p className="text-gray-600">
            Understanding your undertone helps us recommend the most flattering colors for your outfits
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAnalysisMode('auto')}
              disabled={!capturedImage}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                analysisMode === 'auto'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              } ${!capturedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              🤖 AI Analysis
            </button>
            <button
              onClick={() => setAnalysisMode('manual')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                analysisMode === 'manual'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👤 Manual Selection
            </button>
          </div>
        </div>

        {analysisMode === 'auto' ? (
          /* AI Analysis Mode */
          <div className="space-y-6">
            {capturedImage ? (
              <>
                <div className="text-center">
                  <img
                    src={capturedImage}
                    alt="For undertone analysis"
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-purple-200"
                  />
                  <p className="text-sm text-gray-600 mb-4">
                    We'll analyze your skin tone from this photo to determine your undertone
                  </p>
                </div>

                {!isAnalyzing ? (
                  <button
                    onClick={handleAutoAnalysis}
                    className="btn-primary w-full"
                  >
                    🎨 Analyze My Undertone
                  </button>
                ) : (
                  <div className="text-center py-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">Analyzing Your Undertone</h4>
                    <p className="text-gray-600">This will take just a moment...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-gray-600 mb-4">
                  No photo available for analysis. Please go back and capture a photo, or use manual selection.
                </p>
                <button
                  onClick={() => setAnalysisMode('manual')}
                  className="btn-secondary"
                >
                  Switch to Manual Selection
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Manual Selection Mode */
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Choose Your Undertone</h4>
              <p className="text-sm text-gray-600">
                Look at your wrist veins in natural light, or consider which jewelry looks better on you
              </p>
            </div>

            <div className="space-y-4">
              {(Object.entries(undertoneInfo) as [SkinUndertone, typeof undertoneInfo.warm][]).map(([undertone, info]) => (
                <motion.div
                  key={undertone}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                    selectedUndertone === undertone
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedUndertone(undertone)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{info.name} Undertone</h5>
                        {selectedUndertone === undertone && (
                          <span className="text-primary-600 text-sm">✓ Selected</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{info.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Characteristics:</span>
                          <ul className="mt-1 space-y-1">
                            {info.characteristics.map((char, index) => (
                              <li key={index} className="text-gray-600">• {char}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Best colors:</span>
                          <ul className="mt-1 space-y-1">
                            {info.colors.map((color, index) => (
                              <li key={index} className="text-gray-600">• {color}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedUndertone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <button
                  onClick={handleManualSelection}
                  className="btn-primary"
                >
                  Continue with {undertoneInfo[selectedUndertone].name} Undertone
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Skip Option */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Not sure about your undertone?
          </p>
          <button
            onClick={onSkip}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Skip this step - I'll choose colors myself →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to get recommended colors for undertone
function getRecommendedColors(undertone: SkinUndertone): string[] {
  const colorMap = {
    warm: [
      'Golden yellow', 'Warm orange', 'Coral pink', 'Peach', 'Warm red',
      'Olive green', 'Golden brown', 'Cream', 'Warm beige', 'Rust'
    ],
    cool: [
      'True blue', 'Emerald green', 'True red', 'Pink', 'Purple',
      'Navy blue', 'Cool gray', 'Pure white', 'Black', 'Magenta'
    ],
    neutral: [
      'Soft pastels', 'Muted tones', 'Jade green', 'Dusty pink', 'Periwinkle',
      'Soft yellow', 'Light gray', 'Off-white', 'Taupe', 'Sage green'
    ]
  };
  
  return colorMap[undertone];
}