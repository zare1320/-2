import { Component, inject, signal } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .slide-enter {
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    /* RTL Support */
    :host-context([dir="rtl"]) .slide-enter {
       animation-name: slideInRtl;
    }
    @keyframes slideInRtl {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `],
  template: `
    <div class="min-h-screen relative flex flex-col items-center justify-center p-6 bg-surface-light dark:bg-surface-dark overflow-hidden transition-colors duration-300">
      
      <!-- Top Controls -->
      <div class="absolute top-6 right-6 flex items-center gap-3 z-20">
         <!-- Theme Toggle -->
         <button (click)="toggleTheme()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shadow-sm">
            @if(store.theme() === 'dark') { <i class="fa-solid fa-moon"></i> }
            @else { <i class="fa-solid fa-sun"></i> }
         </button>
         
         <!-- Locale Toggle -->
         <button (click)="toggleLanguage()" class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 shadow-sm">
            <i class="fa-solid fa-globe"></i>
            <span>{{ store.currentLanguage() === 'fa' ? 'English' : 'فارسی' }}</span>
         </button>
      </div>

      <div class="w-full max-w-sm relative z-10 animate-fade-in">
         
         <!-- Brand -->
         <div class="flex flex-col items-center justify-center mb-10">
            <img src="https://i.postimg.cc/hjrfP6b4/image.png" alt="App Logo" class="w-32 h-32 animate-float mb-6 object-contain drop-shadow-2xl">
            <h1 class="text-2xl font-black text-slate-800 dark:text-white mb-2">{{ store.t().login_btn }}</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">به جمع متخصصین دامپزشکی بپیوندید</p>
         </div>

         <!-- Identity View -->
         @if (view() === 'identity') {
            <div class="slide-enter">
                <div class="space-y-4">
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                            <i class="fa-solid fa-envelope"></i>
                        </div>
                        <input 
                            [(ngModel)]="identity" 
                            (keyup.enter)="submitIdentity()"
                            type="text" 
                            [placeholder]="store.currentLanguage() === 'fa' ? 'شماره موبایل یا ایمیل' : 'Phone or Email'" 
                            class="w-full bg-surface-variant dark:bg-surface-darkVariant border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium dir-ltr text-left placeholder:text-right"
                        >
                    </div>
                    
                    @if (error()) {
                        <p class="text-red-500 text-xs font-bold px-1 animate-pulse">{{ error() }}</p>
                    }

                    <button 
                        (click)="submitIdentity()" 
                        [disabled]="isLoading() || !identity()"
                        class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        @if (isLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                        {{ store.t().send_code }}
                    </button>
                </div>
            </div>
         }

         <!-- OTP View -->
         @if (view() === 'otp') {
            <div class="slide-enter">
                <div class="text-center mb-6">
                    <p class="text-sm text-slate-600 dark:text-slate-400">
                        کد تایید به <span class="font-bold text-slate-900 dark:text-white dir-ltr inline-block">{{ identity() }}</span> ارسال شد
                    </p>
                    <button (click)="view.set('identity'); error.set(null)" class="text-xs text-teal-600 dark:text-teal-400 font-bold mt-1 hover:underline">ویرایش شماره</button>
                </div>

                <div class="space-y-6">
                    <div class="flex justify-center dir-ltr">
                        <input 
                            [(ngModel)]="otp" 
                            type="text" 
                            maxlength="5" 
                            class="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] bg-surface-variant dark:bg-surface-darkVariant border border-slate-200 dark:border-slate-700 rounded-2xl py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-800 dark:text-white placeholder-slate-300"
                            placeholder="•••••"
                        >
                    </div>

                    @if (error()) {
                        <p class="text-red-500 text-xs font-bold text-center animate-pulse">{{ error() }}</p>
                    }

                    <button 
                        (click)="submitOtp()" 
                        [disabled]="isLoading() || otp().length < 5"
                        class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        @if (isLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                        {{ store.t().verify }}
                    </button>
                </div>
            </div>
         }

         <!-- Divider -->
         <div class="flex items-center my-8">
            <div class="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
            <span class="mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{{ store.t().google_auth }}</span>
            <div class="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
         </div>

         <!-- Google Button -->
         <button 
            (click)="loginGoogle()"
            [disabled]="isLoading()"
            class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
         >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5">
            <span>ادامه با گوگل</span>
         </button>

      </div>
    </div>
  `,
  imports: [FormsModule, NgClass]
})
export class LoginComponent {
  store = inject(VetStoreService);
  router = inject(Router);

  view = signal<'identity' | 'otp'>('identity');
  identity = signal('');
  otp = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);

  toggleTheme() {
    const next = this.store.theme() === 'dark' ? 'light' : 'dark';
    this.store.setTheme(next);
  }

  toggleLanguage() {
    this.store.toggleLanguage();
  }

  async submitIdentity() {
    if (!this.identity()) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
        await this.store.loginWithPhone(this.identity());
        this.view.set('otp');
    } catch (e) {
        this.error.set('خطا در ارتباط با سرور.');
    } finally {
        this.isLoading.set(false);
    }
  }

  async submitOtp() {
    if (!this.otp()) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
        const success = await this.store.verifyOtp(this.identity(), this.otp());
        if (success) {
            this.router.navigate(['/settings']);
        } else {
            this.error.set('کد وارد شده صحیح نیست.');
        }
    } catch (e) {
        this.error.set('خطا در تایید کد.');
    } finally {
        this.isLoading.set(false);
    }
  }

  async loginGoogle() {
    this.isLoading.set(true);
    await this.store.loginWithGoogle();
    this.isLoading.set(false);
    this.router.navigate(['/settings']);
  }
}
