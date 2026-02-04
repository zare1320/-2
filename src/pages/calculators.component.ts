import { Component, inject, signal, computed } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe, NgTemplateOutlet, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { drugDatabase, DrugEntry } from '../data/drug-database';

@Component({
  selector: 'app-calculators',
  template: `
    <div class="pb-28 animate-fade-in relative min-h-screen">
      
      <!-- MAIN MENU LIST -->
      @if (!activeTool()) {
        <div class="space-y-4 animate-slide-up">
          
           <!-- Quick Info from Store -->
          @if (store.currentPatient()) {
            <div class="bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 p-4 rounded-3xl text-sm text-blue-900 dark:text-blue-200 mb-6 flex justify-between items-center shadow-sm">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                   @switch (store.currentPatient()?.species) {
                      @case('dog') { <i class="fa-solid fa-dog text-lg"></i> }
                      @case('cat') { <i class="fa-solid fa-cat text-lg"></i> }
                      @case('bird') { <i class="fa-solid fa-dove text-lg"></i> }
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

          <!-- Menu Grid -->
          <div class="grid grid-cols-1 gap-4">
             <!-- 1. Drug Dose -->
             <button (click)="openTool('drug')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-pills"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">محاسبه دوز دارو دستی</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">محاسبه حجم تزریق بر اساس دوز و وزن</p>
                   </div>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-400"></i>
             </button>

             <!-- 2. Anesthesia -->
             <button (click)="openTool('anes')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-syringe"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">دوز بیهوشی</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">پروتکل‌های القای بیهوشی و آرام‌بخشی</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   @if (!store.isPremium()) { <i class="fa-solid fa-lock text-slate-400"></i> }
                   <i class="fa-solid fa-chevron-left text-slate-400"></i>
                </div>
             </button>

             <!-- 3. Emergency Drugs -->
             <button (click)="openTool('emergency')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-heart-pulse"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">دوز دارو (اورژانس)</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">لیست داروهای حیاتی و احیا (CPR)</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   @if (!store.isPremium()) { <i class="fa-solid fa-lock text-slate-400"></i> }
                   <i class="fa-solid fa-chevron-left text-slate-400"></i>
                </div>
             </button>

             <!-- 4. Calories -->
             <button (click)="openTool('calories')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-fire"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">محاسبه کالری (RER/MER)</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">نیاز انرژی روزانه بر اساس وضعیت</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   @if (!store.isPremium()) { <i class="fa-solid fa-lock text-slate-400"></i> }
                   <i class="fa-solid fa-chevron-left text-slate-400"></i>
                </div>
             </button>

             <!-- 5. Toxicity -->
             <button (click)="openTool('toxicity')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">مسمومیت (شکلات)</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">ارزیابی سطح خطر مسمومیت</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   @if (!store.isPremium()) { <i class="fa-solid fa-lock text-slate-400"></i> }
                   <i class="fa-solid fa-chevron-left text-slate-400"></i>
                </div>
             </button>
             
             <!-- 6. Glucose -->
             <button (click)="openTool('glucose')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-chart-line"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">منحنی گلوکز</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">تفسیر قند خون نادیر و تنظیم انسولین</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   @if (!store.isPremium()) { <i class="fa-solid fa-lock text-slate-400"></i> }
                   <i class="fa-solid fa-chevron-left text-slate-400"></i>
                </div>
             </button>

             <!-- 7. Converter -->
             <button (click)="openTool('converter')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-right-left"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">مبدل واحدها</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">تبدیل وزن و دما</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   @if (!store.isPremium()) { <i class="fa-solid fa-lock text-slate-400"></i> }
                   <i class="fa-solid fa-chevron-left text-slate-400"></i>
                </div>
             </button>
          </div>
        </div>
      }

      <!-- TOOL MODAL / PAGE -->
      @if (activeTool()) {
        <div class="fixed inset-0 z-50 bg-surface-light dark:bg-surface-dark overflow-y-auto animate-slide-up pb-20">
           
           <!-- Sticky Header -->
           <div class="sticky top-0 z-40 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 flex items-center gap-3">
              <button (click)="closeTool()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-transform shadow-sm">
                 <i class="fa-solid fa-arrow-right"></i>
              </button>
              <h2 class="text-lg font-black text-slate-800 dark:text-white flex-1 text-center pr-10">
                 @switch(activeTool()) {
                    @case('drug') { محاسبه دوز دارو }
                    @case('anes') { دوز بیهوشی }
                    @case('emergency') { دوز دارو (اورژانس) }
                    @case('calories') { محاسبه کالری }
                    @case('toxicity') { مسمومیت }
                    @case('glucose') { منحنی گلوکز }
                    @case('converter') { مبدل واحدها }
                 }
              </h2>
           </div>

           <div class="p-5 max-w-lg mx-auto">
             
             <!-- 1. DRUG TOOL CONTENT -->
             @if (activeTool() === 'drug') {
                <div class="space-y-4 animate-fade-in">
                   <!-- ... (Copying existing Drug content) ... -->
                   <p class="text-[10px] text-slate-500 font-bold mb-1 opacity-70 uppercase tracking-wide">Enter patient and medication details below</p>
                   
                   <!-- Patient Info Read-only -->
                   <div class="grid grid-cols-2 gap-3">
                      <div class="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <label class="text-[9px] font-bold text-slate-400 block mb-1">گونه حیوان</label>
                          <div class="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                              {{ getSpeciesLabel(store.currentPatient()?.species) }}
                          </div>
                      </div>
                      <div class="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <label class="text-[9px] font-bold text-slate-400 block mb-1">نام بیمار</label>
                          <div class="font-bold text-slate-700 dark:text-slate-200 text-sm">
                              {{ store.currentPatient()?.name || '---' }}
                          </div>
                      </div>
                   </div>

                   <!-- Smart Drug Search Input -->
                   <div class="relative z-20">
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                            <label class="text-[10px] font-bold text-slate-400 uppercase">نام دارو (جستجوی هوشمند)</label>
                            <div class="flex items-center gap-2">
                              <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
                              <input 
                                  [(ngModel)]="searchDrugQuery" 
                                  (ngModelChange)="onDrugSearch($event)"
                                  type="text" 
                                  placeholder="نام فارسی، انگلیسی یا تجاری..." 
                                  class="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300"
                                  autocomplete="off"
                              >
                              @if (searchDrugQuery()) {
                                  <button (click)="clearSearch()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-times"></i></button>
                              }
                            </div>
                      </div>

                      @if (drugSearchResults().length > 0) {
                        <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto z-50">
                            @for (drug of drugSearchResults(); track drug.id) {
                              <button (click)="selectDrug(drug)" class="w-full text-right p-3 hover:bg-teal-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors flex flex-col items-start gap-1">
                                  <div class="flex justify-between w-full">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 text-sm">{{ drug.genericName.fa }}</span>
                                    <span class="text-xs text-slate-500 font-mono">{{ drug.genericName.en }}</span>
                                  </div>
                                  @if(drug.tradeNames.length > 0) {
                                    <span class="text-[10px] text-teal-600 dark:text-teal-400">
                                        تجاری: {{ drug.tradeNames.join(', ') }}
                                    </span>
                                  }
                              </button>
                            }
                        </div>
                      }
                   </div>

                   <!-- Date & Time -->
                   <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                          <label class="text-[9px] font-bold text-slate-400 uppercase">تاریخ مصرف</label>
                          <input [(ngModel)]="adminDate" type="date" class="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                          <label class="text-[9px] font-bold text-slate-400 uppercase">تاریخ پیگیری</label>
                          <input [(ngModel)]="followUpDate" type="date" class="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                   </div>

                   <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                          <label class="text-[9px] font-bold text-slate-400 uppercase">زمان دوز بعدی</label>
                          <input [(ngModel)]="nextDoseTime" type="datetime-local" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                          <label class="text-[9px] font-bold text-slate-400 uppercase">روش مصرف</label>
                          <select [(ngModel)]="route" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                              <option value="" disabled selected>انتخاب کنید...</option>
                              <option value="IV" class="dark:bg-slate-800">وریدی (IV)</option>
                              <option value="IM" class="dark:bg-slate-800">عضلانی (IM)</option>
                              <option value="SC" class="dark:bg-slate-800">زیرجلدی (SC)</option>
                              <option value="PO" class="dark:bg-slate-800">خوراکی (PO)</option>
                          </select>
                      </div>
                   </div>

                   <!-- Calculation Inputs -->
                   <div class="border-t-2 border-dashed border-slate-100 dark:border-slate-700/50 pt-4 grid grid-cols-1 gap-3 relative">
                      @if (selectedDrugId()) {
                          <div class="absolute -top-3 right-4 bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200 shadow-sm animate-fade-in">
                            <i class="fa-solid fa-magic mr-1"></i> تکمیل خودکار
                          </div>
                      }

                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                        <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">دوز (mg/kg)</label>
                        <input [(ngModel)]="dosageRate" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">غلظت (mg/ml)</label>
                        <input [(ngModel)]="concentration" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                   </div>

                  <div class="bg-teal-600 text-white rounded-3xl p-6 text-center mt-2 relative overflow-hidden shadow-lg shadow-teal-600/30">
                    <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
                    <span class="block text-sm font-medium opacity-80 mb-1">حجم تزریقی</span>
                    <span class="text-4xl font-black font-mono tracking-wider">{{ calculateDrugDose() }} <span class="text-lg">ml</span></span>
                  </div>
                </div>
             }

             <!-- 2. ANES TOOL CONTENT -->
             @if (activeTool() === 'anes') {
                 <div class="animate-fade-in">
                    @if (!store.isPremium()) { <ng-container *ngTemplateOutlet="premiumLock"></ng-container> } 
                    @else {
                      <div class="space-y-4">
                        <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-purple-500 transition-colors shadow-sm">
                          <label class="text-[10px] font-bold text-slate-400 uppercase">پروتکل</label>
                          <select [(ngModel)]="anesProtocol" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-bold focus:outline-none py-1">
                            <option value="propofol" class="dark:bg-slate-800">Propofol (IV)</option>
                            <option value="ket_val" class="dark:bg-slate-800">Ketamine + Diazepam</option>
                            <option value="xylazine" class="dark:bg-slate-800">Xylazine (Sedation)</option>
                          </select>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-purple-500 transition-colors shadow-sm">
                            <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                            <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                        </div>

                        <div class="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-2xl p-5 shadow-sm">
                          <h4 class="text-purple-900 dark:text-purple-200 font-bold mb-4 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-flask"></i> محاسبات دقیق
                          </h4>
                          @switch (anesProtocol()) {
                            @case('propofol') {
                              <div class="flex justify-between items-center text-sm mb-2 pb-2 border-b border-purple-100 dark:border-purple-800/50">
                                <span class="text-slate-600 dark:text-slate-300">Propofol 1% (4-6 mg/kg):</span>
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
                                <span class="text-slate-600 dark:text-slate-300">Diazepam 5mg/ml:</span>
                                <span class="font-mono font-black text-lg text-purple-700 dark:text-purple-300">{{ (weightInput() * 0.25 / 5).toFixed(2) }} ml</span>
                              </div>
                            }
                            @case('xylazine') {
                              <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-600 dark:text-slate-300">Xylazine 2% (1 mg/kg):</span>
                                <span class="font-mono font-black text-lg text-purple-700 dark:text-purple-300">{{ (weightInput() * 1 / 20).toFixed(2) }} ml</span>
                              </div>
                            }
                          }
                        </div>
                      </div>
                    }
                 </div>
             }

             <!-- 3. EMERGENCY TOOL CONTENT -->
             @if (activeTool() === 'emergency') {
                 <div class="animate-fade-in">
                    @if (!store.isPremium()) { <ng-container *ngTemplateOutlet="premiumLock"></ng-container> }
                    @else {
                        <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-red-500 transition-colors mb-4 shadow-sm">
                            <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                            <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                        </div>
                        <div class="space-y-3">
                            @for (drug of emergencyDrugs(); track drug.name) {
                                <div class="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border-l-4 border-red-500 shadow-sm">
                                    <div>
                                        <h4 class="font-bold text-slate-800 dark:text-slate-200">{{ drug.name }}</h4>
                                        <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{{ drug.dose }}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-lg font-black font-mono text-red-600 dark:text-red-400">{{ drug.amount }} <span class="text-xs">ml</span></p>
                                        <p class="text-[10px] text-slate-400 dir-ltr font-mono">{{ drug.conc }}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                 </div>
             }

             <!-- 4. CALORIES TOOL CONTENT -->
             @if (activeTool() === 'calories') {
                 <div class="animate-fade-in">
                     @if (!store.isPremium()) { <ng-container *ngTemplateOutlet="premiumLock"></ng-container> }
                     @else {
                        <div class="space-y-4">
                             <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-orange-500 transition-colors shadow-sm">
                                <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                                <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                             </div>
                             
                             <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-orange-500 transition-colors shadow-sm">
                                <label class="text-[10px] font-bold text-slate-400 uppercase">وضعیت حیوان</label>
                                <select [(ngModel)]="calorieFactor" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-bold focus:outline-none py-1">
                                     <option [value]="1.6" class="dark:bg-slate-800">بالغ عقیم شده (1.6)</option>
                                     <option [value]="1.8" class="dark:bg-slate-800">بالغ عقیم نشده (1.8)</option>
                                     <option [value]="1.2" class="dark:bg-slate-800">کم‌تحرک / چاق (1.2)</option>
                                     <option [value]="1.0" class="dark:bg-slate-800">کاهش وزن (1.0)</option>
                                     <option [value]="3.0" class="dark:bg-slate-800">توله < 4 ماه (3.0)</option>
                                     <option [value]="2.0" class="dark:bg-slate-800">توله > 4 ماه (2.0)</option>
                                </select>
                             </div>

                             <div class="grid grid-cols-2 gap-3">
                                <div class="bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 p-4 rounded-2xl text-center shadow-sm">
                                    <span class="text-xs text-orange-800 dark:text-orange-200 font-bold block mb-1">RER</span>
                                    <span class="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">{{ calculateRER() }}</span>
                                    <span class="text-[10px] text-slate-400 block">kcal/day</span>
                                </div>
                                <div class="bg-orange-100 dark:bg-orange-900/50 border border-orange-200 dark:border-orange-700 p-4 rounded-2xl text-center shadow-sm">
                                    <span class="text-xs text-orange-900 dark:text-orange-100 font-bold block mb-1">MER (Daily)</span>
                                    <span class="text-2xl font-black font-mono text-orange-700 dark:text-orange-300">{{ calculateMER() }}</span>
                                    <span class="text-[10px] text-slate-500 dark:text-slate-400 block">kcal/day</span>
                                </div>
                             </div>
                        </div>
                     }
                 </div>
             }

             <!-- 5. TOXICITY TOOL CONTENT -->
             @if (activeTool() === 'toxicity') {
                 <div class="animate-fade-in">
                     @if (!store.isPremium()) { <ng-container *ngTemplateOutlet="premiumLock"></ng-container> }
                     @else {
                        <div class="space-y-4">
                             <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-yellow-500 transition-colors shadow-sm">
                                <label class="text-[10px] font-bold text-slate-400 uppercase">وزن (kg)</label>
                                <input [(ngModel)]="weightInput" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                             </div>
                             <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-yellow-500 transition-colors shadow-sm">
                                <label class="text-[10px] font-bold text-slate-400 uppercase">نوع شکلات</label>
                                <select [(ngModel)]="toxinType" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-bold focus:outline-none py-1">
                                     <option value="white" class="dark:bg-slate-800">شکلات سفید</option>
                                     <option value="milk" class="dark:bg-slate-800">شکلات شیری</option>
                                     <option value="dark" class="dark:bg-slate-800">شکلات تلخ (Semi-sweet)</option>
                                     <option value="baking" class="dark:bg-slate-800">شکلات تخته‌ای تلخ</option>
                                     <option value="cocoa" class="dark:bg-slate-800">پودر کاکائو</option>
                                </select>
                             </div>
                             <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-yellow-500 transition-colors shadow-sm">
                                <label class="text-[10px] font-bold text-slate-400 uppercase">مقدار مصرف (گرم)</label>
                                <input [(ngModel)]="toxinAmount" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                             </div>

                             <div class="p-4 rounded-2xl text-center shadow-sm"
                                [class.bg-green-100]="calculateToxicityLevel() === 'Low'"
                                [class.text-green-800]="calculateToxicityLevel() === 'Low'"
                                [class.bg-yellow-100]="calculateToxicityLevel() === 'Moderate'"
                                [class.text-yellow-800]="calculateToxicityLevel() === 'Moderate'"
                                [class.bg-red-100]="calculateToxicityLevel() === 'Severe'"
                                [class.text-red-800]="calculateToxicityLevel() === 'Severe'"
                             >
                                <span class="block font-bold text-xs uppercase mb-1">سطح خطر</span>
                                <span class="text-xl font-black">{{ calculateToxicityLevel() === 'Low' ? 'کم‌خطر' : calculateToxicityLevel() === 'Moderate' ? 'متوسط (نیاز به درمان)' : 'شدید (اورژانسی)' }}</span>
                             </div>
                        </div>
                     }
                 </div>
             }

             <!-- 6. GLUCOSE TOOL CONTENT -->
             @if (activeTool() === 'glucose') {
                 <div class="animate-fade-in">
                     @if (!store.isPremium()) { <ng-container *ngTemplateOutlet="premiumLock"></ng-container> }
                     @else {
                        <div class="space-y-4">
                           <p class="text-xs text-slate-500 dark:text-slate-400">تفسیر ساده بر اساس نقطه نادیر (پایین‌ترین قند خون):</p>
                           <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-pink-500 transition-colors shadow-sm">
                                <label class="text-[10px] font-bold text-slate-400 uppercase">قند خون نادیر (mg/dL)</label>
                                <input [(ngModel)]="glucoseNadir" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                           </div>
                           
                           <div class="bg-pink-50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 p-4 rounded-2xl shadow-sm">
                              <p class="text-sm font-bold text-pink-900 dark:text-pink-200 leading-relaxed">{{ getGlucoseInterpretation() }}</p>
                           </div>
                        </div>
                     }
                 </div>
             }

             <!-- 7. CONVERTER TOOL CONTENT -->
             @if (activeTool() === 'converter') {
                 <div class="animate-fade-in">
                     @if (!store.isPremium()) { <ng-container *ngTemplateOutlet="premiumLock"></ng-container> }
                     @else {
                        <div class="grid grid-cols-2 gap-3 mb-4">
                           <button (click)="convertType.set('weight')" [class.bg-teal-600]="convertType() === 'weight'" [class.text-white]="convertType() === 'weight'" class="py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 transition-colors shadow-sm">وزن (kg/lb)</button>
                           <button (click)="convertType.set('temp')" [class.bg-teal-600]="convertType() === 'temp'" [class.text-white]="convertType() === 'temp'" class="py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 transition-colors shadow-sm">دما (C/F)</button>
                        </div>
                        
                        <div class="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                           <div class="flex-1">
                              <label class="text-[10px] font-bold text-slate-400 block mb-1">{{ convertType() === 'weight' ? 'کیلوگرم' : 'سانتی‌گراد' }}</label>
                              <input [ngModel]="convertValue()" (ngModelChange)="updateConvert($event, 'metric')" type="number" class="w-full bg-transparent font-mono text-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none text-center border-b border-slate-200 dark:border-slate-700 pb-1">
                           </div>
                           <i class="fa-solid fa-arrow-right-arrow-left text-slate-400"></i>
                           <div class="flex-1">
                              <label class="text-[10px] font-bold text-slate-400 block mb-1">{{ convertType() === 'weight' ? 'پوند' : 'فارنهایت' }}</label>
                               <input [ngModel]="convertResult()" (ngModelChange)="updateConvert($event, 'imperial')" type="number" class="w-full bg-transparent font-mono text-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none text-center border-b border-slate-200 dark:border-slate-700 pb-1">
                           </div>
                        </div>
                     }
                 </div>
             }
           </div>
        </div>
      }

    </div>

    <!-- Premium Lock Template -->
    <ng-template #premiumLock>
      <div class="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 text-center animate-fade-in border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fa-solid fa-crown text-3xl text-yellow-500"></i>
        </div>
        <h3 class="text-slate-800 dark:text-slate-200 font-bold mb-2">قابلیت ویژه</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
          {{ store.user() ? 'برای دسترسی به این ابزار، اشتراک خود را ارتقا دهید.' : 'برای دسترسی به تمام امکانات، لطفا وارد حساب خود شوید.' }}
        </p>
        <button (click)="handleUpgrade()" class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-full shadow-lg active:scale-95 transition-transform">
          {{ store.user() ? 'ارتقا به نسخه حرفه‌ای' : 'ورود و ارتقا' }}
        </button>
      </div>
    </ng-template>
  `,
  imports: [FormsModule, NgClass, DecimalPipe, NgTemplateOutlet, NgStyle]
})
export class CalculatorsComponent {
  store = inject(VetStoreService);
  router = inject(Router);
  
  // Replaces 'openSection' with 'activeTool'
  activeTool = signal<string | null>(null);
  
  // 1. Drug Dosage
  weightInput = signal<number>(0);
  dosageRate = signal<number>(10);
  concentration = signal<number>(100);

  // Drug Dosage Manual Fields
  searchDrugQuery = signal<string>('');
  drugSearchResults = signal<DrugEntry[]>([]);
  selectedDrugId = signal<string | null>(null);

  adminDate = signal<string>('');
  followUpDate = signal<string>('');
  nextDoseTime = signal<string>('');
  route = signal<string>('');

  // 2. Anesthesia
  anesProtocol = signal<string>('propofol');

  // 4. Calories
  calorieFactor = signal<number>(1.6);
  
  // 5. Toxicity
  toxinType = signal<string>('milk');
  toxinAmount = signal<number>(0);

  // 6. Glucose
  glucoseNadir = signal<number>(0);

  // 7. Converter
  convertType = signal<'weight' | 'temp'>('weight');
  convertValue = signal<number>(0);
  convertResult = signal<number>(0);

  // 3. Emergency Computed
  emergencyDrugs = computed(() => {
    const w = this.weightInput();
    if (!w) return [];
    return [
        { name: 'Epinephrine (Low)', dose: '0.01 mg/kg', amount: (w * 0.01).toFixed(2), conc: '1 mg/ml' },
        { name: 'Epinephrine (High)', dose: '0.1 mg/kg', amount: (w * 0.1).toFixed(2), conc: '1 mg/ml' },
        { name: 'Atropine', dose: '0.04 mg/kg', amount: (w * 0.04 / 0.54).toFixed(2), conc: '0.54 mg/ml' }, 
        { name: 'Lidocaine (Dog)', dose: '2 mg/kg', amount: (w * 2 / 20).toFixed(2), conc: '20 mg/ml (2%)' },
        { name: 'Diazepam', dose: '0.5 mg/kg', amount: (w * 0.5 / 5).toFixed(2), conc: '5 mg/ml' }
    ];
  });

  constructor() {
    this.syncWeight();
  }

  syncWeight() {
    const p = this.store.currentPatient();
    if (p) {
      this.weightInput.set(p.weight);
    }
  }

  openTool(toolName: string) {
    this.activeTool.set(toolName);
    window.scrollTo(0,0); // Scroll to top when opening tool
  }

  closeTool() {
    this.activeTool.set(null);
  }

  // Helper for species label
  getSpeciesLabel(id: string | undefined): string {
    if (!id) return 'نامشخص';
    const list: Record<string, string> = {
        'dog': 'سگ',
        'cat': 'گربه',
        'bird': 'پرندگان',
        'rodent': 'جوندگان',
        'reptile': 'خزندگان',
        'aquatic': 'آبزیان',
        'amphibian': 'دوزیستان',
        'horse': 'اسب',
        'small_ruminant': 'گوسفند و بز',
        'cow': 'گاو'
    };
    return list[id] || 'سایر';
  }

  // --- Drug Search Logic ---
  onDrugSearch(query: string) {
      this.searchDrugQuery.set(query);
      if (!query || query.length < 2) {
          this.drugSearchResults.set([]);
          return;
      }
      
      const q = query.toLowerCase();
      const results = drugDatabase.filter(d => 
          d.genericName.en.toLowerCase().includes(q) ||
          d.genericName.fa.includes(q) ||
          d.tradeNames.some(t => t.toLowerCase().includes(q))
      );
      this.drugSearchResults.set(results);
  }

  selectDrug(drug: DrugEntry) {
      this.searchDrugQuery.set(drug.genericName.fa);
      this.selectedDrugId.set(drug.id);
      this.drugSearchResults.set([]);

      // Auto-Fill Logic
      const patientSpecies = this.store.currentPatient()?.species || 'dog';
      
      // 1. Concentration
      if (drug.forms && drug.forms.length > 0) {
          this.concentration.set(drug.forms[0].concentration);
          if (drug.forms[0].routes && drug.forms[0].routes.length > 0) {
              this.route.set(drug.forms[0].routes[0]);
          }
      }

      // 2. Dosage Rate
      const doseInfo = drug.speciesDosage[patientSpecies];
      if (doseInfo) {
          this.dosageRate.set(doseInfo.avg);
      } else {
           console.warn(`No dosage found for species: ${patientSpecies}.`);
           this.dosageRate.set(0);
      }
  }

  clearSearch() {
      this.searchDrugQuery.set('');
      this.drugSearchResults.set([]);
      this.selectedDrugId.set(null);
      this.dosageRate.set(0);
      this.concentration.set(0);
  }

  // 1. Drug
  calculateDrugDose(): string {
    const w = this.weightInput();
    const d = this.dosageRate();
    const c = this.concentration();
    if (!w || !d || !c) return '0.00';
    return ((w * d) / c).toFixed(2);
  }

  // 4. Calories
  calculateRER(): string {
    const w = this.weightInput();
    if (!w) return '0';
    return (70 * Math.pow(w, 0.75)).toFixed(0);
  }

  calculateMER(): string {
    const rer = parseFloat(this.calculateRER());
    return (rer * this.calorieFactor()).toFixed(0);
  }

  // 5. Toxicity (Chocolate)
  calculateToxicityLevel(): 'Low' | 'Moderate' | 'Severe' {
    const w = this.weightInput();
    const g = this.toxinAmount();
    if (!w || !g) return 'Low';

    let theoPerGram = 0;
    switch (this.toxinType()) {
        case 'white': theoPerGram = 0.1; break;
        case 'milk': theoPerGram = 2; break;
        case 'dark': theoPerGram = 5.5; break;
        case 'baking': theoPerGram = 16; break;
        case 'cocoa': theoPerGram = 26; break;
    }

    const totalTheo = g * theoPerGram;
    const dose = totalTheo / w;

    if (dose > 60) return 'Severe';
    if (dose > 40) return 'Moderate';
    return 'Low';
  }

  // 6. Glucose
  getGlucoseInterpretation(): string {
      const g = this.glucoseNadir();
      if (!g) return 'لطفا عدد نادیر را وارد کنید.';
      if (g < 80) return 'خطر هیپوگلیسمی: دوز انسولین را ۱۰ تا ۲۵ درصد کاهش دهید.';
      if (g > 150) return 'مقاومت به انسولین یا دوز ناکافی: دوز انسولین را ۱۰ تا ۲۵ درصد افزایش دهید (با مشورت متخصص).';
      return 'کنترل قند خون مناسب است (بین ۸۰ تا ۱۵۰).';
  }

  // 7. Converter
  updateConvert(val: number, source: 'metric' | 'imperial') {
      if (source === 'metric') {
          this.convertValue.set(val);
          if (this.convertType() === 'weight') {
              this.convertResult.set(parseFloat((val * 2.20462).toFixed(2)));
          } else {
              this.convertResult.set(parseFloat(((val * 9/5) + 32).toFixed(1)));
          }
      } else {
          this.convertResult.set(val);
          if (this.convertType() === 'weight') {
              this.convertValue.set(parseFloat((val / 2.20462).toFixed(2)));
          } else {
              this.convertValue.set(parseFloat(((val - 32) * 5/9).toFixed(1)));
          }
      }
  }

  handleUpgrade() {
    if (!this.store.user()) {
      this.router.navigate(['/login']);
    } else {
      this.store.togglePremium();
    }
  }
}
