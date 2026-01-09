import { BodyType, FabricType, OutfitDesign, UndertoneAnalysis } from '@/types';

interface UndertoneSignals {
  bodyType: BodyType;
  fabric: FabricType;
  outfit?: OutfitDesign | null;
  preference?: {
    occasion?: string;
    modesty?: string;
  };
}

const undertonePalettes: Record<UndertoneAnalysis['undertone'], string[]> = {
  warm: ['#D2691E', '#CD853F', '#DAA520', '#B8860B', '#C67C4E', '#F4A460', '#DEB887', '#BC8F8F'],
  cool: ['#4A6FA5', '#6B8FD6', '#8AA1E6', '#B0C4DE', '#8B7D8B', '#6C7A89', '#7E9CD6', '#9BB7F0'],
  neutral: ['#9C8C7A', '#C2B8A3', '#B5A38D', '#D8CDBA', '#A6A6A6', '#D3C7B2', '#B4A284', '#C7B299']
};

function getColorWarmth(hex?: string): number | null {
  if (!hex) return null;
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return (r + g * 0.6) / (b + 1);
}

export function inferUndertoneFromSignals({ bodyType, fabric, outfit, preference }: UndertoneSignals): UndertoneAnalysis {
  let warmScore = 1; // start neutral but non-zero to avoid divide-by-zero
  let coolScore = 1;
  let neutralScore = 1;

  const warmFabrics: FabricType[] = ['silk', 'brocade', 'velvet', 'satin'];
  const coolFabrics: FabricType[] = ['chiffon', 'organza', 'georgette'];

  if (warmFabrics.includes(fabric)) warmScore += 2;
  if (coolFabrics.includes(fabric)) coolScore += 1.5;
  if (fabric === 'linen' || fabric === 'cotton') neutralScore += 1;

  if (preference?.occasion === 'bridal' || preference?.occasion === 'festive') {
    warmScore += 1.5;
  } else if (preference?.occasion === 'everyday') {
    neutralScore += 1;
  }

  const primaryWarmth = getColorWarmth(outfit?.color_scheme?.primary_color);
  if (primaryWarmth) {
    if (primaryWarmth > 1.1) warmScore += 1.5;
    else if (primaryWarmth < 0.9) coolScore += 1.5;
    else neutralScore += 1;
  }

  if (outfit?.color_scheme?.undertone_match === false) neutralScore += 0.5;

  if (bodyType.shape === 'apple') coolScore += 0.3; // cooler palettes for calming effect
  if (bodyType.shape === 'pear') warmScore += 0.3; // warmth to lift upper body focus

  const scores = { warm: warmScore, cool: coolScore, neutral: neutralScore };
  const winning = (Object.entries(scores) as [UndertoneAnalysis['undertone'], number][]) 
    .sort((a, b) => b[1] - a[1])[0][0];

  const total = warmScore + coolScore + neutralScore;
  const dominance = scores[winning] / total;
  const confidence = Math.min(0.95, 0.62 + dominance * 0.3);

  return {
    undertone: winning,
    confidence,
    source: 'detected',
    recommended_colors: undertonePalettes[winning]
  };
}
