import { Injectable } from '@angular/core';
import { AppConfigurationClient } from '@azure/app-configuration';
import { Observable, from, catchError, of } from 'rxjs';

export interface ConfigItem {
  key: string;
  value: string;
  label?: string;
  contentType?: string;
  etag?: string;
  lastModified?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AzureAppConfigService {
  private client: AppConfigurationClient | null = null;
  private connectionString: string = '';

  constructor() { }

  /**
   * Initialize the Azure App Configuration client with connection string
   * @param connectionString Azure App Configuration connection string
   */
  initialize(connectionString: string): void {
    try {
      this.connectionString = connectionString;
      this.client = new AppConfigurationClient(connectionString);
    } catch (error) {
      console.error('Failed to initialize Azure App Configuration client:', error);
      throw error;
    }
  }

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean {
    return this.client !== null;
  }

  /**
   * Get all configuration settings
   */
  listConfigurations(labelFilter?: string): Observable<ConfigItem[]> {
    if (!this.client) {
      return of([]);
    }

    return from(
      (async () => {
        const configs: ConfigItem[] = [];
        const options = labelFilter ? { labelFilter } : {};
        
        for await (const setting of this.client!.listConfigurationSettings(options)) {
          configs.push({
            key: setting.key,
            value: setting.value || '',
            label: setting.label,
            contentType: setting.contentType,
            etag: setting.etag,
            lastModified: setting.lastModified
          });
        }
        return configs;
      })()
    ).pipe(
      catchError(error => {
        console.error('Error listing configurations:', error);
        return of([]);
      })
    );
  }

  /**
   * Get a specific configuration setting by key
   */
  getConfiguration(key: string, label?: string): Observable<ConfigItem | null> {
    if (!this.client) {
      return of(null);
    }

    return from(
      (async () => {
        const setting = await this.client!.getConfigurationSetting({ key, label });
        
        return {
          key: setting.key,
          value: setting.value || '',
          label: setting.label,
          contentType: setting.contentType,
          etag: setting.etag,
          lastModified: setting.lastModified
        };
      })()
    ).pipe(
      catchError(error => {
        console.error('Error getting configuration:', error);
        return of(null);
      })
    );
  }

  /**
   * Add or update a configuration setting
   */
  setConfiguration(key: string, value: string, label?: string, contentType?: string): Observable<ConfigItem | null> {
    if (!this.client) {
      return of(null);
    }

    return from(
      (async () => {
        const setting = await this.client!.setConfigurationSetting({
          key,
          value,
          label,
          contentType
        });
        
        return {
          key: setting.key,
          value: setting.value || '',
          label: setting.label,
          contentType: setting.contentType,
          etag: setting.etag,
          lastModified: setting.lastModified
        };
      })()
    ).pipe(
      catchError(error => {
        console.error('Error setting configuration:', error);
        return of(null);
      })
    );
  }

  /**
   * Delete a configuration setting
   */
  deleteConfiguration(key: string, label?: string): Observable<boolean> {
    if (!this.client) {
      return of(false);
    }

    return from(
      (async () => {
        await this.client!.deleteConfigurationSetting({ key, label });
        return true;
      })()
    ).pipe(
      catchError(error => {
        console.error('Error deleting configuration:', error);
        return of(false);
      })
    );
  }
}
