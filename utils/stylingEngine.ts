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
      accessories: this.getAccessoryRecommendations(bodyType, baseOutfit, undertoneAnalysis),
      avoid: this.getAvoidanceList(bodyType, fabricType),
      tailor_notes: this.getTailorNotes(baseOutfit, fabricType, customFabric),
      makeup: this.getMakeupRecommendation(undertoneAnalysis),
      measurements: this.generateMeasurements(bodyType),
      color_recommendations: undertoneAnalysis?.recommended_colors || [],
      undertone_advice: `Palette tuned to your ${undertoneAnalysis?.undertone || 'neutral'} undertone.`
    };
  }

  static generateDesignRationale(bodyType: BodyType, design: OutfitDesign): string {
    const reasons: string[] = [];
    const shape = bodyType.shape.toLowerCase();

    switch (design.top_design.neckline) {
      case 'v_neck': reasons.push('A V-neck elongates the torso and creates a slimming vertical focal point.'); break;
      case 'boat': reasons.push('The Boat neck broadens the shoulder line to balance your silhouette.'); break;
      case 'sweetheart': reasons.push('A Sweetheart neckline accentuates your natural curves beautifully.'); break;
      default: reasons.push('This neckline maintains a classic, balanced proportion.');
    }

    if (shape === 'pear') reasons.push('As a pear shape, this design draws focus upward to balance your proportions.');
    if (shape === 'apple') reasons.push('This cut provides structure around the midsection for an elongated look.');
    if (shape === 'hourglass') reasons.push('This fitted silhouette follows your natural symmetry.');

    return reasons.join(' ');
  }

  private static getAccessoryRecommendations(bodyType: BodyType, design: OutfitDesign, undertone: any): string[] {
    const shape = bodyType.shape.toLowerCase();
    const metal = undertone?.undertone === 'warm' ? 'Gold/Kundan' : 'Silver/Oxidized';
    const list = [`Opt for ${metal} jewelry to complement your skin tone.`];

    if (shape === 'pear') {
      list.push("Heavy choker to draw attention to the neckline.");
      list.push("Minimal waist accessories to keep the lower silhouette clean.");
    } else if (shape === 'apple') {
      list.push("Longer necklaces to create a slimming vertical line.");
    } else if (shape === 'hourglass') {
      list.push("A sleek waist belt (Kamarbandh) to accentuate your waist.");
    }
    return list;
  }

  private static getAvoidanceList(bodyType: BodyType, fabric: FabricType): string[] {
    const shape = bodyType.shape.toLowerCase();
    const props = getFabricProperties(fabric);
    const list = [];

    if (shape === 'pear') list.push("Avoid heavy motifs on the hip area.");
    if (shape === 'apple') list.push("Avoid high-neck designs that may shorten the torso.");
    if (props.structure === 'stiff') list.push(`Avoid tight sleeves in ${fabric} for comfort.`);
    
    return list;
  }

  private static getTailorNotes(design: OutfitDesign, fabric: FabricType, custom?: string): string[] {
    return [
      "Ensure 1.5-inch margins for future alterations.",
      "Reinforced piping at the neckline to prevent sagging.",
      fabric === 'silk' ? "Use fine-gauge needles to prevent snagging." : "Standard seam reinforcement."
    ];
  }

  static getBaseOutfitForBodyType(bodyType: BodyType, outfitType: OutfitType): OutfitDesign {
    const shape = bodyType.shape.toLowerCase();
    const config = {
      pear: { neckline: 'boat', sleeve: 'cap', fit: 'fitted' },
      apple: { neckline: 'v_neck', sleeve: 'three_quarter', fit: 'regular' },
      hourglass: { neckline: 'sweetheart', sleeve: 'elbow', fit: 'fitted' },
      rectangle: { neckline: 'round', sleeve: 'short', fit: 'regular' }
    }[shape] || { neckline: 'round', sleeve: 'short', fit: 'regular' };

    return {
      outfit_type: outfitType,
      top_design: {
        neckline: config.neckline as any,
        sleeve_length: config.sleeve as any,
        sleeve_style: 'regular',
        back_design: 'keyhole',
        length: 'waist',
        fit: config.fit as any,
        closure: 'buttons'
      },
      color_scheme: { primary_color: '#D2691E', undertone_match: true },
      embellishments: []
    };
  }

  static generateOutfitDesign(bodyType: BodyType, fabricType: FabricType, outfitType: OutfitType, customFabric?: string): OutfitDesign {
    return this.getBaseOutfitForBodyType(bodyType, outfitType);
  }

  private static getMakeupRecommendation(undertone: any): string {
    return undertone?.undertone === 'warm' ? "Terracotta / Coral shades" : "Berry / Rose shades";
  }

  private static generateMeasurements(bodyType: BodyType): DetailedMeasurements {
    return { bust: 34, waist: 28, hip: 38, shoulder_width: 14, height: 64 };
  }
}