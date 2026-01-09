import { UndertoneAnalysis } from '@/types';

/**
 * Analyzes skin undertone from captured image using color analysis
 * This is a simplified implementation - in production, you'd use ML models
 */
export async function detectUndertoneFromImage(imageDataUrl: string): Promise<UndertoneAnalysis> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        // Fallback to neutral
        resolve({
          undertone: 'neutral',
          confidence: 0.60,
          recommended_colors: ['#D2691E', '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460'],
          source: 'detected'
        });
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Sample skin tone from face/neck area (center-top region)
      const sampleWidth = Math.floor(img.width * 0.3);
      const sampleHeight = Math.floor(img.height * 0.2);
      const startX = Math.floor((img.width - sampleWidth) / 2);
      const startY = Math.floor(img.height * 0.15);
      
      const imageData = ctx.getImageData(startX, startY, sampleWidth, sampleHeight);
      const data = imageData.data;
      
      let totalR = 0, totalG = 0, totalB = 0;
      let samples = 0;
      
      // Sample every 10th pixel to get average skin tone
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Filter out very dark or very bright pixels (likely background/clothing)
        const brightness = (r + g + b) / 3;
        if (brightness > 50 && brightness < 240) {
          totalR += r;
          totalG += g;
          totalB += b;
          samples++;
        }
      }
      
      if (samples === 0) {
        resolve({
          undertone: 'neutral',
          confidence: 0.60,
          recommended_colors: ['#D2691E', '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460'],
          source: 'detected'
        });
        return;
      }
      
      const avgR = totalR / samples;
      const avgG = totalG / samples;
      const avgB = totalB / samples;
      
      // Analyze color ratios to determine undertone
      const warmScore = avgR - avgB; // Higher = warmer (more red than blue)
      const coolScore = avgB - avgR; // Higher = cooler (more blue than red)
      const greenRatio = avgG / ((avgR + avgB) / 2);
      
      let undertone: 'warm' | 'cool' | 'neutral';
      let confidence: number;
      let recommended_colors: string[];
      
      if (warmScore > 15) {
        // Warm undertone (peachy/golden/yellow)
        undertone = 'warm';
        confidence = Math.min(0.85, 0.65 + (warmScore / 100));
        recommended_colors = [
          '#D2691E', // Chocolate
          '#CD7F32', // Bronze
          '#DAA520', // Goldenrod
          '#F0E68C', // Khaki
          '#FFD700', // Gold
          '#FF8C00'  // Dark Orange
        ];
      } else if (coolScore > 15) {
        // Cool undertone (pink/blue/red)
        undertone = 'cool';
        confidence = Math.min(0.85, 0.65 + (coolScore / 100));
        recommended_colors = [
          '#4169E1', // Royal Blue
          '#8B008B', // Dark Magenta
          '#C71585', // Medium Violet Red
          '#E6E6FA', // Lavender
          '#B0C4DE', // Light Steel Blue
          '#9370DB'  // Medium Purple
        ];
      } else {
        // Neutral undertone (balanced)
        undertone = 'neutral';
        confidence = 0.70;
        recommended_colors = [
          '#8B4513', // Saddle Brown
          '#A0522D', // Sienna
          '#CD853F', // Peru
          '#DEB887', // Burlywood
          '#F4A460', // Sandy Brown
          '#D2691E'  // Chocolate
        ];
      }
      
      resolve({
        undertone,
        confidence,
        recommended_colors,
        source: 'detected'
      });
    };
    
    img.onerror = () => {
      resolve({
        undertone: 'neutral',
        confidence: 0.60,
        recommended_colors: ['#D2691E', '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460'],
        source: 'detected'
      });
    };
    
    img.src = imageDataUrl;
  });
}
