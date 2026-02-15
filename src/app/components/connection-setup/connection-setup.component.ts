import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AzureAppConfigService } from '../../services/azure-app-config.service';

@Component({
  selector: 'app-connection-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './connection-setup.component.html',
  styleUrl: './connection-setup.component.less'
})
export class ConnectionSetupComponent implements OnInit {
  connectionString = '';
  error: string | null = null;
  showConnectionString = false;
  autoConnecting = false;

  constructor(
    private azureConfigService: AzureAppConfigService,
    private router: Router
  ) {
    // Check if already initialized
    if (this.azureConfigService.isInitialized()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // Check for environment variable connection string
    this.checkEnvironmentConnectionString();
  }

  /**
   * Check for connection string from environment-like sources
   * Priority: localStorage > window object
   */
  private checkEnvironmentConnectionString(): void {
    let envConnectionString: string | null = null;

    // Check localStorage (could be set by deployment scripts or admin tools)
    envConnectionString = localStorage.getItem('AZURE_APP_CONFIG_CONNECTION_STRING');

    // Check window object (could be injected at build/deploy time)
    if (!envConnectionString && (window as any).AZURE_APP_CONFIG_CONNECTION_STRING) {
      envConnectionString = (window as any).AZURE_APP_CONFIG_CONNECTION_STRING;
    }

    // If found, auto-connect
    if (envConnectionString && envConnectionString.trim()) {
      this.connectionString = envConnectionString;
      this.autoConnecting = true;
      this.connect();
    }
  }

  toggleShowConnectionString(): void {
    this.showConnectionString = !this.showConnectionString;
  }

  connect(): void {
    if (!this.connectionString.trim()) {
      this.error = 'Please enter a connection string';
      return;
    }

    try {
      this.azureConfigService.initialize(this.connectionString);
      this.error = null;
      
      // Store in session storage for this session only (not persisted)
      sessionStorage.setItem('azureAppConfigConnected', 'true');
      
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = 'Failed to connect: ' + (err.message || 'Invalid connection string');
    }
  }
}
