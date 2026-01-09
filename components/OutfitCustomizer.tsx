'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BodyType, 
  FabricType, 
  OutfitDesign, 
  StyleRecommendation,
  OutfitType,
  ColorScheme,
  UndertoneAnalysis
} from '@/types';
import { StylingEngine } from '@/utils/stylingEngine';
import { isFabricCompatible } from '@/utils/fabricEngine';

interface OutfitCustomizerProps {
  bodyType: BodyType;
  fabricType: FabricType;
  customFabric?: string;
  undertoneAnalysis?: UndertoneAnalysis | null;
  stylePreference?: { modesty: string; occasion: string } | null;
  onDesignComplete: (design: OutfitDesign, recommendation: StyleRecommendation) => void;
  onDesignChange?: (design: OutfitDesign) => void;
  onBack: () => void;
}

const outfitTypes = [
  { value: 'saree_blouse' as OutfitType, label: 'Saree & Blouse', icon: '🥻', description: 'Traditional draped saree with fitted blouse' },
  { value: 'salwar_kameez' as OutfitType, label: 'Salwar Kameez', icon: '👘', description: 'Tunic with loose pants and dupatta' },
  { value: 'lehenga_choli' as OutfitType, label: 'Lehenga Choli', icon: '👗', description: 'Flared skirt with fitted top' },
  { value: 'anarkali_suit' as OutfitType, label: 'Anarkali Suit', icon: '🌸', description: 'Flowing long dress with fitted bodice' }
];

export default function OutfitCustomizer({ 
  bodyType, 
  fabricType, 
  customFabric,
  undertoneAnalysis,
  stylePreference,
  onDesignComplete,
  onDesignChange,
  onBack 
}: OutfitCustomizerProps) {
  const [selectedOutfitType, setSelectedOutfitType] = useState<OutfitType>('salwar_kameez');
  const [design, setDesign] = useState<OutfitDesign>(() => {
    const recommendation = StylingEngine.generateRecommendation(bodyType, fabricType, customFabric, undertoneAnalysis, stylePreference);
    return recommendation.outfit;
  });
  
  const [showRecommended, setShowRecommended] = useState(true);
  const [compatibilityWarnings, setCompatibilityWarnings] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<ColorScheme>({
    primary_color: undertoneAnalysis?.recommended_colors?.[0] || '#D2691E',
    undertone_match: true
  });
  const [showManualDesign, setShowManualDesign] = useState(false);
  const [pendingExpertConfirm, setPendingExpertConfirm] = useState(false);
  const [designRationale, setDesignRationale] = useState('');

  useEffect(() => {
    const warnings: Record<string, string> = {};
    Object.entries(design.top_design).forEach(([key, value]) => {
      const compatibility = isFabricCompatible(fabricType, key, value as string);
      if (!compatibility.compatible && compatibility.reason) {
        warnings[key] = compatibility.reason;
      }
    });
    setCompatibilityWarnings(warnings);
    onDesignChange?.(design);
  }, [design, fabricType, onDesignChange]);

  const handleOutfitTypeChange = (outfitType: OutfitType) => {
    setSelectedOutfitType(outfitType);
    const newDesign = StylingEngine.generateOutfitDesign(bodyType, fabricType, outfitType, customFabric);
    setDesign(newDesign);
    setShowRecommended(true);
  };

  const handleTopDesignChange = (key: string, value: any) => {
    setDesign(prev => ({
      ...prev,
      top_design: { ...prev.top_design, [key]: value }
    }));
    setShowRecommended(false);
  };

  const requestExpertConfirmation = () => {
    // Safety check: ensure function exists before calling
    const rationale = StylingEngine.generateDesignRationale 
      ? StylingEngine.generateDesignRationale(bodyType, design)
      : "Our experts recommend this silhouette to enhance your natural proportions.";
    
    setDesignRationale(rationale);
    setPendingExpertConfirm(true);
  };

  const handleComplete = () => {
    const recommendation = StylingEngine.generateRecommendation(bodyType, fabricType, customFabric, undertoneAnalysis, stylePreference, { ...design, color_scheme: selectedColors });
    onDesignComplete({ ...design, color_scheme: selectedColors }, recommendation);
  };

  return (
    <div className="space-y-6">
      {/* OUTFIT SELECTION */}
      <div className="card bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Choose Your Outfit Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {outfitTypes.map((outfit) => (
            <button
              key={outfit.value}
              onClick={() => handleOutfitTypeChange(outfit.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedOutfitType === outfit.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'
              }`}
            >
              <div className="text-2xl mb-1">{outfit.icon}</div>
              <div className="text-xs font-bold">{outfit.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOMIZATION PANEL */}
      <div className="card bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold uppercase tracking-tight">Design Studio</h3>
          <button onClick={() => setShowManualDesign(!showManualDesign)} className="text-sm text-orange-600 font-bold">
            {showManualDesign ? '🤖 AI Mode' : '✏️ Manual'}
          </button>
        </div>

        <div className="space-y-6">
          <TopDesignSection design={design.top_design} onChange={handleTopDesignChange} warnings={compatibilityWarnings} />
          
          {/* EXPERT PICK MODAL */}
          {pendingExpertConfirm && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-bold text-orange-900 flex items-center gap-2">✨ Expert Pick Rationale</h4>
              <p className="text-sm text-orange-800 mt-2 italic leading-relaxed">"{designRationale}"</p>
              <div className="flex gap-2 mt-4">
                <button onClick={handleComplete} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold">Confirm Design</button>
                <button onClick={() => setPendingExpertConfirm(false)} className="flex-1 bg-white text-orange-500 py-2 rounded-lg border border-orange-500 font-bold">Modify</button>
              </div>
            </motion.div>
          )}

          {!pendingExpertConfirm && (
            <button onClick={requestExpertConfirmation} className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">
              Next Step: Style Analysis →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TopDesignSection({ design, onChange, warnings }: any) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-gray-500">NECKLINE & SLEEVES</label>
      <div className="grid grid-cols-2 gap-4">
        <select 
          value={design.neckline} 
          onChange={(e) => onChange('neckline', e.target.value)}
          className="p-3 border rounded-lg bg-gray-50 text-sm font-medium"
        >
          <option value="round">Round Neck</option>
          <option value="boat">Boat Neck</option>
          <option value="v_neck">V-Neck</option>
          <option value="sweetheart">Sweetheart</option>
        </select>
        <select 
          value={design.sleeve_length} 
          onChange={(e) => onChange('sleeve_length', e.target.value)}
          className="p-3 border rounded-lg bg-gray-50 text-sm font-medium"
        >
          <option value="sleeveless">Sleeveless</option>
          <option value="short">Short Sleeves</option>
          <option value="elbow">Elbow Length</option>
          <option value="three_quarter">3/4 Sleeves</option>
          <option value="full">Full Sleeves</option>
        </select>
      </div>
      {warnings.neckline && <p className="text-xs text-red-500">⚠️ {warnings.neckline}</p>}
    </div>
  );
}