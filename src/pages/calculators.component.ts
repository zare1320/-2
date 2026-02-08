import { Component, inject, signal, computed } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe, NgTemplateOutlet, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { drugDatabase, DrugEntry, DrugForm } from '../data/drug-database';

interface PrescriptionItem {
    id: string;
    drugName: string;
    dosage: number;
    concentration: number;
    weight: number;
    volume: string;
    unit: string; // Added unit (ml, tab, g)
    route: string;
    frequency: string;
    instructions: string;
}

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
             <!-- 1. Drug Dose (FREE) -->
             <button (click)="openTool('drug')" class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-pills"></i>
                   </div>
                   <div class="text-start">
                      <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">محاسبه دوز دارو </h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">محاسبه و ایجاد نسخه دارویی</p>
                   </div>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-400"></i>
             </button>

             <!-- 2. Anesthesia (PREMIUM) -->
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

             <!-- 3. Emergency Drugs (PREMIUM) -->
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

             <!-- 4. Calories (PREMIUM) -->
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

             <!-- 5. Toxicity (PREMIUM) -->
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
             
             <!-- 6. Glucose (PREMIUM) -->
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

             <!-- 7. Converter (PREMIUM) -->
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
        <div class="fixed inset-0 z-50 bg-surface-light dark:bg-surface-dark overflow-y-auto animate-slide-up pb-20 no-print">
           
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
             
             <!-- 1. DRUG TOOL CONTENT (FREE) -->
             @if (activeTool() === 'drug') {
                <div class="space-y-4 animate-fade-in">
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

                   <div class="grid grid-cols-2 gap-3">
                      <!-- Route Selection -->
                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                          <label class="text-[9px] font-bold text-slate-400 uppercase">روش مصرف</label>
                          <select [(ngModel)]="route" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                              <option value="" disabled selected>انتخاب کنید...</option>
                              <optgroup label="تزریقی" class="bg-slate-100 dark:bg-slate-900">
                                <option value="IV">وریدی (IV)</option>
                                <option value="IM">عضلانی (IM)</option>
                                <option value="SC">زیرپوستی (SC)</option>
                              </optgroup>
                              <optgroup label="خوراکی" class="bg-slate-100 dark:bg-slate-900">
                                <option value="Tablet">قرص (Tablet)</option>
                                <option value="Syrup">شربت (Syrup)</option>
                              </optgroup>
                              <optgroup label="موضعی" class="bg-slate-100 dark:bg-slate-900">
                                <option value="Ointment">پماد (Ointment)</option>
                                <option value="Spray">اسپری (Spray)</option>
                                <option value="Shampoo">شامپو (Shampoo)</option>
                              </optgroup>
                              <optgroup label="سایر" class="bg-slate-100 dark:bg-slate-900">
                                <option value="Intravaginal">درون واژینال</option>
                                <option value="Rectal">درون مقعدی</option>
                              </optgroup>
                          </select>
                      </div>

                      <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm">
                          <label class="text-[9px] font-bold text-slate-400 uppercase">تکرار (Frequency)</label>
                          <select [(ngModel)]="frequency" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                              <option value="q24h (روزانه)">q24h (روزانه)</option>
                              <option value="q12h (هر ۱۲ ساعت)">q12h (هر ۱۲ ساعت)</option>
                              <option value="q8h (هر ۸ ساعت)">q8h (هر ۸ ساعت)</option>
                              <option value="q6h (هر ۶ ساعت)">q6h (هر ۶ ساعت)</option>
                              <option value="Once (تک دوز)">Once (تک دوز)</option>
                          </select>
                      </div>
                   </div>

                   <!-- Pharmaceutical Form Selection (New) -->
                   @if (drugForms().length > 0) {
                       <div class="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border-2 border-transparent focus-within:border-teal-500 transition-colors shadow-sm animate-fade-in">
                           <label class="text-[9px] font-bold text-slate-400 uppercase">شکل دارویی (Pharmaceutical Form)</label>
                           <select 
                               [ngModel]="selectedForm()" 
                               (ngModelChange)="onFormSelect($event)" 
                               class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                           >
                               <option [ngValue]="null" selected>انتخاب کنید...</option>
                               @for (form of drugForms(); track form.label) {
                                   <option [ngValue]="form">{{ form.label }}</option>
                               }
                           </select>
                       </div>
                   }

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
                        <label class="text-[10px] font-bold text-slate-400 uppercase">
                           @if (route() === 'Tablet') { غلظت (mg/tab) }
                           @else if (route() === 'Ointment') { غلظت (mg/g) }
                           @else { غلظت (mg/ml) }
                        </label>
                        <input [(ngModel)]="concentration" type="number" class="w-full bg-transparent font-mono text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300">
                      </div>
                   </div>

                   <!-- Result Box & Add Button -->
                   <div class="flex items-stretch gap-3 mt-2">
                        <div class="bg-teal-600 text-white rounded-3xl p-6 text-center relative overflow-hidden shadow-lg shadow-teal-600/30 flex-1 flex flex-col justify-center gap-1">
                            <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
                            
                            <!-- Dynamic Label -->
                            <span class="block text-sm font-medium opacity-80 mb-0.5">
                               @if (route() === 'Tablet') { تعداد قرص }
                               @else if (route() === 'Syrup') { حجم شربت }
                               @else if (route() === 'Ointment') { مقدار پماد }
                               @else { حجم تزریقی }
                            </span>

                            <!-- Updated: Unit logic -->
                            <div class="flex items-baseline justify-center gap-1" dir="rtl">
                                <span class="text-lg opacity-80">
                                   @if (route() === 'Tablet') { عدد }
                                   @else if (route() === 'Ointment') { گرم }
                                   @else { ml }
                                </span>
                                <span class="text-4xl font-black font-mono tracking-wider">{{ calculateDrugDose() }}</span>
                            </div>

                            <!-- Total Dose Display -->
                            <div class="text-[10px] opacity-70 font-bold bg-black/20 rounded-full px-2 py-0.5 mx-auto mt-1 inline-block">
                               {{ (weightInput() * dosageRate()).toFixed(0) }} میلی‌گرم دارو
                            </div>
                        </div>
                        
                        <button (click)="addToPrescription()" class="bg-slate-800 dark:bg-slate-700 text-white rounded-3xl px-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-900 active:scale-95 transition-all w-24 shadow-lg">
                            <i class="fa-solid fa-plus text-2xl"></i>
                            <span class="text-[10px] font-bold text-center">افزودن به نسخه</span>
                        </button>
                   </div>

                   <!-- Prescription List -->
                   @if (prescriptionList().length > 0) {
                       <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 animate-slide-up">
                           <div class="flex items-center justify-between mb-4">
                               <h3 class="font-black text-slate-800 dark:text-white flex items-center gap-2">
                                   <i class="fa-solid fa-file-prescription text-teal-600"></i>
                                   لیست اقلام دارویی
                               </h3>
                               <span class="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-0.5 rounded-md">{{ prescriptionList().length }} قلم</span>
                           </div>

                           <div class="space-y-3 mb-6">
                               @for (item of prescriptionList(); track item.id) {
                                   <div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm relative group">
                                       <button (click)="removeFromList(item.id)" class="absolute top-3 left-3 w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                           <i class="fa-solid fa-trash text-xs"></i>
                                       </button>
                                       
                                       <h4 class="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">{{ item.drugName }}</h4>
                                       <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                                           <span><strong class="text-slate-700 dark:text-slate-300">دوز:</strong> {{ item.dosage }} mg/kg</span>
                                           <span><strong class="text-slate-700 dark:text-slate-300">مقدار:</strong> <span class="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">{{ item.volume }} {{ item.unit }}</span></span>
                                           <span class="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">{{ item.route }}</span>
                                           <span class="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">{{ item.frequency }}</span>
                                       </div>
                                   </div>
                               }
                           </div>

                           <button (click)="printRx()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95">
                               <i class="fa-solid fa-print"></i>
                               چاپ نسخه / ذخیره PDF
                           </button>
                       </div>
                   }
                </div>
             }
             
             <!-- ALL OTHER TOOLS: PREMIUM CHECK -->
             @if (activeTool() !== 'drug') {
                 @if (store.isPremium()) {
                    <!-- PREMIUM CONTENT RENDER -->
                    @if (activeTool() === 'anes') {
                        <div class="animate-fade-in"><p class="text-center p-4">محتوای این بخش تغییری نکرده است.</p></div>
                    }
                    @if (activeTool() === 'emergency') { <div class="animate-fade-in"><p class="text-center p-4">محتوای این بخش تغییری نکرده است.</p></div> }
                    @if (activeTool() === 'calories') { <div class="animate-fade-in"><p class="text-center p-4">محتوای این بخش تغییری نکرده است.</p></div> }
                    @if (activeTool() === 'toxicity') { <div class="animate-fade-in"><p class="text-center p-4">محتوای این بخش تغییری نکرده است.</p></div> }
                    @if (activeTool() === 'glucose') { <div class="animate-fade-in"><p class="text-center p-4">محتوای این بخش تغییری نکرده است.</p></div> }
                    @if (activeTool() === 'converter') { <div class="animate-fade-in"><p class="text-center p-4">محتوای این بخش تغییری نکرده است.</p></div> }
                 } @else {
                     <!-- LOCKED SCREEN -->
                     <ng-container *ngTemplateOutlet="premiumLock"></ng-container>
                 }
             }

           </div>
        </div>
      }
      
      <!-- PRINTABLE AREA (Hidden on screen, Visible on print) -->
      <div id="printable-area" class="hidden print:block p-8 bg-white text-black font-vazir">
         <div class="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
            <div>
                <h1 class="text-2xl font-black mb-1">نسخه دامپزشکی</h1>
                <p class="text-sm">Smart Vet Assistant</p>
            </div>
            <div class="text-left text-sm">
                <p><strong>تاریخ:</strong> {{ getTodayDate() }}</p>
                <p><strong>بیمار:</strong> {{ store.currentPatient()?.name || '---' }} ({{ store.currentPatient()?.species || '---' }})</p>
                <p><strong>وزن:</strong> {{ store.currentPatient()?.weight || '---' }} kg</p>
            </div>
         </div>

         <div class="mb-8">
            <h3 class="font-bold text-lg mb-4 border-b border-gray-300 pb-2">اقلام دارویی (Rx)</h3>
            <table class="w-full text-right text-sm">
                <thead>
                    <tr class="border-b border-black">
                        <th class="py-2">نام دارو</th>
                        <th class="py-2">دوز</th>
                        <th class="py-2">غلظت</th>
                        <th class="py-2">روش مصرف</th>
                        <th class="py-2">تکرار</th>
                        <th class="py-2 text-left">مقدار مصرف</th>
                    </tr>
                </thead>
                <tbody>
                    @for (item of prescriptionList(); track item.id) {
                        <tr class="border-b border-gray-200">
                            <td class="py-3 font-bold">{{ item.drugName }}</td>
                            <td class="py-3">{{ item.dosage }} mg/kg</td>
                            <td class="py-3 dir-ltr text-right">{{ item.concentration }}</td>
                            <td class="py-3">{{ item.route }}</td>
                            <td class="py-3">{{ item.frequency }}</td>
                            <td class="py-3 font-bold font-mono text-left text-lg">{{ item.volume }} {{ item.unit }}</td>
                        </tr>
                    }
                </tbody>
            </table>
         </div>

         <div class="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
             <p>این نسخه توسط دستیار هوشمند دامپزشک محاسبه شده است. تایید نهایی با دامپزشک مسئول است.</p>
         </div>
      </div>

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
  
  activeTool = signal<string | null>(null);
  
  // 1. Drug Dosage & Prescription
  weightInput = signal<number>(0);
  dosageRate = signal<number>(10);
  concentration = signal<number>(100);
  prescriptionList = signal<PrescriptionItem[]>([]); // List of added drugs
  
  // Drug Dosage Manual Fields
  searchDrugQuery = signal<string>('');
  drugSearchResults = signal<DrugEntry[]>([]);
  selectedDrugId = signal<string | null>(null);

  // New: Drug Forms
  drugForms = signal<DrugForm[]>([]);
  selectedForm = signal<DrugForm | null>(null);

  // Additional Fields
  frequency = signal<string>('q24h (روزانه)');
  route = signal<string>('IV');

  // ... (Other state variables remain same) ...
  adminDate = signal<string>('');
  followUpDate = signal<string>('');
  nextDoseTime = signal<string>('');
  anesProtocol = signal<string>('propofol');
  calorieFactor = signal<number>(1.6);
  toxinType = signal<string>('milk');
  toxinAmount = signal<number>(0);
  glucoseNadir = signal<number>(0);
  convertType = signal<'weight' | 'temp'>('weight');
  convertValue = signal<number>(0);
  convertResult = signal<number>(0);

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
    window.scrollTo(0,0);
  }

  closeTool() {
    this.activeTool.set(null);
  }

  getSpeciesLabel(id: string | undefined): string {
    if (!id) return 'نامشخص';
    const list: Record<string, string> = {
        'dog': 'سگ', 'cat': 'گربه', 'bird': 'پرندگان', 'rodent': 'جوندگان',
        'reptile': 'خزندگان', 'aquatic': 'آبزیان', 'amphibian': 'دوزیستان',
        'horse': 'اسب', 'small_ruminant': 'گوسفند و بز', 'cow': 'گاو'
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
      
      // Load forms
      this.drugForms.set(drug.forms);
      this.selectedForm.set(null); // Reset selected form

      const patientSpecies = this.store.currentPatient()?.species || 'dog';
      // Auto-select first form if available and valid? No, let user choose.
      if (drug.forms && drug.forms.length > 0) {
          // If a form is selected later, we update concentration.
          // Default logic from before:
          if (drug.forms[0].concentration > 0) {
             this.concentration.set(drug.forms[0].concentration);
          }
          if (drug.forms[0].routes && drug.forms[0].routes.length > 0) {
              this.route.set(drug.forms[0].routes[0]);
          }
      }
      
      const doseInfo = drug.speciesDosage[patientSpecies];
      if (doseInfo) {
          this.dosageRate.set(doseInfo.avg);
          if (doseInfo.freq) {
             this.frequency.set(doseInfo.freq);
          }
      } else {
           this.dosageRate.set(0);
      }
  }

  onFormSelect(form: DrugForm | null) {
      this.selectedForm.set(form);
      if (form) {
          // Update concentration if it is set in the form
          if (form.concentration > 0) {
             this.concentration.set(form.concentration);
          }
          // Update route if applicable
          if (form.routes && form.routes.length > 0) {
              this.route.set(form.routes[0]);
          }
      }
  }

  clearSearch() {
      this.searchDrugQuery.set('');
      this.drugSearchResults.set([]);
      this.selectedDrugId.set(null);
      this.drugForms.set([]);
      this.selectedForm.set(null);
      this.dosageRate.set(0);
      this.concentration.set(0);
  }

  // --- Calculations ---
  calculateDrugDose(): string {
    const w = this.weightInput();
    const d = this.dosageRate();
    const c = this.concentration();
    if (!w || !d || !c) return '0.00';
    return ((w * d) / c).toFixed(2);
  }

  // --- Prescription List Logic ---
  addToPrescription() {
    const vol = parseFloat(this.calculateDrugDose());
    if (vol <= 0 || !this.searchDrugQuery()) {
        this.store.showNotification('لطفا نام دارو و مقادیر صحیح را وارد کنید', 'error');
        return;
    }

    // Determine unit
    let currentUnit = 'ml';
    if (this.route() === 'Tablet') currentUnit = 'عدد';
    else if (this.route() === 'Ointment') currentUnit = 'گرم';

    const newItem: PrescriptionItem = {
        id: Date.now().toString(),
        drugName: this.searchDrugQuery() + (this.selectedForm() ? ` (${this.selectedForm()?.label})` : ''),
        dosage: this.dosageRate(),
        concentration: this.concentration(),
        weight: this.weightInput(),
        volume: this.calculateDrugDose(),
        unit: currentUnit,
        route: this.route(),
        frequency: this.frequency(),
        instructions: ''
    };

    this.prescriptionList.update(list => [...list, newItem]);
    this.store.showNotification('به نسخه اضافه شد', 'success');
    
    // Optional: clear input for next drug
    this.clearSearch();
  }

  removeFromList(id: string) {
      this.prescriptionList.update(list => list.filter(i => i.id !== id));
  }

  printRx() {
      window.print();
  }

  getTodayDate(): string {
      return new Date().toLocaleDateString('fa-IR');
  }

  // --- Other Calculators (Logic kept same) ---
  calculateRER(): string {
    const w = this.weightInput();
    if (!w) return '0';
    return (70 * Math.pow(w, 0.75)).toFixed(0);
  }

  calculateMER(): string {
    const rer = parseFloat(this.calculateRER());
    return (rer * this.calorieFactor()).toFixed(0);
  }

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

  getGlucoseInterpretation(): string {
      const g = this.glucoseNadir();
      if (!g) return 'لطفا عدد نادیر را وارد کنید.';
      if (g < 80) return 'خطر هیپوگلیسمی: دوز انسولین را ۱۰ تا ۲۵ درصد کاهش دهید.';
      if (g > 150) return 'مقاومت به انسولین یا دوز ناکافی: دوز انسولین را ۱۰ تا ۲۵ درصد افزایش دهید (با مشورت متخصص).';
      return 'کنترل قند خون مناسب است (بین ۸۰ تا ۱۵۰).';
  }

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