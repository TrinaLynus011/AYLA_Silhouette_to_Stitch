import { BodyRatios, BodyShape, BodyType } from '@/types';

// Body shape classification based on ratios
export function classifyBodyShape(ratios: BodyRatios): BodyShape {
  const { shoulder_ratio, waist_ratio, hip_ratio } = ratios;
  
  // Calculate differences
  const shoulderHipDiff = Math.abs(shoulder_ratio - hip_ratio);
  const waistHipDiff = hip_ratio - waist_ratio;
  const waistShoulderDiff = shoulder_ratio - waist_ratio;
  
  // Hourglass: balanced shoulders and hips, defined waist
  if (shoulderHipDiff <= 0.05 && waistHipDiff >= 0.15 && waistShoulderDiff >= 0.15) {
    return 'hourglass';
  }
  
  // Pear: hips wider than shoulders, defined waist
  if (hip_ratio > shoulder_ratio + 0.05 && waistHipDiff >= 0.10) {
    return 'pear';
  }
  
  // Apple: shoulders wider than hips, less defined waist
  if (shoulder_ratio > hip_ratio + 0.05 && waistHipDiff <= 0.10) {
    return 'apple';
  }
  
  // Rectangle: similar measurements, less defined waist
  return 'rectangle';
}

// Convert manual body shape selection to ratios
export function getDefaultRatiosForShape(shape: BodyShape): BodyRatios {
  const ratioMap: Record<BodyShape, BodyRatios> = {
    hourglass: {
      shoulder_ratio: 0.42,
      waist_ratio: 0.28,
      hip_ratio: 0.42,
      vertical_balance: 0.50
    },
    pear: {
      shoulder_ratio: 0.38,
      waist_ratio: 0.30,
      hip_ratio: 0.45,
      vertical_balance: 0.52
    },
    apple: {
      shoulder_ratio: 0.44,
      waist_ratio: 0.38,
      hip_ratio: 0.40,
      vertical_balance: 0.48
    },
    rectangle: {
      shoulder_ratio: 0.40,
      waist_ratio: 0.36,
      hip_ratio: 0.40,
      vertical_balance: 0.50
    }
  };
  
  return ratioMap[shape];
}

// Simulate body type inference from image (placeholder for actual CV implementation)
export function inferBodyTypeFromImage(imageData: string): Promise<BodyType> {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // Mock inference - in production, this would call a pose estimation API
      const mockRatios: BodyRatios = {
        shoulder_ratio: 0.40 + (Math.random() - 0.5) * 0.1,
        waist_ratio: 0.30 + (Math.random() - 0.5) * 0.08,
        hip_ratio: 0.42 + (Math.random() - 0.5) * 0.1,
        vertical_balance: 0.50 + (Math.random() - 0.5) * 0.06
      };
      
      const shape = classifyBodyShape(mockRatios);
      
      resolve({
        shape,
        ratios: mockRatios,
        source: 'image'
      });
    }, 1500);
  });
}

// Create body type from manual selection
export function createBodyTypeFromManual(shape: BodyShape): BodyType {
  return {
    shape,
    ratios: getDefaultRatiosForShape(shape),
    source: 'manual'
  };
}

// Validate and normalize ratios
export function normalizeRatios(ratios: BodyRatios): BodyRatios {
  return {
    shoulder_ratio: Math.max(0.25, Math.min(0.55, ratios.shoulder_ratio)),
    waist_ratio: Math.max(0.20, Math.min(0.45, ratios.waist_ratio)),
    hip_ratio: Math.max(0.25, Math.min(0.55, ratios.hip_ratio)),
    vertical_balance: Math.max(0.40, Math.min(0.60, ratios.vertical_balance))
  };
}