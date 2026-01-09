/**
 * PERSISTENT BODY STATE SYSTEM
 * Ensures body continuity across all garment changes
 * CRITICAL: Body NEVER regenerates - only parametric adjustments allowed
 */

export interface BodyPose {
  angle: number;
  stance: 'front' | 'side' | 'back';
  armPosition: 'down' | 'neutral' | 'up';
}

export interface LightingState {
  direction: 'front' | 'top' | 'side';
  intensity: number;
  temperature: 'warm' | 'neutral' | 'cool';
}

export interface BodyProportions {
  bust: number;    // 0.8 - 1.2 (relative to base)
  waist: number;   // 0.8 - 1.2
  hip: number;     // 0.8 - 1.2
  shoulder: number; // 0.8 - 1.2
}

export interface PersistentBodyState {
  id: string;
  base_image: string; // Original captured image - IMMUTABLE
  pose: BodyPose; // LOCKED - cannot change
  lighting: LightingState; // LOCKED - cannot change
  proportions: BodyProportions; // ADJUSTABLE via sliders only
  locked: true; // Always true - prevents regeneration
  created_at: Date;
  last_modified: Date;
}

export class PersistentBodyManager {
  private static instance: PersistentBodyManager;
  private bodyState: PersistentBodyState | null = null;

  private constructor() {}

  static getInstance(): PersistentBodyManager {
    if (!PersistentBodyManager.instance) {
      PersistentBodyManager.instance = new PersistentBodyManager();
    }
    return PersistentBodyManager.instance;
  }

  /**
   * Initialize body state from captured image
   * Can only be called ONCE per session
   */
  initializeBody(
    baseImage: string,
    pose: BodyPose,
    lighting: LightingState,
    initialProportions: BodyProportions
  ): PersistentBodyState {
    if (this.bodyState) {
      throw new Error('BODY STATE ALREADY INITIALIZED - Cannot reinitialize');
    }

    this.bodyState = {
      id: `body_${Date.now()}`,
      base_image: baseImage,
      pose: pose,
      lighting: lighting,
      proportions: initialProportions,
      locked: true,
      created_at: new Date(),
      last_modified: new Date()
    };

    console.log('✅ PERSISTENT BODY INITIALIZED:', this.bodyState.id);
    return this.bodyState;
  }

  /**
   * Get current body state
   * Returns null if not initialized
   */
  getBodyState(): PersistentBodyState | null {
    return this.bodyState;
  }

  /**
   * Update ONLY proportions via parametric adjustments
   * Pose, lighting, and base image remain LOCKED
   */
  updateProportions(newProportions: Partial<BodyProportions>): PersistentBodyState {
    if (!this.bodyState) {
      throw new Error('BODY STATE NOT INITIALIZED');
    }

    // Verify proportions are within valid range
    const validatedProportions = this.validateProportions({
      ...this.bodyState.proportions,
      ...newProportions
    });

    this.bodyState = {
      ...this.bodyState,
      proportions: validatedProportions,
      last_modified: new Date()
    };

    console.log('✅ PROPORTIONS UPDATED:', validatedProportions);
    return this.bodyState;
  }

  /**
   * Verify body continuity
   * Ensures pose, lighting, and base image haven't changed
   */
  verifyBodyContinuity(state: PersistentBodyState): boolean {
    if (!this.bodyState) return false;

    const continuityCheck = 
      state.base_image === this.bodyState.base_image &&
      state.pose.angle === this.bodyState.pose.angle &&
      state.pose.stance === this.bodyState.pose.stance &&
      state.lighting.direction === this.bodyState.lighting.direction &&
      state.locked === true;

    if (!continuityCheck) {
      console.error('❌ BODY CONTINUITY VIOLATED');
      console.error('Expected:', this.bodyState);
      console.error('Received:', state);
    }

    return continuityCheck;
  }

  /**
   * Validate proportions are within acceptable range
   */
  private validateProportions(proportions: BodyProportions): BodyProportions {
    const clamp = (value: number, min: number, max: number) => 
      Math.max(min, Math.min(max, value));

    return {
      bust: clamp(proportions.bust, 0.8, 1.2),
      waist: clamp(proportions.waist, 0.8, 1.2),
      hip: clamp(proportions.hip, 0.8, 1.2),
      shoulder: clamp(proportions.shoulder, 0.8, 1.2)
    };
  }

  /**
   * Reset body state (for new session only)
   */
  reset(): void {
    console.log('⚠️ RESETTING BODY STATE');
    this.bodyState = null;
  }

  /**
   * FORBIDDEN: Attempt to regenerate body
   * This should never be called
   */
  regenerateBody(): never {
    throw new Error('❌ FORBIDDEN: Body regeneration is not allowed. Body state is PERSISTENT.');
  }
}

// Export singleton instance
export const persistentBody = PersistentBodyManager.getInstance();
