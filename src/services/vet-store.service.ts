import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  weight: number; // kg
  age: number; // years
  symptoms: string;
  diagnosis?: string;
  date: string;
}

export interface User {
  id: string;
  displayName: string;
  phoneNumber?: string;
  email?: string;
  photoUrl?: string;
}

export type AppLanguage = 'fa' | 'en';
export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class VetStoreService {
  // State Signals
  readonly user = signal<User | null>(null);
  readonly isPremium = signal<boolean>(false);
  readonly currentLanguage = signal<AppLanguage>('fa');
  readonly theme = signal<AppTheme>('system');
  readonly currentPatient = signal<Patient | null>(null);
  readonly savedPatients = signal<Patient[]>([]);
  
  // Translation Dictionary
  private translations = {
    fa: {
      app_title: 'دستیار هوشمند دامپزشک',
      home: 'خانه',
      protocols: 'پروتکل‌ها',
      calculators: 'محاسبه‌گر',
      profile: 'پرونده‌ها',
      settings: 'تنظیمات',
      species: 'گونه حیوان',
      analyze: 'تحلیل هوشمند (AI)',
      save: 'ذخیره پرونده',
      premium_lock: 'نسخه ویژه',
      login_required: 'ورود الزامی است',
      login_msg: 'برای دسترسی به امکانات ویژه لطفا وارد حساب کاربری شوید.',
      login_btn: 'ورود / ثبت نام',
      logout: 'خروج از حساب',
      upgrade: 'ارتقا به نسخه حرفه‌ای',
      phone_auth: 'ورود با شماره موبایل',
      google_auth: 'ورود با گوگل',
      enter_phone: 'شماره موبایل خود را وارد کنید',
      enter_code: 'کد تایید را وارد کنید',
      send_code: 'ارسال کد',
      verify: 'تایید و ورود',
      ai_diagnosis: 'تشخیص هوشمند با Gemini',
      theme: 'پوسته',
      theme_light: 'روشن',
      theme_dark: 'تیره',
      theme_system: 'سیستم'
    },
    en: {
      app_title: 'Smart Vet Assistant',
      home: 'Home',
      protocols: 'Protocols',
      calculators: 'Calculators',
      profile: 'Records',
      settings: 'Settings',
      species: 'Species',
      analyze: 'AI Analysis',
      save: 'Save Record',
      premium_lock: 'Premium',
      login_required: 'Login Required',
      login_msg: 'Please login to access premium features.',
      login_btn: 'Login / Register',
      logout: 'Logout',
      upgrade: 'Upgrade to Pro',
      phone_auth: 'Phone Login',
      google_auth: 'Google Login',
      enter_phone: 'Enter your phone number',
      enter_code: 'Enter verification code',
      send_code: 'Send Code',
      verify: 'Verify & Login',
      ai_diagnosis: 'Gemini Diagnosis',
      theme: 'Theme',
      theme_light: 'Light',
      theme_dark: 'Dark',
      theme_system: 'System'
    }
  };

  // Computed Translations
  readonly t = computed(() => this.translations[this.currentLanguage()]);

  constructor() {
    this.loadFromStorage();
    
    // Auto-save effects
    effect(() => {
      localStorage.setItem('vet_is_premium', JSON.stringify(this.isPremium()));
    });
    effect(() => {
      localStorage.setItem('vet_patients', JSON.stringify(this.savedPatients()));
    });
    effect(() => {
      localStorage.setItem('vet_user', JSON.stringify(this.user()));
    });
    effect(() => {
      localStorage.setItem('vet_theme', this.theme());
      this.applyTheme();
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.applyTheme();
      }
    });
  }

  private loadFromStorage() {
    const storedPremium = localStorage.getItem('vet_is_premium');
    if (storedPremium) this.isPremium.set(JSON.parse(storedPremium));

    const storedPatients = localStorage.getItem('vet_patients');
    if (storedPatients) this.savedPatients.set(JSON.parse(storedPatients));

    const storedUser = localStorage.getItem('vet_user');
    if (storedUser) this.user.set(JSON.parse(storedUser));

    const storedTheme = localStorage.getItem('vet_theme') as AppTheme;
    if (storedTheme) this.theme.set(storedTheme);
  }

  // --- Theme Logic ---
  setTheme(t: AppTheme) {
    this.theme.set(t);
  }

  private applyTheme() {
    const t = this.theme();
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // --- Patient Logic ---
  setPatient(patient: Patient) {
    this.currentPatient.set(patient);
  }

  addPatient(patient: Patient) {
    this.savedPatients.update(list => [patient, ...list]);
  }

  // --- Subscription Logic ---
  togglePremium() {
    if (!this.user()) return; // Cannot be premium without user
    this.isPremium.update(v => !v);
  }

  // --- Auth Logic (Simulated) ---
  
  async loginWithPhone(phoneNumber: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true; // Code sent
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code === '12345') { // Mock OTP
      this.user.set({
        id: 'user_' + Date.now(),
        displayName: 'Dr. ' + phoneNumber.slice(-4),
        phoneNumber: phoneNumber
      });
      return true;
    }
    return false;
  }

  async loginWithGoogle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.user.set({
      id: 'google_' + Date.now(),
      displayName: 'Dr. John Doe',
      email: 'doctor@vetclinic.com',
      photoUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
    });
  }

  logout() {
    this.user.set(null);
    this.isPremium.set(false); // Reset premium on logout
  }

  toggleLanguage() {
    this.currentLanguage.update(l => l === 'fa' ? 'en' : 'fa');
  }
}