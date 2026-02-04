import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { HomeComponent } from './src/pages/home.component';
import { ProtocolsComponent } from './src/pages/protocols.component';
import { CalculatorsComponent } from './src/pages/calculators.component';
import { ProfileComponent } from './src/pages/profile.component';
import { SettingsComponent } from './src/pages/settings.component';
import { LoginComponent } from './src/pages/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'protocols', component: ProtocolsComponent },
  { path: 'calculators', component: CalculatorsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient()
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
