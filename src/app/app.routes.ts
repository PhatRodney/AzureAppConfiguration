import { Routes } from '@angular/router';
import { ConnectionSetupComponent } from './components/connection-setup/connection-setup.component';
import { ConfigListComponent } from './components/config-list/config-list.component';
import { ConfigEditorComponent } from './components/config-editor/config-editor.component';

export const routes: Routes = [
  { path: '', component: ConfigListComponent },
  { path: 'setup', component: ConnectionSetupComponent },
  { path: 'create', component: ConfigEditorComponent },
  { path: 'edit/:key', component: ConfigEditorComponent },
  { path: '**', redirectTo: '' }
];
