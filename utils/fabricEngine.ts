import { FabricType, FabricProperties } from '@/types';

// Fabric properties database
export const FABRIC_PROPERTIES: Record<FabricType, FabricProperties> = {
  cotton: {
    structure: 'medium',
    fall: 'semi-fluid',
    support: 'medium',
    occasion_weight: 'daily'
  },
  silk: {
    structure: 'medium',
    fall: 'fluid',
    support: 'medium',
    occasion_weight: 'festive'
  },
  georgette: {
    structure: 'soft',
    fall: 'fluid',
    support: 'low',
    occasion_weight: 'festive'
  },
  chiffon: {
    structure: 'soft',
    fall: 'fluid',
    support: 'low',
    occasion_weight: 'festive'
  },
  linen: {
    structure: 'stiff',
    fall: 'rigid',
    support: 'high',
    occasion_weight: 'daily'
  },
  satin: {
    structure: 'medium',
    fall: 'fluid',
    support: 'medium',
    occasion_weight: 'festive'
  },
  velvet: {
    structure: 'stiff',
    fall: 'rigid',
    support: 'high',
    occasion_weight: 'bridal'
  },
  organza: {
    structure: 'stiff',
    fall: 'rigid',
    support: 'high',
    occasion_weight: 'bridal'
  },
  brocade: {
    structure: 'stiff',
    fall: 'rigid',
    support: 'high',
    occasion_weight: 'bridal'
  },
  custom: {
    structure: 'medium',
    fall: 'semi-fluid',
    support: 'medium',
    occasion_weight: 'daily'
  }
};

// Get fabric properties
export function getFabricProperties(fabricType: FabricType): FabricProperties {
  // Safety check: return default if fabricType is undefined or invalid
  if (!fabricType || !FABRIC_PROPERTIES[fabricType]) {
    console.warn(`Invalid fabric type: ${fabricType}, using cotton as default`);
    return FABRIC_PROPERTIES.cotton;
  }
  return FABRIC_PROPERTIES[fabricType];
}

// Fabric display information
export const FABRIC_INFO: Record<FabricType, { name: string; description: string; icon: string }> = {
  cotton: {
    name: 'Cotton',
    description: 'Breathable, comfortable for daily wear',
    icon: '🌿'
  },
  silk: {
    name: 'Silk',
    description: 'Luxurious, elegant drape',
    icon: '✨'
  },
  georgette: {
    name: 'Georgette',
    description: 'Lightweight, flowing texture',
    icon: '🌸'
  },
  chiffon: {
    name: 'Chiffon',
    description: 'Sheer, delicate appearance',
    icon: '🦋'
  },
  linen: {
    name: 'Linen',
    description: 'Crisp, structured look',
    icon: '🌾'
  },
  satin: {
    name: 'Satin',
    description: 'Smooth, glossy finish',
    icon: '💎'
  },
  velvet: {
    name: 'Velvet',
    description: 'Rich, textured luxury',
    icon: '👑'
  },
  organza: {
    name: 'Organza',
    description: 'Crisp, transparent elegance',
    icon: '🌟'
  },
  brocade: {
    name: 'Brocade',
    description: 'Ornate, woven patterns',
    icon: '🏺'
  },
  custom: {
    name: 'Custom',
    description: 'Describe your fabric',
    icon: '📝'
  }
};

// Get fabric recommendations based on occasion
export function getFabricsByOccasion(occasion: 'daily' | 'festive' | 'bridal'): FabricType[] {
  return Object.entries(FABRIC_PROPERTIES)
    .filter(([_, props]) => props.occasion_weight === occasion)
    .map(([fabric, _]) => fabric as FabricType);
}

// Check fabric compatibility with design elements
export function isFabricCompatible(
  fabricType: FabricType, 
  designElement: string, 
  value: string
): { compatible: boolean; reason?: string } {
  const props = getFabricProperties(fabricType);
  
  switch (designElement) {
    case 'neckline':
      if (value === 'deep_round' && props.support === 'low') {
        return { 
          compatible: false, 
          reason: 'This fabric may not provide enough support for deep necklines' 
        };
      }
      break;
      
    case 'sleeve_length':
      if (value === 'full' && props.structure === 'stiff') {
        return { 
          compatible: false, 
          reason: 'Stiff fabrics may be uncomfortable in full sleeves' 
        };
      }
      break;
      
    case 'fit_looseness':
      if (value === 'fitted' && props.fall === 'rigid') {
        return { 
          compatible: false, 
          reason: 'Rigid fabrics work better with looser fits' 
        };
      }
      break;
  }
  
  return { compatible: true };
}