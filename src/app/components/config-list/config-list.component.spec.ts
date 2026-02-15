import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigListComponent } from './config-list.component';
import { AzureAppConfigService, ConfigItem } from '../../services/azure-app-config.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ConfigListComponent', () => {
  let component: ConfigListComponent;
  let fixture: ComponentFixture<ConfigListComponent>;
  let mockAzureConfigService: jasmine.SpyObj<AzureAppConfigService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockConfigurations: ConfigItem[] = [
    { key: 'CwmWebApi:ConnectionString', value: 'test1', label: 'dev' },
    { key: 'CwmWebApi:ApiKey', value: 'test2', label: 'prod' },
    { key: 'Database:Host', value: 'localhost', label: 'dev' },
    { key: 'Database:Port', value: '5432', label: 'dev' },
    { key: 'AppSettings:Theme', value: 'dark', label: undefined },
  ];

  beforeEach(async () => {
    mockAzureConfigService = jasmine.createSpyObj('AzureAppConfigService', [
      'isInitialized',
      'listConfigurations',
      'deleteConfiguration'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ConfigListComponent],
      providers: [
        { provide: AzureAppConfigService, useValue: mockAzureConfigService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Filter functionality', () => {
    beforeEach(() => {
      mockAzureConfigService.isInitialized.and.returnValue(true);
      mockAzureConfigService.listConfigurations.and.returnValue(of(mockConfigurations));
    });

    it('should show all configurations when filter is empty', () => {
      component.ngOnInit();
      expect(component.filteredConfigurations.length).toBe(5);
    });

    it('should filter configurations with wildcard prefix pattern "CwmWebApi:*"', () => {
      component.ngOnInit();
      component.filterText = 'CwmWebApi:*';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(2);
      expect(component.filteredConfigurations.every(c => c.key.startsWith('CwmWebApi:'))).toBe(true);
    });

    it('should filter configurations with wildcard suffix pattern "*:Host"', () => {
      component.ngOnInit();
      component.filterText = '*:Host';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(1);
      expect(component.filteredConfigurations[0].key).toBe('Database:Host');
    });

    it('should filter configurations with wildcard in middle pattern "Database:*"', () => {
      component.ngOnInit();
      component.filterText = 'Database:*';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(2);
      expect(component.filteredConfigurations.every(c => c.key.startsWith('Database:'))).toBe(true);
    });

    it('should be case insensitive', () => {
      component.ngOnInit();
      component.filterText = 'cwmwebapi:*';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(2);
    });

    it('should filter exact match without wildcard', () => {
      component.ngOnInit();
      component.filterText = 'Database:Host';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(1);
      expect(component.filteredConfigurations[0].key).toBe('Database:Host');
    });

    it('should return no results when filter does not match any configuration', () => {
      component.ngOnInit();
      component.filterText = 'NonExistent:*';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(0);
    });

    it('should clear filter when clearFilter is called', () => {
      component.ngOnInit();
      component.filterText = 'CwmWebApi:*';
      component.applyFilter();
      expect(component.filteredConfigurations.length).toBe(2);
      
      component.clearFilter();
      expect(component.filterText).toBe('');
      expect(component.filteredConfigurations.length).toBe(5);
    });

    it('should call applyFilter when onFilterChange is called', () => {
      spyOn(component, 'applyFilter');
      component.onFilterChange();
      expect(component.applyFilter).toHaveBeenCalled();
    });

    it('should escape special regex characters', () => {
      component.configurations = [
        { key: 'App.Settings', value: 'test', label: undefined },
        { key: 'AppXSettings', value: 'test', label: undefined }
      ];
      component.filterText = 'App.Settings';
      component.applyFilter();
      
      // Should match exactly "App.Settings" and not treat . as wildcard
      expect(component.filteredConfigurations.length).toBe(1);
      expect(component.filteredConfigurations[0].key).toBe('App.Settings');
    });

    it('should support multiple wildcards', () => {
      component.configurations = [
        { key: 'CwmWebApi:Database:Connection', value: 'test', label: undefined },
        { key: 'CwmWebApi:Cache:Connection', value: 'test', label: undefined },
        { key: 'OtherApi:Database:Connection', value: 'test', label: undefined }
      ];
      component.filterText = 'CwmWebApi:*:Connection';
      component.applyFilter();
      
      expect(component.filteredConfigurations.length).toBe(2);
      expect(component.filteredConfigurations.every(c => 
        c.key.startsWith('CwmWebApi:') && c.key.endsWith(':Connection')
      )).toBe(true);
    });
  });

  describe('Load configurations', () => {
    it('should load configurations on init when service is initialized', () => {
      mockAzureConfigService.isInitialized.and.returnValue(true);
      mockAzureConfigService.listConfigurations.and.returnValue(of(mockConfigurations));

      component.ngOnInit();

      expect(mockAzureConfigService.listConfigurations).toHaveBeenCalled();
      expect(component.configurations.length).toBe(5);
      expect(component.filteredConfigurations.length).toBe(5);
    });

    it('should show error when service is not initialized', () => {
      mockAzureConfigService.isInitialized.and.returnValue(false);

      component.ngOnInit();

      expect(component.error).toContain('not initialized');
      expect(mockAzureConfigService.listConfigurations).not.toHaveBeenCalled();
    });
  });
});
