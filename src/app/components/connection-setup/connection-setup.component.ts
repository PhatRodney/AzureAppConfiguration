import { Component } from '@angular/core';
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
export class ConnectionSetupComponent {
  connectionString = '';
  error: string | null = null;
  showConnectionString = false;

  constructor(
    private azureConfigService: AzureAppConfigService,
    private router: Router
  ) {
    // Check if already initialized
    if (this.azureConfigService.isInitialized()) {
      this.router.navigate(['/']);
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

  useDemo(): void {
    // For demo purposes, show a message
    this.error = 'Demo mode: Please enter your Azure App Configuration connection string to proceed.';
  }
}
