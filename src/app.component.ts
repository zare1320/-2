import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav.component';
import { VetStoreService } from './services/vet-store.service';

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
    </div>
  `,
  imports: [RouterOutlet, NavComponent]
})
export class AppComponent {
  store = inject(VetStoreService);
  dir = computed(() => this.store.currentLanguage() === 'fa' ? 'rtl' : 'ltr');
}