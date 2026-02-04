import { Component, inject, signal } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-surface-light dark:bg-surface-dark pb-32">
      
      <div class="w-full max-w-sm">
        <!-- Brand -->
        <div class="text-center mb-10">
          <div class="w-20 h-20 bg-teal-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-teal-600/30 mb-4 rotate-3">
             <i class="fa-solid fa-user-doctor text-4xl text-white"></i>
          </div>
          <h1 class="text-3xl font-black text-slate-800 dark:text-white mb-2">{{ store.t().login_btn }}</h1>
          <p class="text-slate-500 dark:text-slate-400">به دستیار هوشمند دامپزشک خوش آمدید</p>
        </div>

        <!-- Auth Method Tabs -->
        <div class="bg-surface-variant dark:bg-surface-darkVariant p-1.5 rounded-2xl flex mb-8">
            <button 
              (click)="authMethod.set('phone')"
              class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300"
              [class]="authMethod() === 'phone' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
            >
              {{ store.t().phone_auth }}
            </button>
            <button 
              (click)="authMethod.set('google')"
               class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300"
              [class]="authMethod() === 'google' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
            >
              Google
            </button>
        </div>

        <!-- Form Container -->
        <div class="space-y-6">
          
          @if (authMethod() === 'phone') {
             <div class="animate-fade-in">
                @if (step() === 'input') {
                   <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-2xl px-5 pt-4 pb-2 border-2 border-transparent focus-within:border-teal-500 transition-colors mb-6">
                      <label class="text-[10px] font-bold text-slate-400 uppercase">{{ store.t().enter_phone }}</label>
                      <div class="flex items-center gap-3">
                        <i class="fa-solid fa-mobile-screen text-slate-400 text-lg"></i>
                        <input [(ngModel)]="phoneNumber" type="tel" placeholder="0912..." class="w-full bg-transparent text-xl font-bold text-slate-800 dark:text-white focus:outline-none py-2 placeholder-slate-300 dir-ltr text-left">
                      </div>
                   </div>

                   <button 
                    (click)="sendCode()" 
                    [disabled]="!phoneNumber() || isLoading()"
                    class="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-600/30 active:scale-95 transition-transform flex justify-center items-center gap-2"
                   >
                     @if (isLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                     {{ store.t().send_code }}
                   </button>
                } @else {
                    <div class="text-center">
                        <p class="text-sm text-slate-600 dark:text-slate-400 mb-6 bg-surface-variant dark:bg-surface-darkVariant py-2 px-4 rounded-full inline-block">
                             کد ارسال شده به <span class="font-mono font-bold text-slate-900 dark:text-white mx-1">{{ phoneNumber() }}</span>
                        </p>
                        
                        <div class="flex justify-center gap-2 mb-8 dir-ltr">
                             <input [(ngModel)]="otpCode" type="text" maxlength="5" class="w-full bg-surface-variant dark:bg-surface-darkVariant text-center text-4xl font-mono tracking-[0.5em] font-bold text-slate-800 dark:text-white py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="•••••">
                        </div>

                        <button 
                            (click)="verifyCode()" 
                            [disabled]="!otpCode() || isLoading()"
                            class="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-600/30 active:scale-95 transition-transform flex justify-center items-center gap-2 mb-4"
                        >
                            @if (isLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                            {{ store.t().verify }}
                        </button>
                        
                        <button (click)="step.set('input')" class="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            تغییر شماره موبایل
                        </button>
                    </div>
                }
             </div>
          } @else {
             <div class="animate-fade-in text-center pt-4">
                <button 
                (click)="loginGoogle()"
                [disabled]="isLoading()"
                class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 text-lg"
              >
                @if (isLoading()) {
                  <i class="fa-solid fa-spinner fa-spin text-teal-600"></i>
                } @else {
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6">
                }
                <span>{{ store.t().google_auth }}</span>
              </button>
              <p class="text-xs text-slate-400 mt-6 leading-relaxed">با ورود به سیستم، شما قوانین و مقررات استفاده از خدمات دستیار هوشمند دامپزشک را می‌پذیرید.</p>
             </div>
          }

        </div>
      </div>
      
      <button routerLink="/" class="mt-auto mb-4 text-slate-400 font-bold text-sm hover:text-teal-600 transition-colors flex items-center gap-2">
         <i class="fa-solid fa-arrow-right"></i> بازگشت به خانه 
      </button>
    </div>
  `,
  imports: [FormsModule, NgClass]
})
export class LoginComponent {
  store = inject(VetStoreService);
  router = inject(Router);

  authMethod = signal<'phone' | 'google'>('phone');
  step = signal<'input' | 'otp'>('input');
  
  phoneNumber = signal('');
  otpCode = signal('');
  isLoading = signal(false);

  async sendCode() {
    if (!this.phoneNumber()) return;
    this.isLoading.set(true);
    await this.store.loginWithPhone(this.phoneNumber());
    this.isLoading.set(false);
    this.step.set('otp');
  }

  async verifyCode() {
    if (!this.otpCode()) return;
    this.isLoading.set(true);
    const success = await this.store.verifyOtp(this.phoneNumber(), this.otpCode());
    this.isLoading.set(false);
    if (success) {
      this.router.navigate(['/settings']);
    } else {
      alert('کد اشتباه است (کد صحیح: 12345)');
    }
  }

  async loginGoogle() {
    this.isLoading.set(true);
    await this.store.loginWithGoogle();
    this.isLoading.set(false);
    this.router.navigate(['/settings']);
  }
}