// utils/stylingEngine.ts
import { 
  BodyType, 
  FabricType, 
  OutfitDesign, 
  StyleRecommendation,
  OutfitType,
  DetailedMeasurements
} from '@/types';
import { getFabricProperties } from './fabricEngine';

export class StylingEngine {
  
  static generateRecommendation(
    bodyType: BodyType, 
    fabricType: FabricType,
    customFabric?: string,
    undertoneAnalysis?: { undertone: string; recommended_colors?: string[] } | null,
    stylePreference?: { modesty?: string; occasion?: string } | null,
    currentDesign?: OutfitDesign
  ): StyleRecommendation {
    const fabricProps = getFabricProperties(fabricType);
    const baseOutfit = currentDesign || this.getBaseOutfitForBodyType(bodyType, 'salwar_kameez');
    
    return {
      outfit: baseOutfit,
      reasoning: this.generateDesignRationale(bodyType, baseOutfit),
      // DYNAMIC ARRAYS BASED ON BODY TYPE AND FABRIC
      accessories: this.getAccessoryRecommendations(bodyType, baseOutfit, undertoneAnalysis),
      avoid: this.getAvoidanceList(bodyType, fabricType),
      tailor_notes: this.getTailorNotes(baseOutfit, fabricType, customFabric),
      makeup: this.getMakeupRecommendation(undertoneAnalysis),
      measurements: this.generateMeasurements(bodyType),
      color_recommendations: undertoneAnalysis?.recommended_colors || [],
      undertone_advice: `Palette tuned to your ${undertoneAnalysis?.undertone || 'neutral'} undertone.`
    };
  }

  private static getAccessoryRecommendations(bodyType: BodyType, design: OutfitDesign, undertone: any): string[] {
    const shape = bodyType.shape.toLowerCase();
    const metal = undertone?.undertone === 'warm' ? 'Gold/Kundan' : 'Silver/Oxidized';
    const list = [`Opt for ${metal} jewelry to complement your skin tone.`];

    if (shape === 'pear') {
      list.push("Heavy choker or statement necklace to draw attention to the neckline.");
      list.push("Minimal waist accessories to keep the lower silhouette clean.");
    } else if (shape === 'apple') {
      list.push("Longer necklaces or 'Rani Haars' to create a slimming vertical line.");
      list.push("Small, elegant studs to avoid adding width to the face/neck area.");
    } else if (shape === 'hourglass') {
      list.push("A sleek 'Kamarbandh' (waist belt) to accentuate your defined waist.");
      list.push("Balanced Jhumkas that mirror your proportional silhouette.");
    } else if (shape === 'rectangle') {
      list.push("Layered necklaces to add dimension to the neckline.");
      list.push("Wide bangles or statement bracelets to create shoulder width illusion.");
    }
    return list;
  }

  private static getAvoidanceList(bodyType: BodyType, fabric: FabricType): string[] {
    const shape = bodyType.shape.toLowerCase();
    const props = getFabricProperties(fabric);
    const list = [];

    // Body shape-specific avoidances
    if (shape === 'pear') list.push("Avoid heavy embroidery or large motifs on the hip area.");
    if (shape === 'apple') list.push("Avoid high-neck designs that may make the torso look shorter.");
    if (shape === 'hourglass') list.push("Avoid overly loose or baggy fits that hide your natural curves.");
    if (shape === 'rectangle') list.push("Avoid simple, unadorned silhouettes that emphasize linearity.");

    // Fabric-specific avoidances
    if (props.structure === 'stiff') list.push(`Avoid extremely fitted sleeves in ${fabric} to ensure comfort.`);
    if (fabric === 'chiffon') list.push("Avoid heavy embroidery that weighs down the delicate fabric.");
    if (fabric === 'silk') list.push("Avoid dark, high-contrast prints on silk that might show wear marks.");
    
    return list.length > 0 ? list : ["No specific restrictions for this combination."];
  }

  private static getTailorNotes(design: OutfitDesign, fabric: FabricType, custom?: string): string[] {
    const notes = ["Ensure 1.5-inch margins for future alterations."];
    
    // Fabric-specific notes
    if (fabric === 'silk' || fabric === 'chiffon') {
      notes.push("Use fine-gauge needles to prevent fabric snagging.");
      notes.push("Reinforced piping at the neckline to prevent sagging.");
    }
    if (fabric === 'cotton') {
      notes.push("Pre-wash fabric to account for natural shrinkage.");
      notes.push("Use standard needles and thread for durability.");
    }
    if (fabric === 'brocade') {
      notes.push("Match pattern at center front seam for symmetry.");
      notes.push("Use wider seam allowances for heavyweight fabrics.");
    }
    
    // Fit-specific notes
    if (design.top_design.fit === 'fitted') {
      notes.push("Double-stitch the side seams for high-stress areas.");
    }
    if (design.top_design.fit === 'regular') {
      notes.push("Ensure even hem length after fitting adjustments.");
    }
    
    return notes;
  }

  private static getMakeupRecommendation(undertone: any): string {
    const tone = undertone?.undertone || 'neutral';
    if (tone === 'warm') return "Warm bronze, terracotta, and gold tones enhance your natural radiance.";
    if (tone === 'cool') return "Cool pinks, plums, and silvers create a stunning contrast with your skin.";
    return "Neutral earth tones work beautifully with your balanced undertone.";
  }

  static generateDesignRationale(bodyType: BodyType, design: OutfitDesign): string {
    const reasons: string[] = [];
    const shape = bodyType.shape.toLowerCase();

    // Neckline logic
    switch (design.top_design.neckline) {
      case 'v_neck': reasons.push('A V-neck elongates the torso and creates a slimming vertical focal point.'); break;
      case 'boat': reasons.push('The Boat neck broadens the shoulder line to balance your silhouette.'); break;
      case 'sweetheart': reasons.push('A Sweetheart neckline accentuates your natural curves beautifully.'); break;
      default: reasons.push('This neckline maintains a classic, balanced proportion.');
    }

    // Body shape specific logic
    if (shape === 'pear') reasons.push('Since you have a pear shape, this design draws attention upward to balance your hips.');
    if (shape === 'apple') reasons.push('This cut provides structure around the midsection for an elongated look.');
    if (shape === 'hourglass') reasons.push('This fitted silhouette follows your natural symmetry.');
    if (shape === 'rectangle') reasons.push('This design adds curves and visual interest to your linear silhouette.');

    return reasons.join(' ');
  }

  static getBaseOutfitForBodyType(bodyType: BodyType, outfitType: OutfitType): OutfitDesign {
    const shape = bodyType.shape.toLowerCase();
    const designMap: Record<string, any> = {
      pear: { neckline: 'boat', sleeve: 'cap', fit: 'fitted' },
      apple: { neckline: 'v_neck', sleeve: 'three_quarter', fit: 'regular' },
      hourglass: { neckline: 'sweetheart', sleeve: 'elbow', fit: 'fitted' },
      rectangle: { neckline: 'round', sleeve: 'short', fit: 'regular' }
    };

    const config = designMap[shape] || designMap.rectangle;

    return {
      outfit_type: outfitType,
      top_design: {
        neckline: config.neckline,
        sleeve_length: config.sleeve,
        sleeve_style: 'regular',
        back_design: 'keyhole',
        length: 'waist',
        fit: config.fit,
        closure: 'buttons'
      },
      color_scheme: { primary_color: '#D2691E', undertone_match: true },
      embellishments: []
    };
  }

  static generateOutfitDesign(bodyType: BodyType, fabricType: FabricType, outfitType: OutfitType, customFabric?: string): OutfitDesign {
    return this.getBaseOutfitForBodyType(bodyType, outfitType);
  }

  private static applyFabricAdjustments(baseOutfit: OutfitDesign, fabricType: FabricType): OutfitDesign {
    return { ...baseOutfit };
  }

  private static generateMeasurements(bodyType: BodyType): DetailedMeasurements {
    return { bust: 34, waist: 28, hip: 38, shoulder_width: 14 } as any;
  }
}