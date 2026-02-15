import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AzureAppConfigService, ConfigItem } from '../../services/azure-app-config.service';

@Component({
  selector: 'app-config-list',
  imports: [CommonModule],
  templateUrl: './config-list.component.html',
  styleUrl: './config-list.component.less'
})
export class ConfigListComponent implements OnInit {
  configurations: ConfigItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private azureConfigService: AzureAppConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations(): void {
    if (!this.azureConfigService.isInitialized()) {
      this.error = 'Azure App Configuration service is not initialized. Please configure connection string first.';
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.azureConfigService.listConfigurations().subscribe({
      next: (configs) => {
        this.configurations = configs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load configurations: ' + err.message;
        this.loading = false;
      }
    });
  }

  viewConfig(config: ConfigItem): void {
    const queryParams: Record<string, string> = {};
    // Only add label to query params if it exists (including empty string)
    // Don't add it if undefined to distinguish between "no label" and "empty label"
    if (config.label !== undefined) {
      queryParams['label'] = config.label;
    }
    
    this.router.navigate(['/edit', config.key], { 
      queryParams,
      state: { config } 
    });
  }

  createNew(): void {
    this.router.navigate(['/create']);
  }

  deleteConfig(config: ConfigItem, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete configuration key "${config.key}"?`)) {
      return;
    }

    this.loading = true;
    this.azureConfigService.deleteConfiguration(config.key, config.label).subscribe({
      next: (success) => {
        if (success) {
          this.loadConfigurations();
        } else {
          this.error = 'Failed to delete configuration';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Failed to delete configuration: ' + err.message;
        this.loading = false;
      }
    });
  }

  refresh(): void {
    this.loadConfigurations();
  }
}
