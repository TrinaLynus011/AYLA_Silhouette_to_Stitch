/**
 * CHANGE ISOLATION MANAGER
 * Ensures only the specified parameter changes
 * All other parameters remain pixel-consistent
 */

export type ParameterType = 
  | 'neckline'
  | 'sleeve_length'
  | 'sleeve_style'
  | 'color'
  | 'embellishment'
  | 'border'
  | 'fit'
  | 'length'
  | 'body_bust'
  | 'body_waist'
  | 'body_hip'
  | 'body_shoulder';

export interface DesignState {
  neckline: string;
  sleeve_length: string;
  sleeve_style: string;
  color: string;
  embellishment: any[];
  border: string;
  fit: string;
  length: string;
  body_proportions: {
    bust: number;
    waist: number;
    hip: number;
    shoulder: number;
  };
}

export interface ChangeRecord {
  parameter: ParameterType;
  old_value: any;
  new_value: any;
  timestamp: Date;
  verified: boolean;
}

export class ChangeIsolationManager {
  private static instance: ChangeIsolationManager;
  private currentState: DesignState | null = null;
  private lockedParameters: Set<ParameterType> = new Set();
  private changeHistory: ChangeRecord[] = [];

  private constructor() {}

  static getInstance(): ChangeIsolationManager {
    if (!ChangeIsolationManager.instance) {
      ChangeIsolationManager.instance = new ChangeIsolationManager();
    }
    return ChangeIsolationManager.instance;
  }

  /**
   * Initialize state tracking
   */
  initializeState(initialState: DesignState): void {
    this.currentState = { ...initialState };
    console.log('✅ CHANGE ISOLATION INITIALIZED');
  }

  /**
   * Update a single parameter with isolation enforcement
   */
  updateParameter<K extends ParameterType>(
    parameter: K,
    newValue: any
  ): { success: boolean; state: DesignState | null; error?: string } {
    if (!this.currentState) {
      return { 
        success: false, 
        state: null, 
        error: 'State not initialized' 
      };
    }

    // Step 1: Lock all other parameters
    this.lockAllExcept(parameter);

    // Step 2: Store old value
    const oldValue = this.getParameterValue(parameter);

    // Step 3: Apply change
    const newState = this.applyParameterChange(parameter, newValue);

    // Step 4: Verify isolation
    const isolationVerified = this.verifyIsolation(parameter, this.currentState, newState);

    if (!isolationVerified) {
      console.error('❌ CHANGE ISOLATION VIOLATED');
      console.error(`Expected only ${parameter} to change`);
      console.error('Before:', this.currentState);
      console.error('After:', newState);
      
      // Rollback
      return {
        success: false,
        state: this.currentState,
        error: `Change isolation violated: Multiple parameters changed when only ${parameter} should change`
      };
    }

    // Step 5: Commit change
    this.currentState = newState;
    this.recordChange(parameter, oldValue, newValue, true);
    this.unlockAll();

    console.log(`✅ ISOLATED CHANGE: ${parameter} = ${newValue}`);
    return { success: true, state: this.currentState };
  }

  /**
   * Lock all parameters except the one being changed
   */
  private lockAllExcept(parameter: ParameterType): void {
    const allParameters: ParameterType[] = [
      'neckline', 'sleeve_length', 'sleeve_style', 'color',
      'embellishment', 'border', 'fit', 'length',
      'body_bust', 'body_waist', 'body_hip', 'body_shoulder'
    ];

    this.lockedParameters.clear();
    allParameters.forEach(param => {
      if (param !== parameter) {
        this.lockedParameters.add(param);
      }
    });

    console.log(`🔒 LOCKED: ${Array.from(this.lockedParameters).join(', ')}`);
  }

  /**
   * Unlock all parameters
   */
  private unlockAll(): void {
    this.lockedParameters.clear();
    console.log('🔓 ALL UNLOCKED');
  }

  /**
   * Apply parameter change to state
   */
  private applyParameterChange(parameter: ParameterType, newValue: any): DesignState {
    if (!this.currentState) {
      throw new Error('State not initialized');
    }

    const newState = { ...this.currentState };

    // Apply change based on parameter type
    if (parameter.startsWith('body_')) {
      const bodyParam = parameter.replace('body_', '') as keyof typeof newState.body_proportions;
      newState.body_proportions = {
        ...newState.body_proportions,
        [bodyParam]: newValue
      };
    } else {
      (newState as any)[parameter] = newValue;
    }

    return newState;
  }

  /**
   * Get current value of a parameter
   */
  private getParameterValue(parameter: ParameterType): any {
    if (!this.currentState) return null;

    if (parameter.startsWith('body_')) {
      const bodyParam = parameter.replace('body_', '') as keyof typeof this.currentState.body_proportions;
      return this.currentState.body_proportions[bodyParam];
    }

    return (this.currentState as any)[parameter];
  }

  /**
   * Verify that ONLY the specified parameter changed
   */
  private verifyIsolation(
    changedParameter: ParameterType,
    beforeState: DesignState,
    afterState: DesignState
  ): boolean {
    const changes: string[] = [];

    // Check all parameters
    const allParameters: ParameterType[] = [
      'neckline', 'sleeve_length', 'sleeve_style', 'color',
      'embellishment', 'border', 'fit', 'length',
      'body_bust', 'body_waist', 'body_hip', 'body_shoulder'
    ];

    allParameters.forEach(param => {
      const beforeValue = this.getParameterValueFromState(param, beforeState);
      const afterValue = this.getParameterValueFromState(param, afterState);

      if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
        changes.push(param);
      }
    });

    // Should have exactly 1 change, and it should be the expected parameter
    const isIsolated = changes.length === 1 && changes[0] === changedParameter;

    if (!isIsolated) {
      console.error(`❌ ISOLATION FAILED: Expected [${changedParameter}], got [${changes.join(', ')}]`);
    }

    return isIsolated;
  }

  /**
   * Get parameter value from a specific state
   */
  private getParameterValueFromState(parameter: ParameterType, state: DesignState): any {
    if (parameter.startsWith('body_')) {
      const bodyParam = parameter.replace('body_', '') as keyof typeof state.body_proportions;
      return state.body_proportions[bodyParam];
    }
    return (state as any)[parameter];
  }

  /**
   * Record change in history
   */
  private recordChange(
    parameter: ParameterType,
    oldValue: any,
    newValue: any,
    verified: boolean
  ): void {
    this.changeHistory.push({
      parameter,
      old_value: oldValue,
      new_value: newValue,
      timestamp: new Date(),
      verified
    });

    // Keep only last 50 changes
    if (this.changeHistory.length > 50) {
      this.changeHistory.shift();
    }
  }

  /**
   * Get change history
   */
  getChangeHistory(): ChangeRecord[] {
    return [...this.changeHistory];
  }

  /**
   * Get current state
   */
  getCurrentState(): DesignState | null {
    return this.currentState ? { ...this.currentState } : null;
  }

  /**
   * Reset manager
   */
  reset(): void {
    this.currentState = null;
    this.lockedParameters.clear();
    this.changeHistory = [];
    console.log('⚠️ CHANGE ISOLATION RESET');
  }
}

// Export singleton instance
export const changeIsolation = ChangeIsolationManager.getInstance();
