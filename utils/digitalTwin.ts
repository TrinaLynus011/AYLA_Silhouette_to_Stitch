import { BodyRatios, DigitalTwinCoords, OutfitDesign } from '@/types';

// Digital twin coordinate system
export class DigitalTwinSystem {
  private static readonly HEIGHT = 1.0;
  private static readonly BASE_WIDTH = 0.5;
  
  // Y-axis anchors
  private static readonly ANCHORS = {
    shoulders: 0.15,
    bust: 0.35,
    waist: 0.50,
    hips: 0.65
  };
  
  // Generate coordinates from body ratios
  static generateCoordinates(ratios: BodyRatios): DigitalTwinCoords {
    const centerX = 0.5;
    
    return {
      height: this.HEIGHT,
      shoulders: {
        x: centerX,
        y: this.ANCHORS.shoulders,
        width: ratios.shoulder_ratio
      },
      bust: {
        x: centerX,
        y: this.ANCHORS.bust,
        width: ratios.shoulder_ratio * 0.95
      },
      waist: {
        x: centerX,
        y: this.ANCHORS.waist,
        width: ratios.waist_ratio
      },
      hips: {
        x: centerX,
        y: this.ANCHORS.hips,
        width: ratios.hip_ratio
      }
    };
  }
  
  // Generate SVG path for silhouette
  static generateSilhouettePath(coords: DigitalTwinCoords): string {
    const { shoulders, bust, waist, hips } = coords;
    const scaleX = 400;
    const scaleY = 600;
    
    const points = {
      shoulderLeft: { x: (shoulders.x - shoulders.width / 2) * scaleX, y: shoulders.y * scaleY },
      shoulderRight: { x: (shoulders.x + shoulders.width / 2) * scaleX, y: shoulders.y * scaleY },
      bustLeft: { x: (bust.x - bust.width / 2) * scaleX, y: bust.y * scaleY },
      bustRight: { x: (bust.x + bust.width / 2) * scaleX, y: bust.y * scaleY },
      waistLeft: { x: (waist.x - waist.width / 2) * scaleX, y: waist.y * scaleY },
      waistRight: { x: (waist.x + waist.width / 2) * scaleX, y: waist.y * scaleY },
      hipLeft: { x: (hips.x - hips.width / 2) * scaleX, y: hips.y * scaleY },
      hipRight: { x: (hips.x + hips.width / 2) * scaleX, y: hips.y * scaleY }
    };
    
    const path = [
      `M ${points.shoulderLeft.x} ${points.shoulderLeft.y}`,
      `Q ${points.bustLeft.x} ${points.bustLeft.y} ${points.waistLeft.x} ${points.waistLeft.y}`,
      `Q ${points.waistLeft.x} ${(points.waistLeft.y + points.hipLeft.y) / 2} ${points.hipLeft.x} ${points.hipLeft.y}`,
      `Q ${points.hipLeft.x + 20} ${points.hipLeft.y + 20} ${points.hipRight.x} ${points.hipRight.y}`,
      `Q ${points.waistRight.x} ${(points.waistRight.y + points.hipRight.y) / 2} ${points.waistRight.x} ${points.waistRight.y}`,
      `Q ${points.bustRight.x} ${points.bustRight.y} ${points.shoulderRight.x} ${points.shoulderRight.y}`,
      `Q ${points.shoulderRight.x - 20} ${points.shoulderRight.y - 10} ${points.shoulderLeft.x} ${points.shoulderLeft.y}`,
      'Z'
    ].join(' ');
    
    return path;
  }
  
  // Generate comprehensive outfit overlay path
  static generateOutfitOverlay(coords: DigitalTwinCoords, outfit: OutfitDesign): string {
    let path = '';
    
    switch (outfit.outfit_type) {
      case 'saree_blouse':
        path += this.generateBlouseOverlay(coords, outfit.top_design.neckline, outfit.top_design.sleeve_length);
        if (outfit.saree_design) path += this.generateSareeOverlay(coords, outfit.saree_design);
        break;
      case 'salwar_kameez':
        path += this.generateKameezOverlay(coords, outfit.top_design);
        if (outfit.bottom_design) path += this.generateSalwarOverlay(coords, outfit.bottom_design);
        break;
      case 'lehenga_choli':
        path += this.generateCholiOverlay(coords, outfit.top_design);
        if (outfit.bottom_design) path += this.generateLehengaOverlay(coords, outfit.bottom_design);
        break;
      case 'anarkali_suit':
        path += this.generateAnarkaliOverlay(coords, outfit.top_design);
        break;
      default:
        path += this.generateBlouseOverlay(coords, outfit.top_design.neckline, outfit.top_design.sleeve_length);
    }
    
    if (outfit.dupatta_design) {
      path += this.generateDupattaOverlay(coords, outfit.dupatta_design);
    }
    
    return path;
  }

  // Generate blouse overlay
  private static generateBlouseOverlay(coords: DigitalTwinCoords, neckline: string, sleeveLength: string): string {
    const scaleX = 400;
    const scaleY = 600;
    const { shoulders, waist } = coords;
    
    const blouseTop = shoulders.y * scaleY + 10;
    let path = '';
    
    const necklineDepth = this.getNecklineDepth(neckline);
    const neckY = blouseTop + necklineDepth;
    
    if (neckline === 'round') {
      const centerX = shoulders.x * scaleX;
      const neckWidth = shoulders.width * scaleX * 0.3;
      path += `M ${centerX - neckWidth} ${neckY} Q ${centerX} ${neckY - 15} ${centerX + neckWidth} ${neckY}`;
    } else if (neckline === 'boat') {
      const leftX = (shoulders.x - shoulders.width * 0.4) * scaleX;
      const rightX = (shoulders.x + shoulders.width * 0.4) * scaleX;
      path += `M ${leftX} ${neckY} L ${rightX} ${neckY}`;
    }
    
    if (sleeveLength !== 'sleeveless') {
      const sleeveLength_px = this.getSleeveLength(sleeveLength);
      const shoulderLeft = (shoulders.x - shoulders.width / 2) * scaleX;
      const shoulderRight = (shoulders.x + shoulders.width / 2) * scaleX;
      path += ` M ${shoulderLeft} ${blouseTop} L ${shoulderLeft - 30} ${blouseTop} L ${shoulderLeft - 25} ${blouseTop + sleeveLength_px} L ${shoulderLeft} ${blouseTop + sleeveLength_px}`;
      path += ` M ${shoulderRight} ${blouseTop} L ${shoulderRight + 30} ${blouseTop} L ${shoulderRight + 25} ${blouseTop + sleeveLength_px} L ${shoulderRight} ${blouseTop + sleeveLength_px}`;
    }
    
    return path;
  }

  // Generate Kameez overlay
  private static generateKameezOverlay(coords: DigitalTwinCoords, topDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { shoulders, waist } = coords;
    
    const kameezTop = shoulders.y * scaleY + 10;
    const kameezBottom = this.getTopLength(topDesign.length, coords) * scaleY;
    
    let path = `M ${(shoulders.x - shoulders.width/2) * scaleX} ${kameezTop}`;
    path += ` L ${(shoulders.x + shoulders.width/2) * scaleX} ${kameezTop}`;
    path += ` L ${(waist.x + waist.width/2) * scaleX} ${kameezBottom}`;
    path += ` L ${(waist.x - waist.width/2) * scaleX} ${kameezBottom} Z`;
    
    return path;
  }

  // Generate Saree overlay
  private static generateSareeOverlay(coords: DigitalTwinCoords, sareeDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { waist, hips, shoulders } = coords;
    
    const sareeTop = waist.y * scaleY;
    const sareeBottom = 580;
    
    let path = `M ${(waist.x - waist.width/2) * scaleX} ${sareeTop}`;
    
    const pleatsCount = 7;
    const pleatWidth = (waist.width * scaleX) / pleatsCount;
    
    for (let i = 0; i < pleatsCount; i++) {
      const x = (waist.x - waist.width/2) * scaleX + (i * pleatWidth);
      path += ` L ${x} ${sareeTop + 10} L ${x + pleatWidth/2} ${sareeTop} L ${x + pleatWidth} ${sareeTop + 10}`;
    }
    
    path += ` L ${(hips.x + hips.width/2) * scaleX} ${sareeBottom}`;
    path += ` L ${(hips.x - hips.width/2) * scaleX} ${sareeBottom} Z`;
    path += ` M ${(shoulders.x - shoulders.width/3) * scaleX} ${shoulders.y * scaleY + 20}`;
    path += ` Q ${(shoulders.x) * scaleX} ${shoulders.y * scaleY - 10} ${(shoulders.x + shoulders.width/3) * scaleX} ${shoulders.y * scaleY + 20}`;
    path += ` L ${(waist.x + waist.width/4) * scaleX} ${waist.y * scaleY + 50}`;
    
    return path;
  }

  // Generate Lehenga overlay
  private static generateLehengaOverlay(coords: DigitalTwinCoords, bottomDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { waist, hips } = coords;
    
    const lehengaTop = waist.y * scaleY;
    const lehengaBottom = 580;
    
    let path = `M ${(waist.x - waist.width/2) * scaleX} ${lehengaTop}`;
    path += ` L ${(waist.x + waist.width/2) * scaleX} ${lehengaTop}`;
    path += ` Q ${(hips.x + hips.width/2 + 0.1) * scaleX} ${(hips.y + 0.1) * scaleY} ${(hips.x + hips.width/2 + 0.15) * scaleX} ${lehengaBottom}`;
    path += ` L ${(hips.x - hips.width/2 - 0.15) * scaleX} ${lehengaBottom}`;
    path += ` Q ${(hips.x - hips.width/2 - 0.1) * scaleX} ${(hips.y + 0.1) * scaleY} ${(waist.x - waist.width/2) * scaleX} ${lehengaTop} Z`;
    
    return path;
  }

  // Generate Choli overlay
  private static generateCholiOverlay(coords: DigitalTwinCoords, topDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { shoulders, bust } = coords;
    
    const choliTop = shoulders.y * scaleY + 10;
    const choliBottom = bust.y * scaleY + 40;
    
    let path = `M ${(shoulders.x - shoulders.width/2 + 0.02) * scaleX} ${choliTop}`;
    path += ` L ${(shoulders.x + shoulders.width/2 - 0.02) * scaleX} ${choliTop}`;
    path += ` L ${(bust.x + bust.width/2) * scaleX} ${choliBottom}`;
    path += ` L ${(bust.x - bust.width/2) * scaleX} ${choliBottom} Z`;
    
    return path;
  }

  // Generate Anarkali overlay
  private static generateAnarkaliOverlay(coords: DigitalTwinCoords, topDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { shoulders, bust, waist } = coords;
    
    const anarkaliTop = shoulders.y * scaleY + 10;
    const anarkaliBottom = 550;
    
    let path = `M ${(shoulders.x - shoulders.width/2) * scaleX} ${anarkaliTop}`;
    path += ` L ${(shoulders.x + shoulders.width/2) * scaleX} ${anarkaliTop}`;
    path += ` L ${(bust.x + bust.width/2) * scaleX} ${bust.y * scaleY}`;
    path += ` L ${(waist.x + waist.width/2) * scaleX} ${waist.y * scaleY}`;
    path += ` Q ${(waist.x + waist.width/2 + 0.1) * scaleX} ${(waist.y + 0.05) * scaleY} ${(waist.x + waist.width/2 + 0.2) * scaleX} ${anarkaliBottom}`;
    path += ` L ${(waist.x - waist.width/2 - 0.2) * scaleX} ${anarkaliBottom}`;
    path += ` Q ${(waist.x - waist.width/2 - 0.1) * scaleX} ${(waist.y + 0.05) * scaleY} ${(waist.x - waist.width/2) * scaleX} ${waist.y * scaleY}`;
    path += ` L ${(bust.x - bust.width/2) * scaleX} ${bust.y * scaleY}`;
    path += ` L ${(shoulders.x - shoulders.width/2) * scaleX} ${anarkaliTop} Z`;
    
    return path;
  }

  // Generate Salwar overlay
  private static generateSalwarOverlay(coords: DigitalTwinCoords, bottomDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { waist, hips } = coords;
    
    const salwarTop = waist.y * scaleY;
    const salwarBottom = 520;
    
    let path = `M ${(waist.x - waist.width/2) * scaleX} ${salwarTop}`;
    path += ` L ${(waist.x + waist.width/2) * scaleX} ${salwarTop}`;
    path += ` L ${(hips.x + hips.width/2 + 0.05) * scaleX} ${hips.y * scaleY}`;
    path += ` L ${(hips.x + hips.width/2) * scaleX} ${salwarBottom}`;
    path += ` L ${(hips.x - hips.width/2) * scaleX} ${salwarBottom}`;
    path += ` L ${(hips.x - hips.width/2 - 0.05) * scaleX} ${hips.y * scaleY} Z`;
    
    return path;
  }

  // Generate Dupatta overlay
  private static generateDupattaOverlay(coords: DigitalTwinCoords, dupattaDesign: any): string {
    const scaleX = 400;
    const scaleY = 600;
    const { shoulders, bust } = coords;
    
    let path = `M ${(shoulders.x - shoulders.width/2 - 0.05) * scaleX} ${shoulders.y * scaleY}`;
    path += ` Q ${shoulders.x * scaleX} ${(shoulders.y - 0.02) * scaleY} ${(shoulders.x + shoulders.width/2 + 0.05) * scaleX} ${shoulders.y * scaleY}`;
    path += ` L ${(bust.x + bust.width/3) * scaleX} ${bust.y * scaleY + 100}`;
    path += ` Q ${bust.x * scaleX} ${bust.y * scaleY + 80} ${(bust.x - bust.width/3) * scaleX} ${bust.y * scaleY + 100} Z`;
    
    return path;
  }

  // Helper methods
  private static getNecklineDepth(neckline: string): number {
    const depths: Record<string, number> = {
      'round': 25,
      'boat': 15,
      'deep_round': 40,
      'square': 30,
      'sweetheart': 35,
      'halter': 20,
      'v_neck': 30,
      'high_neck': 10
    };
    return depths[neckline] || 25;
  }
  
  private static getSleeveLength(sleeveLength: string): number {
    const lengths: Record<string, number> = {
      'cap': 20,
      'short': 60,
      'elbow': 120,
      'three_quarter': 180,
      'full': 240
    };
    return lengths[sleeveLength] || 60;
  }

  private static getTopLength(length: string, coords: DigitalTwinCoords): number {
    const lengthMap: Record<string, number> = {
      'crop': coords.bust.y + 0.05,
      'waist': coords.waist.y + 0.02,
      'hip': coords.hips.y + 0.02,
      'knee': coords.hips.y + 0.15,
      'midi': coords.hips.y + 0.25,
      'maxi': 0.95
    };
    return lengthMap[length] || coords.waist.y + 0.02;
  }
  
  // Apply user adjustments to coordinates
  static applyUserAdjustments(
    coords: DigitalTwinCoords, 
    adjustments: { 
      shoulder?: number; 
      waist?: number; 
      hip?: number; 
      height?: number; 
    }
  ): DigitalTwinCoords {
    const adjusted = { ...coords };
    
    if (adjustments.shoulder) {
      adjusted.shoulders.width *= (1 + adjustments.shoulder / 100);
      adjusted.bust.width *= (1 + adjustments.shoulder / 100 * 0.8);
    }
    
    if (adjustments.waist) {
      adjusted.waist.width *= (1 + adjustments.waist / 100);
    }
    
    if (adjustments.hip) {
      adjusted.hips.width *= (1 + adjustments.hip / 100);
    }
    
    if (adjustments.height) {
      adjusted.height *= (1 + adjustments.height / 100);
    }
    
    return adjusted;
  }
}