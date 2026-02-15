import { Injectable } from '@angular/core';

/**
 * Service to maintain state for configuration values across component instances
 * Used to auto-fill fields when creating new configurations
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigStateService {
  private lastAddedKey: string = '';
  private lastAddedLabel: string = '';
  private lastAddedValue: string = '';

  constructor() { }

  /**
   * Save the last added configuration values
   */
  saveLastAdded(key: string, label: string, value: string): void {
    this.lastAddedKey = key;
    this.lastAddedLabel = label;
    this.lastAddedValue = value;
  }

  /**
   * Get the last added configuration values
   */
  getLastAdded(): { key: string; label: string; value: string } {
    return {
      key: this.lastAddedKey,
      label: this.lastAddedLabel,
      value: this.lastAddedValue
    };
  }

  /**
   * Clear the last added configuration values
   */
  clearLastAdded(): void {
    this.lastAddedKey = '';
    this.lastAddedLabel = '';
    this.lastAddedValue = '';
  }
}
