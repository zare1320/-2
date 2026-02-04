import { Component, inject, signal, computed } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calculators',
  template: `
    <div class="space-y-4 animate-fade-in pb-20">
      
      <!-- Quick Info from Store -->
      @if (store.currentPatient()) {
        <div class="bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 p-4 rounded-3xl text-sm text-blue-900 dark:text-blue-200 mb-6 flex justify-between items-center shadow-sm">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
               @switch (store.currentPatient()?.species) {
                  @case('dog') { <i class="fa-solid fa-dog text-lg"></i> }
                  @case('cat') { <i class="fa-solid fa-cat text-lg"></i> }
                  @case('bird') { <i class="fa-solid fa-dove text-lg"></i> }
                  @case('reptile') { <i class="fa-solid fa-staff-snake text-lg"></i> }
                  @case('aquatic') { <i class="fa-solid fa-fish text-lg"></i> }
                  @case('amphibian') { <i class="fa-solid fa-frog text-lg"></i> }
                  @case('horse') { <i class="fa-solid fa-horse text-lg"></i> }
                  @case('cow') { <i class="fa-solid fa-cow text-lg"></i> }
                  @default { <i class="fa-solid fa-paw text-lg"></i> }
               }
             </div>
             <div>
                <p class="font-bold text-base">{{ store.currentPatient()?.name }}</p>
                <p class="opacity-70">{{ store.currentPatient()?.weight }} kg</p>
             </div>
          </div>
          <button (click)="syncWeight()" class="text-xs bg-white dark:bg-blue-800 px-4 py-2 rounded-full font-bold hover:shadow-md transition-all">
            <i class="fa-solid fa-refresh mr-1"></i> بروزرسانی
          </button>
        </div>
      }

      <!-- Free Calculator: Drug Dosage -->
      <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-3xl overflow-hidden transition-all duration-300" [class.shadow-md]="openSection() === 'drug'">
        <div class="p-5 flex justify-between items-center cursor-pointer active:bg-black/5 dark:active:bg-white/5" (click)="toggleSection('drug')">
          <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <i class="fa-solid fa-pills"></i>
            </div>
            محاسبه دوز دارو
          </h3>
          <i class="fa-solid fa-chevron-down transition-transform duration-300 text-slate-400" [class.rotate-180]="openSection() === 'drug'"></i>
        </div>
        
        @if (openSection() === 'drug') {
          <div class="px-5 pb-6 space-y-4 animate-fade-in">
             <div class="grid grid-cols-1 gap-3">
                <!-- Inputs -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                  <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">دوز (mg/kg)</label>
                  <input [(ngModel)]="dosageRate" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">غلظت (mg/ml)</label>
                  <input [(ngModel)]="concentration" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                </div>
             </div>

            <div class="bg-teal-600 text-white rounded-3xl p-6 text-center mt-2 relative overflow-hidden shadow-lg shadow-teal-600/30">
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <span class="block text-sm font-medium opacity-80 mb-1">حجم تزریقی</span>
              <span class="text-4xl font-black font-mono tracking-wider">{{ calculateDrugDose() }} <span class="text-lg">ml</span></span>
            </div>
          </div>
        }
      </div>

      <!-- Premium Calculator: Anesthesia -->
      <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-3xl overflow-hidden transition-all duration-300" [class.shadow-md]="openSection() === 'anes'">
        <div class="p-5 flex justify-between items-center cursor-pointer active:bg-black/5 dark:active:bg-white/5" (click)="toggleSection('anes')">
          <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-3">
             <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
               <i class="fa-solid fa-syringe"></i>
            </div>
            دوز بیهوشی
          </h3>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-lock text-slate-400 text-sm"></i>
            <i class="fa-solid fa-chevron-down transition-transform duration-300 text-slate-400" [class.rotate-180]="openSection() === 'anes'"></i>
          </div>
        </div>

        @if (openSection() === 'anes') {
          <div class="px-5 pb-6 animate-fade-in">
            @if (!store.isPremium()) {
              <div class="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 text-center">
                <i class="fa-solid fa-crown text-4xl text-yellow-400 mb-3 block drop-shadow-sm"></i>
                <p class="text-slate-600 dark:text-slate-300 font-bold mb-4">
                  {{ store.user() ? 'این قابلیت مخصوص کاربران ویژه است.' : 'برای دسترسی ابتدا وارد حساب خود شوید.' }}
                </p>
                <button (click)="handleUpgrade()" class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-full shadow-lg">
                  {{ store.user() ? 'ارتقا به نسخه حرفه‌ای' : 'ورود و ارتقا' }}
                </button>
              </div>
            } @else {
              <!-- Actual Anesthesia Calculator -->
              <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent">
                   <label class="text-[10px] font-bold text-slate-400 uppercase">پروتکل</label>
                   <select [(ngModel)]="anesProtocol" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-bold focus:outline-none py-1">
                     <option value="propofol">Propofol (IV)</option>
                     <option value="ket_val">Ketamine + Diazepam (Mix)</option>
                     <option value="xylazine">Xylazine (Sedation)</option>
                   </select>
                </div>
                
                <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent">
                     <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                     <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                </div>

                <!-- Results Area -->
                <div class="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-2xl p-5">
                  <h4 class="text-purple-900 dark:text-purple-200 font-bold mb-4 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-flask"></i> محاسبات دقیق
                  </h4>
                  @switch (anesProtocol()) {
                    @case('propofol') {
                      <div class="flex justify-between items-center text-sm mb-2 pb-2 border-b border-purple-100 dark:border-purple-800/50">
                         <span class="text-slate-600 dark:text-slate-300">Propofol 1%:</span>
                         <span class="font-mono font-black text-lg text-purple-700 dark:text-purple-300">{{ (weightInput() * 6 / 10).toFixed(2) }} ml</span>
                      </div>
                      <p class="text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-black/20 p-2 rounded-lg">توجه: آهسته تزریق شود (To effect).</p>
                    }
                    @case('ket_val') {
                       <div class="flex justify-between items-center text-sm mb-3">
                         <span class="text-slate-600 dark:text-slate-300">Ketamine 10%:</span>
                         <span class="font-mono font-black text-lg text-purple-700 dark:text-purple-300">{{ (weightInput() * 5 / 100).toFixed(2) }} ml</span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                         <span class="text-slate-600 dark:text-slate-300">Diazepam:</span>
                         <span class="font-mono font-black text-lg text-purple-700 dark:text-purple-300">{{ (weightInput() * 0.25 / 5).toFixed(2) }} ml</span>
                      </div>
                    }
                    @case('xylazine') {
                      <div class="flex justify-between items-center text-sm">
                         <span class="text-slate-600 dark:text-slate-300">Xylazine 2%:</span>
                         <span class="font-mono font-black text-lg text-purple-700 dark:text-purple-300">{{ (weightInput() * 1 / 20).toFixed(2) }} ml</span>
                      </div>
                    }
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

    </div>
  `,
  imports: [FormsModule, NgClass]
})
export class CalculatorsComponent {
  store = inject(VetStoreService);
  router = inject(Router);
  
  openSection = signal<string>('drug');
  
  // Calculator Inputs
  weightInput = signal<number>(0);
  dosageRate = signal<number>(10);
  concentration = signal<number>(100);
  anesProtocol = signal<string>('propofol');

  constructor() {
    this.syncWeight();
  }

  syncWeight() {
    const p = this.store.currentPatient();
    if (p) {
      this.weightInput.set(p.weight);
    }
  }

  toggleSection(sec: string) {
    this.openSection.set(this.openSection() === sec ? '' : sec);
  }

  calculateDrugDose(): string {
    const w = this.weightInput();
    const d = this.dosageRate();
    const c = this.concentration();
    
    if (!w || !d || !c) return '0.00';
    return ((w * d) / c).toFixed(2);
  }

  handleUpgrade() {
    if (!this.store.user()) {
      this.router.navigate(['/login']);
    } else {
      this.store.togglePremium();
    }
  }
}