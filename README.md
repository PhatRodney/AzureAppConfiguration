# AppConfig - Azure App Configuration Manager

This project is an Angular 19 application that provides a user-friendly interface to manage Azure App Configuration settings with full CRUD (Create, Read, Update, Delete) functionality.

## Features

- ✅ **Connection Setup**: Secure connection to Azure App Configuration using connection strings
- ✅ **List View**: Display all configuration settings in a clean, organized table
- ✅ **Create**: Add new configuration key-value pairs
- ✅ **Read**: View detailed configuration information
- ✅ **Update**: Edit existing configurations
- ✅ **Delete**: Remove configurations with confirmation
- ✅ **JSON Support**: Built-in JSON viewer and validator for JSON-formatted values
- ✅ **JSON Formatting**: Automatically format JSON values with proper indentation
- ✅ **Modern UI**: Clean, responsive interface with Material Design-inspired styling

## Technologies Used

- **Angular 19.2** - Latest version of Angular framework
- **@azure/app-configuration** - Official Microsoft Azure App Configuration SDK
- **ngx-json-viewer** - JSON viewer component for displaying JSON data
- **TypeScript 5.7** - Type-safe JavaScript
- **RxJS 7.8** - Reactive programming library
- **LESS** - CSS preprocessor

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- An Azure App Configuration resource

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AppConfig
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Getting Your Azure App Configuration Connection String

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Configuration resource
3. Select "Access Keys" from the left menu
4. Copy either the Primary or Secondary connection string

The connection string format looks like:
```
Endpoint=https://your-app-config.azconfig.io;Id=xxx;Secret=xxx
```

## Usage

### Development Server

Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser.

### First Time Setup

1. When you first launch the application, you'll be presented with a connection setup screen
2. Enter your Azure App Configuration connection string
3. Click "Connect"
4. You'll be redirected to the main configuration list

**Auto-Connection**: The application supports automatic connection via environment-like configuration:
- Set `AZURE_APP_CONFIG_CONNECTION_STRING` in localStorage to auto-connect on startup
- Example: `localStorage.setItem('AZURE_APP_CONFIG_CONNECTION_STRING', 'your-connection-string')`
- This is useful for automated deployments or testing environments

**Security Note**: Connection strings are stored only in memory for the current session. They are not persisted to disk or browser storage for security reasons.

### Managing Configurations

#### Viewing Configurations
- The main page displays all configurations in a table format
- Each row shows: Key, Value (truncated), Label, Content Type, and Last Modified date
- Click on any row to view and edit the configuration

#### Creating a New Configuration
1. Click the "Create New" button
2. Enter the configuration details:
   - **Key** (required): Unique identifier for the configuration
   - **Label** (optional): Use for environment-specific configs (e.g., "Production", "Development")
   - **Content Type** (optional): Specify the content type (e.g., "application/json")
   - **Value** (required): The configuration value
3. **Auto-Fill Feature**: When creating multiple configurations, the form automatically pre-fills with values from your last created configuration to speed up data entry
4. If entering JSON, the editor will validate and show a preview
5. Use "Format JSON" button to auto-format JSON values
6. Click "Create" to save

#### Editing a Configuration
1. Click on a configuration row in the list
2. Modify the value, label, or content type (key cannot be changed)
3. Click "Update" to save changes
4. Click "Cancel" to discard changes

#### Deleting a Configuration
1. Click the delete button (🗑) on a configuration row
2. Confirm the deletion in the popup dialog
3. The configuration will be permanently removed

### JSON Features

The application includes advanced JSON handling:
- **Automatic Validation**: Detects if a value is valid JSON
- **JSON Viewer**: Displays JSON in an expandable tree view
- **Format JSON**: Click to automatically format and indent JSON
- **Syntax Highlighting**: Color-coded JSON display

## Building

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/app-config` directory.

## Running Tests

To execute unit tests via [Karma](https://karma-runner.github.io):

```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── connection-setup/    # Initial connection setup
│   │   ├── config-list/         # List all configurations
│   │   └── config-editor/       # Create/Edit configuration
│   ├── services/
│   │   └── azure-app-config.service.ts  # Azure SDK integration
│   ├── app.component.*          # Root component
│   ├── app.config.ts            # App configuration
│   └── app.routes.ts            # Route definitions
├── styles.less                  # Global styles
└── index.html                   # Entry HTML
```

## API Documentation

### AzureAppConfigService

The main service for interacting with Azure App Configuration.

**Methods:**

- `initialize(connectionString: string): void` - Initialize connection to Azure
- `isInitialized(): boolean` - Check if service is connected
- `listConfigurations(labelFilter?: string): Observable<ConfigItem[]>` - Get all configurations
- `getConfiguration(key: string, label?: string): Observable<ConfigItem | null>` - Get a specific configuration
- `setConfiguration(key: string, value: string, label?: string, contentType?: string): Observable<ConfigItem | null>` - Create or update a configuration
- `deleteConfiguration(key: string, label?: string): Observable<boolean>` - Delete a configuration

## Security Considerations

1. **Connection Strings**: Never commit connection strings to source control
2. **Session Storage**: Connection strings are stored only in memory during the session
3. **CORS**: Azure App Configuration SDK may require CORS configuration in production
4. **Authentication**: This app uses connection string authentication; consider using Azure AD for production

## Known Limitations

1. **Browser-Side SDK**: The Azure App Configuration SDK is primarily designed for server-side use. CORS restrictions may apply when accessing from a browser.
2. **Authentication**: Currently uses connection string authentication. For production use, consider implementing Azure AD authentication with proper access controls.
3. **Concurrent Edits**: No conflict resolution for simultaneous edits by multiple users

## Future Enhancements

- [ ] Azure AD authentication support
- [ ] Feature flags management
- [ ] Configuration history and rollback
- [ ] Bulk import/export
- [ ] Search and filter functionality
- [ ] Label-based filtering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Additional Resources

- [Azure App Configuration Documentation](https://docs.microsoft.com/azure/azure-app-configuration/)
- [Angular Documentation](https://angular.dev)
- [Azure App Configuration SDK](https://www.npmjs.com/package/@azure/app-configuration)
- [ngx-json-viewer](https://www.npmjs.com/package/ngx-json-viewer)
