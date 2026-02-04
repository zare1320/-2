import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav.component';
import { VetStoreService } from './services/vet-store.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 pb-28 transition-colors" [dir]="dir()">
      <!-- Material 3 Top App Bar -->
      <header class="bg-surface-light dark:bg-surface-dark pt-6 pb-2 px-6 sticky top-0 z-40 transition-colors">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200">
            <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300">
               <i class="fa-solid fa-user-doctor text-lg"></i>
            </div>
            {{ store.t().app_title }}
          </h1>
          @if (store.isPremium()) {
            <div class="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/30">
              PRO
            </div>
          }
        </div>
      </header>

      <!-- Main Content -->
      <main class="px-4 pt-2 max-w-lg mx-auto">
        <router-outlet></router-outlet>
      </main>

      <!-- Navigation -->
      <app-nav></app-nav>

      <!-- Global Toast Notification -->
      @if (store.notification()) {
        <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90%] animate-fade-in-down">
           <div class="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border"
               [ngClass]="{
                 'bg-slate-800/95 border-slate-700 text-white': true
               }"
           >
              <!-- Icon based on type -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  [ngClass]="{
                    'bg-green-500/20 text-green-400': store.notification()?.type === 'success',
                    'bg-red-500/20 text-red-400': store.notification()?.type === 'error',
                    'bg-blue-500/20 text-blue-400': store.notification()?.type === 'info'
                  }"
              >
                  @if(store.notification()?.type === 'success') { <i class="fa-solid fa-check"></i> }
                  @if(store.notification()?.type === 'error') { <i class="fa-solid fa-triangle-exclamation"></i> }
                  @if(store.notification()?.type === 'info') { <i class="fa-solid fa-info"></i> }
              </div>

              <span class="text-sm font-bold">{{ store.notification()?.message }}</span>
           </div>
        </div>
      }
    </div>
  `,
  imports: [RouterOutlet, NavComponent, NgClass]
})
export class AppComponent {
  store = inject(VetStoreService);
  dir = computed(() => this.store.currentLanguage() === 'fa' ? 'rtl' : 'ltr');
}