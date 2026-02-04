import { Component, inject } from '@angular/core';
import { VetStoreService, AppTheme } from '../services/vet-store.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-settings',
  template: `
    <div class="space-y-6 animate-fade-in pb-20">
      
      <!-- User Profile / Login Section -->
      @if (store.user()) {
        <div class="bg-surface-variant dark:bg-surface-darkVariant p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
           <div class="absolute top-0 w-full h-24 bg-gradient-to-b from-teal-500/10 to-transparent"></div>
          
           <div class="w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-700 shadow-xl mb-4 relative z-10">
              <div class="w-full h-full rounded-full overflow-hidden bg-slate-200">
                @if (store.user()?.photoUrl) {
                    <img [src]="store.user()?.photoUrl" class="w-full h-full object-cover">
                } @else {
                    <div class="w-full h-full flex items-center justify-center text-slate-400"><i class="fa-solid fa-user text-3xl"></i></div>
                }
              </div>
           </div>
           
           <h2 class="font-black text-2xl text-slate-800 dark:text-white mb-1 relative z-10">{{ store.user()?.displayName }}</h2>
           <p class="text-sm text-slate-500 dark:text-slate-400 font-mono mb-6 relative z-10">{{ store.user()?.email || store.user()?.phoneNumber }}</p>
           
           <button (click)="store.logout()" class="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-6 py-3 rounded-full font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition relative z-10">
            <i class="fa-solid fa-right-from-bracket"></i> {{ store.t().logout }}
          </button>
        </div>
      } @else {
        <div class="bg-teal-700 text-white p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl shadow-teal-700/30 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl"></div>
          
          <i class="fa-solid fa-user-shield text-5xl mb-4 drop-shadow-md"></i>
          <h2 class="font-black text-2xl mb-2">{{ store.t().login_required }}</h2>
          <p class="text-sm opacity-90 mb-6 px-4 leading-relaxed">{{ store.t().login_msg }}</p>
          <button (click)="goToLogin()" class="bg-white text-teal-800 px-8 py-4 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-transform w-full">
            {{ store.t().login_btn }}
          </button>
        </div>
      }

      <!-- Settings Groups -->
      <div class="space-y-4">
        <h3 class="px-4 text-sm font-bold text-slate-400 uppercase tracking-wider">عمومی</h3>
        
        <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-3xl overflow-hidden">
            <!-- Language -->
            <div (click)="store.toggleLanguage()" class="p-5 flex justify-between items-center cursor-pointer active:bg-black/5 dark:active:bg-white/5 transition-colors border-b border-slate-200/50 dark:border-slate-700/50">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <i class="fa-solid fa-globe"></i>
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-200">زبان برنامه</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-500 font-medium">{{ store.currentLanguage() === 'fa' ? 'فارسی' : 'English' }}</span>
                    <i class="fa-solid fa-chevron-left text-slate-300 text-xs"></i>
                </div>
            </div>

            <!-- Theme -->
            <div class="p-5">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <i class="fa-solid fa-palette"></i>
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-200">{{ store.t().theme }}</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl">
                    @for (t of ['light', 'dark', 'system']; track t) {
                         <button 
                            (click)="store.setTheme(t)"
                            class="py-2.5 rounded-xl text-xs font-bold transition-all"
                            [class]="store.theme() === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm scale-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 scale-95'"
                            >
                            @if(t==='light') { <i class="fa-solid fa-sun mr-1"></i> {{ store.t().theme_light }} }
                            @if(t==='dark') { <i class="fa-solid fa-moon mr-1"></i> {{ store.t().theme_dark }} }
                            @if(t==='system') { <i class="fa-solid fa-mobile-screen mr-1"></i> {{ store.t().theme_system }} }
                        </button>
                    }
                </div>
            </div>
        </div>

        <h3 class="px-4 text-sm font-bold text-slate-400 uppercase tracking-wider mt-6">دیتابیس</h3>
         <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-3xl overflow-hidden">
             <div class="p-5 flex justify-between items-center cursor-pointer active:bg-black/5 dark:active:bg-white/5 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <i class="fa-solid fa-cloud-arrow-down"></i>
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-200">بروزرسانی داروها</span>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-300 text-xs"></i>
            </div>
         </div>

      </div>

      <!-- Subscription Floating Card -->
      <div class="bg-slate-900 dark:bg-white rounded-[2.5rem] p-6 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden mt-4">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 dark:bg-black/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        
        <div class="flex justify-between items-start mb-4">
            <div>
                 <h3 class="text-xl font-black mb-1">وضعیت اشتراک</h3>
                 <div class="inline-block bg-white/20 dark:bg-black/10 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    {{ store.isPremium() ? 'Premium Plan' : 'Free Plan' }}
                 </div>
            </div>
            <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xl shadow-lg shadow-yellow-400/50">
                <i class="fa-solid fa-crown"></i>
            </div>
        </div>

        <button 
          (click)="handleSubscription()"
          class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-lg"
        >
          {{ store.isPremium() ? 'مدیریت اشتراک' : store.t().upgrade }}
        </button>
      </div>

    </div>
  `,
  imports: [NgClass]
})
export class SettingsComponent {
  store = inject(VetStoreService);
  router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }

  handleSubscription() {
    if (!this.store.user()) {
      this.goToLogin();
    } else {
      this.store.togglePremium();
    }
  }
}