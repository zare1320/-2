import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { VetStoreService } from '../services/vet-store.service';

@Component({
  selector: 'app-nav',
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-surface-variant/80 dark:bg-surface-darkVariant/90 backdrop-blur-md border-t border-white/10 shadow-lg pb-safe z-50 h-20 rounded-t-3xl">
      <div class="flex justify-evenly items-center h-full max-w-lg mx-auto px-2">
        
        <!-- Home -->
        <a routerLink="/" routerLinkActive="active-nav" [routerLinkActiveOptions]="{exact: true}" class="group flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
          <div class="w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 group-[.active-nav]:bg-teal-200 dark:group-[.active-nav]:bg-teal-800">
            <i class="fa-solid fa-house text-lg text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100 transition-colors">
            {{ store.t().home }}
          </span>
        </a>

        <!-- Protocols -->
        <a routerLink="/protocols" routerLinkActive="active-nav" class="group flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
          <div class="w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 group-[.active-nav]:bg-teal-200 dark:group-[.active-nav]:bg-teal-800">
            <i class="fa-solid fa-file-medical text-lg text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100 transition-colors">
            {{ store.t().protocols }}
          </span>
        </a>

        <!-- Calculators -->
        <a routerLink="/calculators" routerLinkActive="active-nav" class="group flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
          <div class="w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 group-[.active-nav]:bg-teal-200 dark:group-[.active-nav]:bg-teal-800">
            <i class="fa-solid fa-calculator text-lg text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100 transition-colors">
            {{ store.t().calculators }}
          </span>
        </a>

        <!-- Profile -->
        <a routerLink="/profile" routerLinkActive="active-nav" class="group flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
          <div class="w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 group-[.active-nav]:bg-teal-200 dark:group-[.active-nav]:bg-teal-800">
            <i class="fa-solid fa-folder-open text-lg text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100 transition-colors">
            {{ store.t().profile }}
          </span>
        </a>

        <!-- Settings -->
        <a routerLink="/settings" routerLinkActive="active-nav" class="group flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
          <div class="w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 group-[.active-nav]:bg-teal-200 dark:group-[.active-nav]:bg-teal-800">
            <i class="fa-solid fa-gear text-lg text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-[.active-nav]:text-teal-900 dark:group-[.active-nav]:text-teal-100 transition-colors">
            {{ store.t().settings }}
          </span>
        </a>

      </div>
    </nav>
  `,
  imports: [RouterLink, RouterLinkActive]
})
export class NavComponent {
  store = inject(VetStoreService);
}