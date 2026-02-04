import { Component, inject, signal, Pipe, PipeTransform } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Pipe({
  name: 'formatLineBreaks',
  standalone: true
})
export class FormatLineBreaksPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
  }
}

@Component({
  selector: 'app-protocols',
  template: `
    <div class="space-y-6 animate-fade-in pb-20">
      
      <!-- Search Header -->
      <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-[2rem] p-6 text-center">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">پروتکل‌های درمانی هوشمند</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">جستجو در جدیدترین رفرنس‌های دامپزشکی</p>

        @if (!store.isPremium()) {
          <div class="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 text-center shadow-sm">
            <div class="w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-700 dark:text-amber-100">
               <i class="fa-solid fa-lock text-xl"></i>
            </div>
            <h3 class="font-black text-amber-900 dark:text-amber-100 mb-1">دسترسی محدود</h3>
            <p class="text-xs text-amber-700 dark:text-amber-300 mb-4 opacity-80">برای دسترسی به پروتکل‌ها، اشتراک تهیه کنید.</p>
            <button (click)="handleUpgrade()" class="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-500/30 transition-transform active:scale-95">
              {{ store.user() ? 'خرید اشتراک' : 'ورود و خرید اشتراک' }}
            </button>
          </div>
        } @else {
          <!-- Modern Search Bar -->
          <div class="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg shadow-black/5 flex items-center gap-2 mb-6 border border-slate-100 dark:border-slate-700">
             <select [(ngModel)]="selectedSpecies" class="bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors max-w-[120px]">
              <option value="Dog">سگ</option>
              <option value="Cat">گربه</option>
              <option value="Bird">پرندگان</option>
              <option value="Reptile">خزندگان</option>
              <option value="Aquatic Animals">آبزیان</option>
              <option value="Amphibian">دوزیستان</option>
              <option value="Horse">اسب</option>
              <option value="Sheep and Goat">گوسفند و بز</option>
              <option value="Cow">گاو</option>
            </select>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="نام بیماری (مثال: Parvovirus)..." 
              class="flex-1 bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 outline-none px-2 placeholder-slate-400"
              (keyup.enter)="fetchProtocol()"
            >
            <button (click)="fetchProtocol()" [disabled]="isLoading()" class="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform">
              @if (isLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
              @else { <i class="fa-solid fa-search"></i> }
            </button>
          </div>

          <!-- Quick Chips -->
          <div class="flex flex-wrap gap-2 justify-center">
            <button (click)="quickSearch('CPV', 'Dog')" class="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-slate-700 hover:border-teal-200 transition-colors shadow-sm">پاروویروس سگ</button>
            <button (click)="quickSearch('Renal Failure', 'Cat')" class="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-slate-700 hover:border-teal-200 transition-colors shadow-sm">نارسایی کلیه گربه</button>
            <button (click)="quickSearch('Colic', 'Horse')" class="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-slate-700 hover:border-teal-200 transition-colors shadow-sm">کولیک اسب</button>
          </div>
        }
      </div>
      
      <!-- Result Card -->
      @if (protocolContent() && store.isPremium()) {
        <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-[2rem] p-6 shadow-sm animate-fade-in">
           <div class="prose prose-sm prose-slate dark:prose-invert max-w-none">
              <div [innerHTML]="protocolContent() | formatLineBreaks"></div>
           </div>
        </div>
      }

    </div>
  `,
  imports: [FormsModule, FormatLineBreaksPipe]
})
export class ProtocolsComponent {
  store = inject(VetStoreService);
  gemini = inject(GeminiService);
  router = inject(Router);

  searchQuery = signal('');
  selectedSpecies = signal('Dog');
  protocolContent = signal('');
  isLoading = signal(false);

  handleUpgrade() {
    if (!this.store.user()) {
      this.router.navigate(['/login']);
    } else {
      this.store.togglePremium();
    }
  }

  quickSearch(query: string, species: string) {
    this.searchQuery.set(query);
    this.selectedSpecies.set(species);
    this.fetchProtocol();
  }

  async fetchProtocol() {
    if (!this.searchQuery()) return;
    
    this.isLoading.set(true);
    const result = await this.gemini.getProtocol(this.selectedSpecies(), this.searchQuery());
    // Basic markdown cleanup
    const cleanResult = result
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-700 dark:text-teal-400">$1</strong>')
      .replace(/### (.*?)\n/g, '<h3 class="text-lg font-black mt-6 mb-3 text-slate-800 dark:text-slate-200">$1</h3>')
      .replace(/- (.*?)\n/g, '<li class="mb-1 ml-4 list-disc marker:text-teal-500">$1</li>');
    
    this.protocolContent.set(cleanResult);
    this.isLoading.set(false);
  }
}