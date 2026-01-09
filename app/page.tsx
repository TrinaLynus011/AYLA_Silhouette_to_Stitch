'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  BodyType,
  UserSession,
  DetailedMeasurements,
  UndertoneAnalysis
} from '@/types';

import ImageCapture from '@/components/ImageCapture';
import ManualBodySelector from '@/components/ManualBodySelector';
import FabricSelector from '@/components/FabricSelector';
import DigitalTwin from '@/components/DigitalTwin';
import OutfitCustomizer from '@/components/OutfitCustomizer';
import RecommendationPanel from '@/components/RecommendationPanel';
import ExportPanel from '@/components/ExportPanel';
import SavedDesigns from '@/components/SavedDesigns';
import VisualDesignCanvas from '@/components/VisualDesignCanvas';
import PreferenceSelector, { StylePreference } from '@/components/PreferenceSelector';
import StyleProfilePanel from '@/components/StyleProfilePanel';
import MeasurementsInput from '@/components/MeasurementsInput';
import BodyShapeIndicator from '@/components/BodyShapeIndicator';
import { inferUndertoneFromSignals } from '@/utils/undertoneEngine';
import { generateSmartDesign } from '@/utils/smartDesignEngine';

type Step =
  | 'welcome'
  | 'body-input'
  | 'measurements'
  | 'preference'
  | 'fabric'
  | 'customize'
  | 'recommendations'
  | 'export';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');

  const [session, setSession] = useState<Partial<UserSession>>({
    id: Date.now().toString(),
    created_at: new Date(),
    updated_at: new Date(),
    inspirations: []
  });

  const [stylePreference, setStylePreference] =
    useState<StylePreference | null>(null);

  const [undertoneAnalysis, setUndertoneAnalysis] =
    useState<UndertoneAnalysis | null>(null);

  const [showProfilePanel, setShowProfilePanel] = useState(false);

  const updateSession = useCallback((updates: Partial<UserSession>) => {
    setSession(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date()
    }));
  }, []);

  const computeUndertone = useCallback(() => {
    if (!session.body_type || !session.fabric_selection) return;
    const analysis = inferUndertoneFromSignals({
      bodyType: session.body_type,
      fabric: session.fabric_selection,
      outfit: session.outfit_design,
      preference: stylePreference || undefined
    });

    const existing = session.undertone_analysis;
    if (existing && existing.undertone === analysis.undertone && Math.abs(existing.confidence - analysis.confidence) < 0.01) {
      if (!undertoneAnalysis) {
        setUndertoneAnalysis(existing);
      }
      return;
    }

    setUndertoneAnalysis(analysis);
    updateSession({ undertone_analysis: analysis });
  }, [session.body_type, session.fabric_selection, session.outfit_design, stylePreference, session.undertone_analysis, undertoneAnalysis, updateSession]);

  useEffect(() => {
    computeUndertone();
  }, [computeUndertone]);

  /* ---------------- STEP RENDERER ---------------- */

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentStep('body-input')} />;

      case 'body-input':
        return (
          <BodyInputScreen
            onBodyTypeSelected={(bodyType: BodyType) => {
              // Check for auto-detected undertone from image
              const storedUndertone = localStorage.getItem('ayla_detected_undertone');
              if (storedUndertone) {
                try {
                  const undertone = JSON.parse(storedUndertone);
                  setUndertoneAnalysis(undertone);
                  updateSession({ 
                    body_type: bodyType,
                    undertone_analysis: undertone 
                  });
                  localStorage.removeItem('ayla_detected_undertone');
                } catch (e) {
                  console.error('Failed to parse undertone:', e);
                }
              } else {
                updateSession({ body_type: bodyType });
              }
              // Skip measurements, go directly to preference
              setCurrentStep('preference');
            }}
            onBack={() => setCurrentStep('welcome')}
          />
        );

      case 'measurements':
        return (
          <div>
            <BodyShapeIndicator bodyType={session.body_type!} />
            <MeasurementsInput
              bodyType={session.body_type!}
              onMeasurementsComplete={(m: DetailedMeasurements) => {
                updateSession({ measurements: m });
                setCurrentStep('preference');
              }}
              onBack={() => setCurrentStep('body-input')}
            />
          </div>
        );

      case 'preference':
        return (
          <div>
            <BodyShapeIndicator bodyType={session.body_type!} />
            <PreferenceSelector
              onPreferenceSelected={(p) => {
                setStylePreference(p);
                setShowProfilePanel(true);
                setCurrentStep('fabric');
              }}
              onBack={() => setCurrentStep('body-input')}
            />
          </div>
        );

      case 'fabric':
        return (
          <FabricSelector
            onFabricSelected={(fabric, custom) => {
              updateSession({
                fabric_selection: fabric,
                custom_fabric: custom
              });
              // Auto-generate smart design based on body type
              if (session.body_type) {
                const smartDesign = generateSmartDesign(session.body_type.shape, undertoneAnalysis);
                updateSession({ outfit_design: smartDesign });
              }
              setCurrentStep('customize');
            }}
            onBack={() => setCurrentStep('preference')}
          />
        );

      case 'customize':
        return (
          <div>
            <BodyShapeIndicator bodyType={session.body_type!} />

            {showProfilePanel && undertoneAnalysis && stylePreference && (
              <StyleProfilePanel
                bodyType={session.body_type!}
                undertone={undertoneAnalysis}
                preference={stylePreference}
                outfitType={session.outfit_design?.outfit_type}
                onEdit={() => setCurrentStep('body-input')}
                collapsed={false}
              />
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <OutfitCustomizer
                bodyType={session.body_type!}
                fabricType={session.fabric_selection!}
                undertoneAnalysis={undertoneAnalysis || undefined}
                stylePreference={stylePreference}
                onDesignChange={(d) => updateSession({ outfit_design: d })}
                onDesignComplete={(d, r) => {
                  updateSession({
                    outfit_design: d,
                    recommendations: r
                  });
                  setCurrentStep('recommendations');
                }}
                onBack={() => setCurrentStep('fabric')}
              />

              <VisualDesignCanvas
                bodyType={session.body_type!}
                outfitDesign={session.outfit_design || {
                  outfit_type: 'salwar_kameez',
                  top_design: {
                    neckline: 'round',
                    sleeve_length: 'short',
                    sleeve_style: 'regular',
                    back_design: 'closed',
                    length: 'waist',
                    fit: 'regular',
                    closure: 'buttons'
                  },
                  color_scheme: {
                    primary_color: '#D2691E',
                    undertone_match: true
                  },
                  embellishments: []
                }}
              />
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <RecommendationPanel
            recommendation={session.recommendations!}
            onCustomize={() => setCurrentStep('customize')}
            onExport={() => setCurrentStep('export')}
          />
        );

      case 'export':
        return (
          <ExportPanel
            session={session as UserSession}
            onBack={() => setCurrentStep('recommendations')}
            onNewDesign={() => {
              setSession({
                id: Date.now().toString(),
                created_at: new Date(),
                updated_at: new Date(),
                inspirations: []
              });
              setUndertoneAnalysis(null);
              setStylePreference(null);
              setShowProfilePanel(false);
              setCurrentStep('welcome');
            }}
          />
        );

      default:
        return null;
    }
  };

  /* ---------------- PAGE ---------------- */

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <SavedDesigns
        onLoadDesign={(design) => {
          setSession(design);
          setUndertoneAnalysis(design.undertone_analysis || null);
          setCurrentStep('customize');
        }}
      />
    </div>
  );
}

/* ------------------------------------------------ */
/* SUPPORTING COMPONENTS                            */
/* ------------------------------------------------ */

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary-600 mb-3">Ayla</h1>
            <p className="text-xl text-gray-700 italic font-medium">
              From Silhouette to Stitch, Designed on You
            </p>
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered Indian ethnic wear design assistant. Get personalized outfit 
            recommendations tailored to your body shape, fabric choice, and style preferences—like 
            having a personal stylist in your pocket.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            >
              <div className="text-4xl mb-3">📸</div>
              <h3 className="font-semibold text-gray-900 mb-2">Body Analysis</h3>
              <p className="text-sm text-gray-600">
                Capture or select your body type for perfectly fitted designs
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            >
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Styling</h3>
              <p className="text-sm text-gray-600">
                AI-curated colors, accessories, and makeup based on your undertone
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            >
              <div className="text-4xl mb-3">✂️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Tailor-Ready</h3>
              <p className="text-sm text-gray-600">
                Export professional PDFs with measurements and stitching notes
              </p>
            </motion.div>
          </div>

          <motion.button
            onClick={onStart}
            className="btn-primary px-12 py-4 text-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Design Journey →
          </motion.button>

          <p className="text-sm text-gray-500 mt-6">
            🔒 Privacy-first • Your images are processed locally and never stored
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function BodyInputScreen({
  onBodyTypeSelected,
  onBack
}: {
  onBodyTypeSelected: (bodyType: BodyType) => void;
  onBack: () => void;
}) {
  const [inputMode, setInputMode] = useState<'image' | 'manual'>('image');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with visual hierarchy */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
          <span className="font-semibold">Step 1</span>
          <span className="text-primary-400">•</span>
          <span>Body Type Analysis</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Let's Understand Your Silhouette
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose how you'd like to determine your body type. We'll use this to recommend 
          the most flattering outfit designs for you.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setInputMode('image')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              inputMode === 'image'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📸 Camera / Upload
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              inputMode === 'manual'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👤 Manual Selection
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {inputMode === 'image' ? (
          <ImageCapture
            key="image"
            onBodyTypeDetected={onBodyTypeSelected}
            onSwitchToManual={() => setInputMode('manual')}
          />
        ) : (
          <ManualBodySelector
            key="manual"
            onBodyTypeSelected={onBodyTypeSelected}
            onSwitchToImage={() => setInputMode('image')}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-8">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Welcome
        </button>
      </div>
    </div>
  );
}
