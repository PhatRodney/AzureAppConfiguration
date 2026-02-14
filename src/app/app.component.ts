import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AzureAppConfigService } from './services/azure-app-config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  title = 'AppConfig';

  constructor(
    private azureConfigService: AzureAppConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we need to show setup page
    const isConnected = sessionStorage.getItem('azureAppConfigConnected');
    
    if (!this.azureConfigService.isInitialized() && !isConnected) {
      this.router.navigate(['/setup']);
    }
  }
}
