'use client';
import { useState } from 'react';
import ImageCapture from '@/components/ImageCapture';
import OutfitCustomizer from '@/components/OutfitCustomizer';
import DigitalTwin from '@/components/DigitalTwin';
import RecommendationPanel from '@/components/RecommendationPanel';
import TailorTechPack from '@/components/TailorTechPack';
import { StylingEngine } from '@/utils/stylingEngine';

export default function DemoFlow() {
  const [step, setStep] = useState(1);
  const [bodyData, setBodyData] = useState<any>(null);
  const [design, setDesign] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleBodyDetected = (data: any) => {
    setBodyData(data);
    const initialRec = StylingEngine.generateRecommendation(data, 'silk', undefined, JSON.parse(localStorage.getItem('ayla_detected_undertone') || 'null'));
    setDesign(initialRec.outfit);
    setRecommendation(initialRec);
    setStep(2);
  };

  // Function to handle live silhouette updates from the simulator
  const handleLiveBodySync = (updatedCoords: any) => {
    if (!bodyData) return;

    // Create a temporary body object with the new adjusted ratios
    const adjustedBody = {
      ...bodyData,
      ratios: {
        ...bodyData.ratios,
        // Map SVG widths back to ratios for the engine
        shoulder_ratio: updatedCoords.shoulders.width / 400, 
        waist_ratio: updatedCoords.waist.width / 400,
        hip_ratio: updatedCoords.hips.width / 400
      }
    };

    // Re-generate recommendation so the "Expert Rationale" updates live
    const updatedRec = StylingEngine.generateRecommendation(
      adjustedBody, 
      'silk', 
      undefined, 
      null, 
      null, 
      recommendation?.outfit
    );
    
    setRecommendation(updatedRec);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {step === 1 && (
        <ImageCapture onBodyTypeDetected={handleBodyDetected} onSwitchToManual={() => {}} />
      )}

      {step === 2 && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <DigitalTwin bodyType={bodyData} outfitDesign={design} onCoordsUpdate={handleLiveBodySync} />
          </div>
          <OutfitCustomizer 
            bodyType={bodyData} 
            fabricType="silk" 
            onDesignChange={setDesign}
            onDesignComplete={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-10">
          <RecommendationPanel 
            recommendation={recommendation} 
            onCustomize={() => setStep(2)}
            onExport={() => setStep(4)}
          />
        </div>
      )}

      {step === 4 && (
        <div className="max-w-2xl mx-auto">
          <TailorTechPack recommendation={recommendation} />
          <button onClick={() => setStep(3)} className="mt-4 text-gray-500">← Back to Styles</button>
        </div>
      )}
    </div>
  );
}