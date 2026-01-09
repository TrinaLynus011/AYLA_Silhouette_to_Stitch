import { OutfitDesign, UndertoneAnalysis } from '@/types';

/**
 * Generates smart design recommendations based on body type and undertone
 * Suggests neckline, sleeve length, and other design elements optimized for the body shape
 */
export function generateSmartDesign(
  bodyShape: string,
  undertoneAnalysis: UndertoneAnalysis | null
): OutfitDesign {
  let neckline: OutfitDesign['top_design']['neckline'];
  let sleeveLength: OutfitDesign['top_design']['sleeve_length'];
  let fit: OutfitDesign['top_design']['fit'];
  let length: OutfitDesign['top_design']['length'];
  let backDesign: OutfitDesign['top_design']['back_design'];
  let reasoning: string;

  // Body type specific recommendations
  switch (bodyShape.toLowerCase()) {
    case 'hourglass':
      neckline = 'sweetheart';
      sleeveLength = 'elbow';
      fit = 'fitted';
      length = 'waist';
      backDesign = 'keyhole';
      reasoning = 'Sweetheart neckline and fitted design enhance your balanced proportions';
      break;

    case 'pear':
      neckline = 'boat';
      sleeveLength = 'cap';
      fit = 'fitted';
      length = 'waist';
      backDesign = 'keyhole';
      reasoning = 'Boat neck draws attention upward, cap sleeves broaden shoulders to balance hips';
      break;

    case 'apple':
      neckline = 'deep_round';
      sleeveLength = 'three_quarter';
      fit = 'regular';
      length = 'midi';
      backDesign = 'closed';
      reasoning = 'Deep V-neck elongates torso, 3/4 sleeves create vertical lines';
      break;

    case 'rectangle':
      neckline = 'round';
      sleeveLength = 'short';
      fit = 'regular';
      length = 'waist';
      backDesign = 'keyhole';
      reasoning = 'Round neck with short sleeves creates visual interest and shape';
      break;

    case 'inverted_triangle':
      neckline = 'round';
      sleeveLength = 'full';
      fit = 'regular';
      length = 'waist';
      backDesign = 'closed';
      reasoning = 'Round neck and full sleeves soften broad shoulders';
      break;

    default:
      neckline = 'round';
      sleeveLength = 'elbow';
      fit = 'regular';
      length = 'waist';
      backDesign = 'keyhole';
      reasoning = 'Classic design suitable for most body types';
  }

  // Color selection based on undertone
  let primaryColor = '#D2691E'; // Default chocolate brown
  let accentColor = '#8B4513'; // Saddle brown
  
  if (undertoneAnalysis) {
    primaryColor = undertoneAnalysis.recommended_colors[0] || primaryColor;
    accentColor = undertoneAnalysis.recommended_colors[1] || accentColor;
  }

  return {
    outfit_type: 'saree_blouse',
    top_design: {
      neckline,
      sleeve_length: sleeveLength,
      sleeve_style: 'regular',
      back_design: backDesign,
      length,
      fit,
      closure: 'buttons'
    },
    color_scheme: {
      primary_color: primaryColor,
      accent_color: accentColor,
      undertone_match: true
    },
    embellishments: [
      {
        type: 'thread_work',
        placement: 'neckline',
        intensity: 'minimal'
      }
    ]
  };
}

/**
 * Get explanation for why a specific design element suits a body type
 */
export function getDesignRationale(
  bodyShape: string,
  element: 'neckline' | 'sleeve' | 'fit' | 'length'
): string {
  const rationales: Record<string, Record<string, string>> = {
    hourglass: {
      neckline: 'Sweetheart and V-necks highlight your balanced proportions',
      sleeve: 'Elbow or 3/4 length sleeves maintain your curves',
      fit: 'Fitted designs showcase your natural waist definition',
      length: 'Regular length emphasizes your balanced silhouette'
    },
    pear: {
      neckline: 'Boat neck and square necks broaden shoulders to balance hips',
      sleeve: 'Cap or short sleeves add visual weight to upper body',
      fit: 'Fitted on top, regular below creates balance',
      length: 'Regular to long length streamlines lower body'
    },
    apple: {
      neckline: 'Deep V or scoop necks elongate and slim the torso',
      sleeve: '3/4 sleeves create vertical lines without bulk',
      fit: 'Regular fit provides comfort around the midsection',
      length: 'Longer lengths create a slimming vertical line'
    },
    rectangle: {
      neckline: 'Round or sweetheart necks add curves',
      sleeve: 'Short to elbow sleeves create shape and definition',
      fit: 'Regular to slightly fitted creates curves',
      length: 'Regular length with embellishments adds dimension'
    },
    inverted_triangle: {
      neckline: 'Round or halter necks soften broad shoulders',
      sleeve: 'Full sleeves balance shoulder width',
      fit: 'Regular fit prevents adding bulk to shoulders',
      length: 'Regular to long creates vertical flow'
    }
  };

  return rationales[bodyShape.toLowerCase()]?.[element] || 'This design complements your body type';
}
