import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AzureAppConfigService, ConfigItem } from '../../services/azure-app-config.service';

@Component({
  selector: 'app-config-editor',
  imports: [CommonModule, FormsModule, NgxJsonViewerModule],
  templateUrl: './config-editor.component.html',
  styleUrl: './config-editor.component.less'
})
export class ConfigEditorComponent implements OnInit {
  isEditMode = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  configKey = '';
  configValue = '';
  configLabel = '';
  configContentType = '';
  
  originalConfig: ConfigItem | null = null;
  parsedJson: any = null;
  isValidJson = false;

  constructor(
    private azureConfigService: AzureAppConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key');
    
    if (key) {
      this.isEditMode = true;
      this.configKey = key;
      this.loadConfiguration(key);
    } else {
      this.isEditMode = false;
    }
  }

  loadConfiguration(key: string): void {
    this.loading = true;
    this.error = null;

    this.azureConfigService.getConfiguration(key).subscribe({
      next: (config) => {
        if (config) {
          this.originalConfig = config;
          this.configKey = config.key;
          this.configValue = config.value;
          this.configLabel = config.label || '';
          this.configContentType = config.contentType || '';
          this.tryParseJson();
        } else {
          this.error = 'Configuration not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load configuration: ' + err.message;
        this.loading = false;
      }
    });
  }

  tryParseJson(): void {
    try {
      if (this.configValue.trim()) {
        this.parsedJson = JSON.parse(this.configValue);
        this.isValidJson = true;
      } else {
        this.parsedJson = null;
        this.isValidJson = false;
      }
    } catch (e) {
      this.parsedJson = null;
      this.isValidJson = false;
    }
  }

  onValueChange(): void {
    this.tryParseJson();
  }

  formatJson(): void {
    if (this.isValidJson && this.parsedJson) {
      this.configValue = JSON.stringify(this.parsedJson, null, 2);
    }
  }

  save(): void {
    if (!this.configKey.trim()) {
      this.error = 'Key is required';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.azureConfigService.setConfiguration(
      this.configKey,
      this.configValue,
      this.configLabel || undefined,
      this.configContentType || undefined
    ).subscribe({
      next: (config) => {
        if (config) {
          this.success = this.isEditMode ? 'Configuration updated successfully' : 'Configuration created successfully';
          this.loading = false;
          
          // Navigate back to list after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        } else {
          this.error = 'Failed to save configuration';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Failed to save configuration: ' + err.message;
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
