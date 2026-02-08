import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

// --- INTERFACES & TYPES ---

export interface User {
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoUrl?: string;
  medicalCode?: string;
  workplace?: string;
  isProfileComplete?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  weight: number;
  age: number;
  sex?: string;
  isSterilized?: boolean;
  vaccineType?: string;
  vaccinationDate?: string;
  vaccinationStatus?: string;
  dewormerType?: string;
  dewormingDate?: string;
  dewormingStatus?: string;
  symptoms: string;
  diagnosis?: string;
  date: string;
}

export type AppTheme = 'light' | 'dark' | 'system';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- TRANSLATIONS ---

const translations = {
  fa: {
    app_title: 'دستیار هوشمند دامپزشک',
    home: 'خانه',
    protocols: 'پروتکل‌ها',
    calculators: 'محاسبه‌گر',
    profile: 'پرونده‌ها',
    settings: 'تنظیمات',
    login_required: 'نیاز به ورود به حساب',
    login_msg: 'برای دسترسی به امکانات ویژه، وارد شوید یا ثبت‌نام کنید.',
    login_btn: 'ورود / ثبت‌نام',
    send_code: 'ارسال کد تایید',
    verify: 'تایید و ورود',
    google_auth: 'یا',
    logout: 'خروج از حساب',
    theme: 'پوسته برنامه',
    theme_light: 'روشن',
    theme_dark: 'تاریک',
    theme_system: 'سیستم',
  },
  en: {
    app_title: 'Smart Vet Assistant',
    home: 'Home',
    protocols: 'Protocols',
    calculators: 'Calculators',
    profile: 'Records',
    settings: 'Settings',
    login_required: 'Login Required',
    login_msg: 'Log in or sign up to access special features.',
    login_btn: 'Login / Sign Up',
    send_code: 'Send Code',
    verify: 'Verify & Login',
    google_auth: 'OR',
    logout: 'Logout',
    theme: 'App Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_system: 'System',
  }
};


// --- SERVICE IMPLEMENTATION ---

@Injectable({
  providedIn: 'root'
})
export class VetStoreService {
  private router = inject(Router);

  // --- STATE SIGNALS ---
  user = signal<User | null>(null);
  isPremium = signal(false);
  currentLanguage = signal<'fa' | 'en'>('fa');
  theme = signal<AppTheme>('system');
  savedPatients = signal<Patient[]>([]);
  currentPatient = signal<Patient | null>(null);
  notification = signal<Notification | null>(null);
  
  // --- COMPUTED SIGNALS ---
  t = computed(() => translations[this.currentLanguage()]);

  constructor() {
    this.loadStateFromStorage();
    
    // --- EFFECTS for LOCALSTORAGE PERSISTENCE ---
    effect(() => this.saveToStorage('vet_user', this.user()));
    effect(() => this.saveToStorage('vet_is_premium', this.isPremium()));
    effect(() => this.saveToStorage('vet_language', this.currentLanguage()));
    effect(() => this.saveToStorage('vet_patients', this.savedPatients()));
    effect(() => this.saveToStorage('vet_theme', this.theme()));
    
    // Effect to apply theme to the document
    effect(() => {
      const currentTheme = this.theme();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (currentTheme === 'dark' || (currentTheme === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  // --- LOCALSTORAGE HELPERS ---
  private loadStateFromStorage() {
    this.user.set(this.getFromStorage('vet_user'));
    this.isPremium.set(this.getFromStorage('vet_is_premium') || false);
    this.currentLanguage.set(this.getFromStorage('vet_language') || 'fa');
    this.savedPatients.set(this.getFromStorage('vet_patients') || []);
    this.theme.set(this.getFromStorage('vet_theme') || 'system');
  }

  private getFromStorage<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private saveToStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  // --- NOTIFICATIONS ---
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({ message, type });
    setTimeout(() => this.notification.set(null), 3000);
  }

  // --- PATIENT MANAGEMENT ---
  addPatient(patient: Patient) {
    this.savedPatients.update(patients => [patient, ...patients]);
  }

  removePatient(patientId: string) {
    this.savedPatients.update(p => p.filter(patient => patient.id !== patientId));
    if (this.currentPatient()?.id === patientId) {
      this.currentPatient.set(null);
    }
  }

  setPatient(patient: Patient | null) {
    this.currentPatient.set(patient);
  }

  // --- AUTHENTICATION (MOCKED) ---
  async loginWithPhone(phone: string): Promise<void> {
    console.log(`Sending OTP to ${phone}`);
    await new Promise(res => setTimeout(res, 1000)); // Simulate API call
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    await new Promise(res => setTimeout(res, 1000));
    if (otp === '12345') { // Mock OTP check
      this.user.set({ uid: phone, phoneNumber: phone, displayName: 'کاربر جدید' });
      return true;
    }
    return false;
  }

  async loginWithGoogle(): Promise<void> {
    await new Promise(res => setTimeout(res, 500));
    this.user.set({
      uid: 'google_user_123',
      displayName: 'کاربر گوگل',
      email: 'user@google.com',
      photoUrl: 'https://picsum.photos/100'
    });
    this.isPremium.set(true); // Grant premium for google login for demo
  }

  logout() {
    this.user.set(null);
    this.isPremium.set(false);
    this.router.navigate(['/login']);
  }
  
  updateUser(data: Partial<User>) {
      this.user.update(u => u ? { ...u, ...data } : null);
  }

  // --- SETTINGS ---
  setTheme(theme: AppTheme) {
    this.theme.set(theme);
  }
  
  toggleLanguage() {
    this.currentLanguage.update(lang => lang === 'fa' ? 'en' : 'fa');
  }

  // For testing purposes
  togglePremium() {
    this.isPremium.update(p => !p);
  }
}
