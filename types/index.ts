// Core body type definitions
export interface BodyRatios {
  shoulder_ratio: number;
  waist_ratio: number;
  hip_ratio: number;
  vertical_balance: number;
}

export type BodyShape = 'pear' | 'apple' | 'rectangle' | 'hourglass';

export interface BodyType {
  shape: BodyShape;
  ratios: BodyRatios;
  source: 'image' | 'manual';
  captured_image?: string; // Base64 JPEG image
  image_validated?: boolean;
}

// Skin undertone definitions
export type SkinUndertone = 'warm' | 'cool' | 'neutral';

export interface UndertoneAnalysis {
  undertone: SkinUndertone;
  confidence: number;
  source: 'detected' | 'manual';
  recommended_colors: string[];
}

// Fabric definitions
export type FabricType = 
  | 'cotton' 
  | 'silk' 
  | 'georgette' 
  | 'chiffon' 
  | 'linen' 
  | 'satin' 
  | 'velvet' 
  | 'organza' 
  | 'brocade' 
  | 'custom';

export interface FabricProperties {
  structure: 'soft' | 'medium' | 'stiff';
  fall: 'fluid' | 'semi-fluid' | 'rigid';
  support: 'low' | 'medium' | 'high';
  occasion_weight: 'daily' | 'festive' | 'bridal';
}

// Indian outfit types
export type OutfitType = 
  | 'saree_blouse'
  | 'salwar_kameez' 
  | 'lehenga_choli'
  | 'sharara_suit'
  | 'gharara_suit'
  | 'anarkali_suit'
  | 'palazzo_suit'
  | 'half_saree'
  | 'kurti_palazzo'
  | 'kurti_leggings'
  | 'indo_western';

// Comprehensive design definitions for all outfit types
export interface OutfitDesign {
  outfit_type: OutfitType;
  top_design: TopDesign;
  bottom_design?: BottomDesign;
  dupatta_design?: DupattaDesign;
  saree_design?: SareeDesign;
  color_scheme: ColorScheme;
  embellishments: EmbellishmentPattern[];
}

export interface TopDesign {
  neckline: NecklineType;
  sleeve_length: SleeveLength;
  sleeve_style: SleeveStyle;
  back_design: BackDesign;
  length: TopLength;
  fit: FitStyle;
  closure: ClosureType;
}

export interface BottomDesign {
  style: BottomStyle;
  length: BottomLength;
  fit: FitStyle;
  waist_style: WaistStyle;
}

export interface DupattaDesign {
  style: DupattaStyle;
  draping: DrapingStyle;
  border: BorderStyle;
  length: DupattaLength;
}

export interface SareeDesign {
  draping_style: SareeDrapingStyle;
  pleating_pattern: PleatingPattern;
  pallu_style: PalluStyle;
  border_design: BorderStyle;
}

export interface ColorScheme {
  primary_color: string;
  secondary_color?: string;
  accent_color?: string;
  undertone_match: boolean;
}

// Detailed design options
export type NecklineType = 
  | 'round' | 'boat' | 'deep_round' | 'square' | 'sweetheart' | 'halter'
  | 'v_neck' | 'scoop' | 'high_neck' | 'off_shoulder' | 'one_shoulder'
  | 'keyhole' | 'chinese_collar' | 'mandarin_collar';

export type SleeveStyle = 
  | 'regular' | 'bell' | 'flared' | 'fitted' | 'bishop' | 'puff'
  | 'cold_shoulder' | 'cape' | 'butterfly' | 'trumpet';

export type BackDesign = 
  | 'closed' | 'keyhole' | 'deep_back' | 'criss_cross' | 'tie_up'
  | 'button_closure' | 'zip_closure' | 'backless' | 'cut_out';

export type TopLength = 'crop' | 'waist' | 'hip' | 'knee' | 'midi' | 'maxi';

export type BottomStyle = 
  | 'straight' | 'palazzo' | 'sharara' | 'gharara' | 'churidar'
  | 'salwar' | 'dhoti' | 'leggings' | 'cigarette' | 'flared';

export type DrapingStyle = 
  | 'gujarati' | 'bengali' | 'maharashtrian' | 'south_indian'
  | 'butterfly' | 'lehenga_style' | 'cape_style';

export type PleatingPattern = 
  | 'box_pleats' | 'knife_pleats' | 'accordion' | 'fan_pleats'
  | 'inverted_pleats' | 'side_pleats';

export type SareeDrapingStyle = 
  | 'nivi' | 'gujarati' | 'bengali' | 'maharashtrian' | 'kerala'
  | 'tamil' | 'butterfly' | 'lehenga' | 'pant_style';

export interface EmbellishmentPattern {
  type: 'embroidery' | 'sequins' | 'beads' | 'mirror_work' | 'zardozi' | 'thread_work';
  placement: 'neckline' | 'sleeves' | 'hem' | 'yoke' | 'all_over' | 'border';
  intensity: 'minimal' | 'moderate' | 'heavy';
}

// Digital twin coordinates
export interface DigitalTwinCoords {
  height: number;
  shoulders: { x: number; y: number; width: number };
  bust: { x: number; y: number; width: number };
  waist: { x: number; y: number; width: number };
  hips: { x: number; y: number; width: number };
}

// Recommendation system
export interface StyleRecommendation {
  outfit: OutfitDesign;
  reasoning: string;
  accessories: string[];
  makeup: string;
  avoid: string[];
  tailor_notes: string[];
  measurements: DetailedMeasurements;
  color_recommendations: string[];
  undertone_advice: string;
}

// User session
export interface UserSession {
  id: string;
  body_type?: BodyType;
  measurements?: DetailedMeasurements;
  undertone_analysis?: UndertoneAnalysis;
  fabric_selection?: FabricType;
  custom_fabric?: string;
  outfit_design?: OutfitDesign;
  digital_twin_coords?: DigitalTwinCoords;
  recommendations?: StyleRecommendation;
  inspirations: string[]; // Saved designs
  manual_design_slot?: OutfitDesign; // User's custom design
  created_at: Date;
  updated_at: Date;
}

// Export formats
export interface TailorExport {
  design_sketch: string; // Base64 image
  style_annotations: string[];
  fabric_notes: string[];
  fit_intent: string;
  format: 'pdf' | 'image' | 'whatsapp';
}
// Additional type definitions
export type SleeveLength = 'sleeveless' | 'cap' | 'short' | 'elbow' | 'three_quarter' | 'full';
export type FitStyle = 'fitted' | 'regular' | 'loose' | 'oversized';
export type ClosureType = 'buttons' | 'zip' | 'tie' | 'hook' | 'overlap';
export type BottomLength = 'mini' | 'knee' | 'midi' | 'maxi' | 'floor';
export type WaistStyle = 'high' | 'mid' | 'low' | 'empire';
export type DupattaStyle = 'net' | 'chiffon' | 'silk' | 'cotton' | 'georgette';
export type DupattaLength = 'short' | 'medium' | 'long' | 'extra_long';
export type BorderStyle = 'plain' | 'embroidered' | 'lace' | 'sequined' | 'printed';
export type PalluStyle = 'plain' | 'heavy_work' | 'printed' | 'contrast' | 'matching';

// Measurements for tailoring
export interface DetailedMeasurements {
  // PRIMARY MEASUREMENTS (CRITICAL)
  bust: number;
  waist: number;
  hip: number;
  shoulder_width: number;
  height: number;
  
  // SECONDARY MEASUREMENTS (OPTIONAL)
  under_bust?: number;
  arm_length?: number;
  armhole?: number;
  neck_circumference?: number;
  
  // GARMENT LENGTHS (OPTIONAL)
  top_length?: number;
  sleeve_length?: number;
  bottom_length?: number;
  blouse_length?: number;
  skirt_length?: number;
  
  // ADDITIONAL MEASUREMENTS (OPTIONAL)
  back_width?: number;
  front_depth?: number;
  side_seam?: number;
  
  // For specific outfits
  saree_blouse_length?: number;
  lehenga_skirt_length?: number;
  dupatta_length?: number;
}