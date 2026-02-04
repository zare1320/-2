import { Component, inject, signal, computed, effect } from '@angular/core';
import { VetStoreService, Patient } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { NgClass, DatePipe } from '@angular/common';
import { toGregorian } from 'jalaali-js';
import { 
  dogBreeds, catBreeds, birdBreeds, reptileBreeds, fishBreeds, 
  amphibianBreeds, mammalBreeds, horseBreeds, cowBreeds, smallRuminantBreeds, BaseBreed 
} from '../data/breeds';

@Component({
  selector: 'app-home',
  template: `
    <div class="space-y-6 animate-fade-in" (click)="closeSuggestions()">
      
      <!-- Patient Form Card -->
      <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-3xl p-6 shadow-none">
        
        <!-- Instruction Message -->
        <div class="mb-6 text-center">
             <p class="text-sm font-bold text-teal-600 dark:text-teal-400">
               <i class="fa-solid fa-circle-info mr-1"></i>
               برای شروع، یک گونه را انتخاب کنید
             </p>
        </div>

        <div class="flex items-center gap-3 mb-6">
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200">مشخصات بیمار</h2>
        </div>

        <div class="space-y-5">
          <!-- Species Chips -->
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-1">گونه حیوان <span class="text-red-500">*</span></label>
            <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              @for (s of speciesList; track s.id) {
                <button 
                  (click)="setSpecies(s.id)"
                  [class.bg-teal-600]="species() === s.id"
                  [class.text-white]="species() === s.id"
                  [class.bg-white]="species() !== s.id"
                  [class.dark:bg-slate-800]="species() !== s.id"
                  [class.text-slate-600]="species() !== s.id"
                  [class.dark:text-slate-300]="species() !== s.id"
                  class="px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-2 border border-transparent"
                >
                  <i [class]="s.icon"></i>
                  {{s.label}}
                </button>
              }
            </div>
          </div>

          <!-- Input Fields (Filled Style) -->
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">نام <span class="text-red-500">*</span></label>
                <input [(ngModel)]="name" type="text" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent">
              </div>
            </div>

            <!-- Autocomplete Breed Input -->
            <div class="col-span-1 group relative" (click)="$event.stopPropagation()">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">نژاد</label>
                <input 
                  [ngModel]="breed()" 
                  (ngModelChange)="onBreedInput($event)"
                  (focus)="onBreedFocus()"
                  type="text" 
                  class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent"
                  autocomplete="off"
                >
              </div>
              
              <!-- Suggestions Dropdown -->
              @if (showBreedSuggestions() && filteredBreeds().length > 0) {
                <div class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 rounded-b-2xl shadow-xl z-50 max-h-48 overflow-y-auto border-x border-b border-slate-200 dark:border-slate-700 mt-[-2px]">
                   @for (b of filteredBreeds(); track b.id) {
                     <button (click)="selectBreed(b)" class="w-full text-right px-4 py-2 hover:bg-teal-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700/50 last:border-0 flex justify-between items-center group/item">
                        <span>{{ b.name.fa }}</span>
                        <span class="text-xs text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">{{ b.name.en }}</span>
                     </button>
                   }
                </div>
              }
            </div>

            <div class="col-span-1 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">وزن (kg) <span class="text-red-500">*</span></label>
                <input [(ngModel)]="weight" type="number" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent">
              </div>
            </div>

            <div class="col-span-1 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">سن (سال)</label>
                <input [(ngModel)]="age" type="number" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent">
              </div>
            </div>

            <!-- New Fields: Gender & Sterilization -->
            <div class="col-span-1 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">جنسیت</label>
                <div class="relative">
                    <select [(ngModel)]="sex" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none appearance-none relative z-10">
                        <option value="" class="text-slate-400">انتخاب کنید...</option>
                        <option value="Male" class="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800">نر (Male)</option>
                        <option value="Female" class="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800">ماده (Female)</option>
                    </select>
                     <i class="fa-solid fa-chevron-down absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div class="col-span-1 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">عقیم‌سازی</label>
                <div class="relative">
                    <select [ngModel]="isSterilized()" (ngModelChange)="isSterilized.set($event == 'true')" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none appearance-none relative z-10">
                        <option [value]="false" class="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800">خیر</option>
                        <option [value]="true" class="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800">بله</option>
                    </select>
                    <i class="fa-solid fa-chevron-down absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <!-- Vaccination Section -->
            <div class="col-span-2 space-y-3 pt-2">
                <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
                   <i class="fa-solid fa-syringe text-teal-500"></i> وضعیت واکسیناسیون
                </h3>
                
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                   <div class="grid grid-cols-2 gap-1">
                      <!-- Vaccine Type Dropdown -->
                      <div class="relative bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-2 flex flex-col justify-center transition-colors">
                         <label class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">نوع واکسن</label>
                         <select [(ngModel)]="vaccineType" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none relative z-10">
                            <option value="" class="text-slate-500 dark:text-slate-400">انتخاب کنید...</option>
                            <option value="DHPPi" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">چندگانه (DHPPi)</option>
                            <option value="DHPPiL" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">چندگانه + لپتوسپیروز (DHPPi+L)</option>
                            <option value="Rabies" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">هاری (Rabies)</option>
                            <option value="Poly+Rabies" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">چندگانه + هاری</option>
                            <option value="Tricat" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">سه‌گانه گربه (Tricat)</option>
                            <option value="FeLV" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">لوسمی گربه (FeLV)</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                      </div>

                      <!-- Persian Date Picker Modern -->
                      <div class="relative bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-2 flex flex-col justify-center dir-ltr transition-colors">
                         <label class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 text-right w-full">تاریخ تزریق</label>
                         <div class="flex items-center justify-between gap-1 w-full">
                             <!-- Year -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="vacYear" (change)="checkVaccineStatus()" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected class="text-slate-500">سال</option>
                                  @for(y of years; track y) { <option [value]="y" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">{{y}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-400 dark:text-slate-500 text-xs font-light">/</span>
                             <!-- Month -->
                             <div class="relative flex-[1.5] min-w-0">
                                <select [(ngModel)]="vacMonth" (change)="checkVaccineStatus()" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected class="text-slate-500">ماه</option>
                                  @for(m of months; track m; let i = $index) { <option [value]="i+1" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">{{m}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-400 dark:text-slate-500 text-xs font-light">/</span>
                             <!-- Day -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="vacDay" (change)="checkVaccineStatus()" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected class="text-slate-500">روز</option>
                                  @for(d of days; track d) { <option [value]="d" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">{{d}}</option> }
                                </select>
                             </div>
                         </div>
                      </div>
                   </div>
                </div>
                
                @if (vaccineStatusMessage()) {
                    <div class="p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in"
                        [class.bg-green-50]="vaccineStatus() === 'Valid'"
                        [class.text-green-700]="vaccineStatus() === 'Valid'"
                        [class.border]="true"
                        [class.border-green-100]="vaccineStatus() === 'Valid'"
                        [class.bg-red-50]="vaccineStatus() === 'Expired'"
                        [class.text-red-700]="vaccineStatus() === 'Expired'"
                        [class.border-red-100]="vaccineStatus() === 'Expired'"
                        [class.bg-slate-50]="vaccineStatus() === 'Unknown'"
                        [class.text-slate-600]="vaccineStatus() === 'Unknown'"
                        [class.border-slate-100]="vaccineStatus() === 'Unknown'"
                        
                        [class.dark:bg-green-900/20]="vaccineStatus() === 'Valid'"
                        [class.dark:text-green-300]="vaccineStatus() === 'Valid'"
                        [class.dark:border-green-800/30]="vaccineStatus() === 'Valid'"
                        [class.dark:bg-red-900/20]="vaccineStatus() === 'Expired'"
                        [class.dark:text-red-300]="vaccineStatus() === 'Expired'"
                        [class.dark:border-red-800/30]="vaccineStatus() === 'Expired'"
                    >
                        <i class="fa-solid" 
                           [class.fa-check-circle]="vaccineStatus() === 'Valid'"
                           [class.fa-triangle-exclamation]="vaccineStatus() === 'Expired'"
                        ></i>
                        {{ vaccineStatusMessage() }}
                    </div>
                }
            </div>

            <!-- Deworming Section -->
            <div class="col-span-2 space-y-3">
                <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
                   <i class="fa-solid fa-shield-virus text-orange-500"></i> وضعیت انگل‌تراپی
                </h3>

                <div class="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                   <div class="grid grid-cols-2 gap-1">
                      <!-- Dewormer Type Dropdown -->
                      <div class="relative bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-2 flex flex-col justify-center transition-colors">
                         <label class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">نوع انگل‌تراپی</label>
                         <select [(ngModel)]="dewormerType" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none relative z-10">
                             <option value="" class="text-slate-500 dark:text-slate-400">انتخاب کنید...</option>
                             <option value="Oral Tablet" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">قرص خوراکی</option>
                             <option value="Spot-on" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">قطره پشت گردنی</option>
                             <option value="Injectable" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">تزریقی</option>
                             <option value="Suspension" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">شربت ضد انگل</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                      </div>

                      <!-- Persian Date Picker Modern -->
                      <div class="relative bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-2 flex flex-col justify-center dir-ltr transition-colors">
                         <label class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 text-right w-full">تاریخ مصرف</label>
                         <div class="flex items-center justify-between gap-1 w-full">
                             <!-- Year -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="dewormYear" (change)="checkDewormingStatus()" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected class="text-slate-500">سال</option>
                                  @for(y of years; track y) { <option [value]="y" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">{{y}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-400 dark:text-slate-500 text-xs font-light">/</span>
                             <!-- Month -->
                             <div class="relative flex-[1.5] min-w-0">
                                <select [(ngModel)]="dewormMonth" (change)="checkDewormingStatus()" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected class="text-slate-500">ماه</option>
                                  @for(m of months; track m; let i = $index) { <option [value]="i+1" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">{{m}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-400 dark:text-slate-500 text-xs font-light">/</span>
                             <!-- Day -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="dewormDay" (change)="checkDewormingStatus()" class="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected class="text-slate-500">روز</option>
                                  @for(d of days; track d) { <option [value]="d" class="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">{{d}}</option> }
                                </select>
                             </div>
                         </div>
                      </div>
                   </div>
                </div>

                @if (dewormingStatusMessage()) {
                    <div class="p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in"
                        [class.bg-green-50]="dewormingStatus() === 'Valid'"
                        [class.text-green-700]="dewormingStatus() === 'Valid'"
                        [class.border]="true"
                        [class.border-green-100]="dewormingStatus() === 'Valid'"
                        [class.bg-red-50]="dewormingStatus() === 'Expired'"
                        [class.text-red-700]="dewormingStatus() === 'Expired'"
                        [class.border-red-100]="dewormingStatus() === 'Expired'"
                        [class.bg-slate-50]="dewormingStatus() === 'Unknown'"
                        [class.text-slate-600]="dewormingStatus() === 'Unknown'"
                        [class.border-slate-100]="dewormingStatus() === 'Unknown'"

                        [class.dark:bg-green-900/20]="dewormingStatus() === 'Valid'"
                        [class.dark:text-green-300]="dewormingStatus() === 'Valid'"
                        [class.dark:border-green-800/30]="dewormingStatus() === 'Valid'"
                        [class.dark:bg-red-900/20]="dewormingStatus() === 'Expired'"
                        [class.dark:text-red-300]="dewormingStatus() === 'Expired'"
                        [class.dark:border-red-800/30]="dewormingStatus() === 'Expired'"
                    >
                         <i class="fa-solid" 
                           [class.fa-check-circle]="dewormingStatus() === 'Valid'"
                           [class.fa-triangle-exclamation]="dewormingStatus() === 'Expired'"
                        ></i>
                        {{ dewormingStatusMessage() }}
                    </div>
                }
            </div>

            <div class="col-span-2 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">علائم بالینی</label>
                <textarea [(ngModel)]="symptoms" rows="2" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none resize-none placeholder-transparent"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Analysis Card -->
      <div class="bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50">
        <h2 class="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-2">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          تشخیص هوشمند
        </h2>
        <p class="text-xs text-indigo-600 dark:text-indigo-300 mb-5 opacity-80 font-medium leading-relaxed">
           بر اساس نتایج آزمایشگاهی یا عکس‌برداری با استفاده از هوش مصنوعی جمینای
        </p>

        <div class="space-y-4">
          <div class="border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-white/50 dark:bg-slate-900/50 rounded-2xl p-6 text-center cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all relative group">
            <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
            @if (imagePreview()) {
              <img [src]="imagePreview()" class="h-48 w-full object-cover mx-auto rounded-xl shadow-md">
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none">
                <span class="text-white font-bold"><i class="fa-solid fa-pen mr-2"></i>تغییر تصویر</span>
              </div>
            } @else {
              <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-500 dark:text-indigo-300">
                <i class="fa-solid fa-image text-2xl"></i>
              </div>
              <p class="text-sm font-bold text-indigo-900 dark:text-indigo-200">تصویر را اینجا رها کنید</p>
              <p class="text-xs text-indigo-500 dark:text-indigo-400 mt-1">یا برای آپلود کلیک کنید</p>
            }
          </div>

          <button 
            (click)="analyzeImage()" 
            [disabled]="!imagePreview() || isLoading()"
            class="w-full bg-indigo-600 text-white py-4 rounded-full font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            @if (isLoading()) {
              <i class="fa-solid fa-circle-notch fa-spin"></i>
            } @else {
              <span>تحلیل با هوش مصنوعی</span>
              <i class="fa-solid fa-arrow-left"></i>
            }
          </button>

          @if (aiResult()) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm dir-rtl text-right animate-fade-in">
              <h3 class="font-bold mb-3 text-indigo-600 dark:text-indigo-400 text-lg border-b border-slate-100 dark:border-slate-700 pb-2">نتایج تحلیل</h3>
              <div [innerHTML]="aiResult()"></div>
            </div>
          }
        </div>
      </div>

      <!-- FAB (Save Action) -->
      <div class="fixed bottom-24 left-6 z-40">
        <button (click)="savePatient()" class="w-16 h-16 bg-teal-600 text-white rounded-2xl shadow-xl shadow-teal-600/40 flex items-center justify-center text-2xl active:scale-90 transition-transform hover:rotate-90 duration-300">
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
      
      <!-- Spacer for FAB -->
      <div class="h-10"></div>

    </div>
  `,
  imports: [FormsModule, NgClass]
})
export class HomeComponent {
  store = inject(VetStoreService);
  gemini = inject(GeminiService);

  // Form State
  species = signal<string>('dog');
  name = signal('');
  breed = signal('');
  weight = signal<number | null>(null);
  age = signal<number | null>(null);
  sex = signal<string>('');
  isSterilized = signal<boolean>(false);
  
  // Vaccination State
  vaccineType = signal<string>('');
  vacDay = signal<number | null>(null);
  vacMonth = signal<number | null>(null);
  vacYear = signal<number | null>(null);
  vaccineStatus = signal<'Valid' | 'Expired' | 'Unknown'>('Unknown');
  vaccineStatusMessage = signal<string>('');

  // Deworming State
  dewormerType = signal<string>('');
  dewormDay = signal<number | null>(null);
  dewormMonth = signal<number | null>(null);
  dewormYear = signal<number | null>(null);
  dewormingStatus = signal<'Valid' | 'Expired' | 'Unknown'>('Unknown');
  dewormingStatusMessage = signal<string>('');

  symptoms = signal('');
  
  // Image State
  imagePreview = signal<string | null>(null);
  aiResult = signal<string | null>(null);
  isLoading = signal(false);

  // Autocomplete State
  filteredBreeds = signal<BaseBreed[]>([]);
  showBreedSuggestions = signal(false);

  // Persian Calendar Data
  days = Array.from({length: 31}, (_, i) => i + 1);
  months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  years = Array.from({length: 15}, (_, i) => 1404 - i);

  // Expanded Species List with Icons
  speciesList = [
    { id: 'dog', label: 'سگ', icon: 'fa-solid fa-dog' },
    { id: 'cat', label: 'گربه', icon: 'fa-solid fa-cat' },
    { id: 'bird', label: 'پرندگان', icon: 'fa-solid fa-dove' },
    { id: 'rodent', label: 'جوندگان و خرگوش', icon: 'fa-solid fa-otter' },
    { id: 'reptile', label: 'خزندگان', icon: 'fa-solid fa-staff-snake' },
    { id: 'aquatic', label: 'آبزیان', icon: 'fa-solid fa-fish' },
    { id: 'amphibian', label: 'دوزیستان', icon: 'fa-solid fa-frog' },
    { id: 'horse', label: 'اسب', icon: 'fa-solid fa-horse' },
    { id: 'small_ruminant', label: 'گوسفند و بز', icon: 'fa-solid fa-paw' },
    { id: 'cow', label: 'گاو', icon: 'fa-solid fa-cow' },
  ];

  setSpecies(id: string) {
    this.species.set(id);
    this.breed.set(''); // Reset breed when species changes
    this.filteredBreeds.set([]);
  }

  // Breed Autocomplete Logic
  getCurrentSpeciesBreeds(): BaseBreed[] {
    switch (this.species()) {
      case 'dog': return dogBreeds;
      case 'cat': return catBreeds;
      case 'bird': return birdBreeds;
      case 'reptile': return reptileBreeds;
      case 'aquatic': return fishBreeds;
      case 'amphibian': return amphibianBreeds;
      case 'rodent': return mammalBreeds;
      case 'horse': return horseBreeds;
      case 'cow': return cowBreeds;
      case 'small_ruminant': return smallRuminantBreeds;
      default: return []; 
    }
  }

  onBreedInput(val: string) {
    this.breed.set(val);
    if (!val) {
      this.filteredBreeds.set([]);
      this.showBreedSuggestions.set(false);
      return;
    }

    const allBreeds = this.getCurrentSpeciesBreeds();
    const lowerVal = val.toLowerCase();
    
    const results = allBreeds.filter(b => 
      b.name.fa.includes(val) || 
      b.name.en.toLowerCase().includes(lowerVal)
    ).slice(0, 10); // Limit to 10 suggestions

    this.filteredBreeds.set(results);
    this.showBreedSuggestions.set(results.length > 0);
  }

  onBreedFocus() {
    // Show top suggestions if field is empty, or filter if has value
    const val = this.breed();
    const allBreeds = this.getCurrentSpeciesBreeds();
    
    if (!val) {
      this.filteredBreeds.set(allBreeds.slice(0, 10)); // Show top 10 initially
      this.showBreedSuggestions.set(allBreeds.length > 0);
    } else {
      this.onBreedInput(val);
    }
  }

  selectBreed(b: BaseBreed) {
    this.breed.set(b.name.fa);
    this.showBreedSuggestions.set(false);
  }

  closeSuggestions() {
    // Delay slightly to allow click event on suggestion to fire first
    setTimeout(() => {
        this.showBreedSuggestions.set(false);
    }, 200);
  }

  checkVaccineStatus() {
      const d = this.vacDay();
      const m = this.vacMonth();
      const y = this.vacYear();

      if (!d || !m || !y) {
          this.vaccineStatus.set('Unknown');
          this.vaccineStatusMessage.set('');
          return;
      }
      
      try {
        const gDate = toGregorian(y, m, d);
        const lastVac = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastVac.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Assume 1 year validity (365 days)
        if (diffDays <= 365) {
            this.vaccineStatus.set('Valid');
            this.vaccineStatusMessage.set('حیوان واکسینه شده است.');
        } else {
            this.vaccineStatus.set('Expired');
            this.vaccineStatusMessage.set('از واکسیناسیون مدت زیادی می‌گذرد. نیاز به یادآور.');
        }
      } catch (e) {
         console.error('Date conversion error', e);
         this.vaccineStatus.set('Unknown');
      }
  }

  checkDewormingStatus() {
      const d = this.dewormDay();
      const m = this.dewormMonth();
      const y = this.dewormYear();

      if (!d || !m || !y) {
          this.dewormingStatus.set('Unknown');
          this.dewormingStatusMessage.set('');
          return;
      }
      
      try {
        const gDate = toGregorian(y, m, d);
        const lastDeworm = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastDeworm.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Assume 3 months validity (90 days) for deworming
        if (diffDays <= 90) {
            this.dewormingStatus.set('Valid');
            this.dewormingStatusMessage.set('انگل‌تراپی معتبر است.');
        } else {
            this.dewormingStatus.set('Expired');
            this.dewormingStatusMessage.set('نیاز به تکرار انگل‌تراپی.');
        }
      } catch (e) {
        console.error('Date conversion error', e);
        this.dewormingStatus.set('Unknown');
      }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async analyzeImage() {
    if (!this.imagePreview()) return;
    
    this.isLoading.set(true);
    const vacDateStr = this.vacYear() ? `${this.vacYear()}/${this.vacMonth()}/${this.vacDay()}` : 'N/A';
    const dewormDateStr = this.dewormYear() ? `${this.dewormYear()}/${this.dewormMonth()}/${this.dewormDay()}` : 'N/A';

    const systemPrompt = `
**موقعیت (Situation)**
شما یک سیستم هوش مصنوعی دامپزشکی تخصصی هستید که در یک برنامه موبایل یا وب یکپارچه شده‌اید. کاربران این برنامه دامپزشکان، تکنسین‌های رادیولوژی دامپزشکی یا متخصصان بهداشت و درمان دامی هستند که نیاز به تحلیل سریع و دقیق تصاویر پزشکی حیوانات دارند.

**وظیفه (Task)**
دستیار باید تصاویر رادیولوژی و آزمایشگاهی ارسال شده از حیوانات را دریافت، تحلیل و تفسیر کند. سپس باید عوارض، ناهنجاری‌ها یا یافته‌های بالینی قابل مشاهده را شناسایی و گزارش دهد.

**هدف (Objective)**
هدف ارائه یک تشخیص اولیه دقیق و قابل اعتماد از تصاویر پزشکی حیوانات است تا به تصمیم‌گیری بالینی دامپزشکان کمک کند و فرآیند تشخیص را تسهیل نماید.

**دانش (Knowledge)**
- دستیار باید انواع تصاویر پزشکی دامپزشکی شامل اشعه ایکس (X-Ray)، سی‌تی اسکن (CT Scan)، ام‌آر‌آی (MRI)، سونوگرافی (Ultrasound)، و تصاویر میکروسکوپی آزمایشگاهی را تشخیص دهد
- دستیار باید ساختارهای آناتومیک طبیعی گونه‌های مختلف حیوانات (سگ، گربه، اسب، گاو، پرندگان و سایر حیوانات) را از ناهنجاری‌ها تفکیک کند
- دستیار باید تفاوت‌های آناتومیک و فیزیولوژیک بین گونه‌های مختلف را در نظر بگیرد
- دستیار باید سطح اطمینان تشخیص خود را مشخص کند (بالا، متوسط، پایین)
- دستیار باید هشدارهای لازم را در مورد یافته‌های اورژانسی ارائه دهد
- دستیار باید محدودیت‌های خود را بشناسد و در صورت نیاز به مشاوره دامپزشک متخصص توصیه کند
- دستیار باید اصطلاحات تخصصی دامپزشکی را به کار برد و تفسیرها را برای دامپزشکان حرفه‌ای ارائه دهد

**دستورالعمل‌های رفتاری**
1. دستیار باید ابتدا گونه حیوان، نوع تصویر پزشکی (مثلاً رادیوگرافی قفسه سینه، سی‌تی اسکن مغز) و ناحیه آناتومیک را شناسایی کند
2. دستیار باید کیفیت تصویر را ارزیابی کند و در صورت نامناسب بودن، درخواست تصویر با کیفیت بهتر نماید
3. دستیار باید یافته‌های طبیعی و غیرطبیعی را با در نظر گرفتن ویژگی‌های خاص گونه مورد نظر به صورت جداگانه فهرست کند
4. دستیار باید برای هر عارضه یا ناهنجاری شناسایی شده، توضیحات بالینی دامپزشکی مختصر و تخصصی ارائه دهد
5. دستیار باید خروجی را در قالب JSON ساختاریافته با فیلدهای زیر ارائه دهد:
   - animal_species: گونه حیوان
   - image_type: نوع تصویر
   - anatomical_region: ناحیه آناتومیک
   - image_quality: کیفیت تصویر (عالی/خوب/متوسط/ضعیف)
   - normal_findings: یافته‌های طبیعی (لیست رشته)
   - abnormal_findings: آرایه‌ای از عوارض شامل (finding، description، severity، confidence_level)
   - urgent_flags: هشدارهای فوری (true/false)
   - recommendations: توصیه‌های بالینی دامپزشکی (لیست رشته)
   - limitations: محدودیت‌های تشخیص

**محدودیت‌ها و ملاحظات**
- دستیار نباید به جای دامپزشک تصمیم نهایی بگیرد بلکه باید به عنوان ابزار کمکی عمل کند
- دستیار باید در صورت عدم اطمینان کافی (کمتر از 70%)، صراحتاً به نیاز مشاوره دامپزشک متخصص اشاره کند
- دستیار باید از ارائه تشخیص قطعی در موارد پیچیده یا مبهم خودداری کند
- دستیار باید رعایت اصول اخلاق حرفه‌ای دامپزشکی و حفظ حریم خصوصی اطلاعات بیمار (حیوان و مالک) را در اولویت قرار دهد

تمام خروجی های متنی داخل JSON باید به زبان فارسی باشد.
`;

    const patientContext = `
اطلاعات بیمار:
گونه: ${this.species()}
نژاد: ${this.breed() || 'نامشخص'}
جنسیت: ${this.sex() === 'Male' ? 'نر' : this.sex() === 'Female' ? 'ماده' : 'نامشخص'}
وضعیت عقیم‌سازی: ${this.isSterilized() ? 'عقیم شده' : 'عقیم نشده'}
سن: ${this.age() || 'نامشخص'}
وزن: ${this.weight() || 'نامشخص'} kg
وضعیت واکسیناسیون: ${this.vaccineType()} (${this.vaccineStatusMessage()} - Date: ${vacDateStr})
وضعیت انگل‌تراپی: ${this.dewormerType()} (${this.dewormingStatusMessage()} - Date: ${dewormDateStr})
علائم بالینی: ${this.symptoms()}

لطفا تصویر را تحلیل کنید و خروجی JSON را تولید نمایید.
`;

    const fullPrompt = systemPrompt + "\n" + patientContext;
    
    try {
        const result = await this.gemini.analyzeImage(this.imagePreview()!, fullPrompt);
        this.aiResult.set(this.formatAiResult(result));
    } catch(e) {
        this.aiResult.set('خطا در تحلیل تصویر.');
    } finally {
        this.isLoading.set(false);
    }
  }

  formatAiResult(rawText: string): string {
    try {
      let jsonStr = rawText;
      // remove markdown code blocks
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const data = JSON.parse(jsonStr);
      
      let html = '';
      
      if (data.urgent_flags) {
        html += `<div class="bg-red-50 text-red-700 p-3 rounded-xl mb-4 border border-red-200 font-bold flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation"></i> هشدار فوری: وضعیت نیازمند توجه ویژه است.</div>`;
      }

      html += `<div class="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">گونه:</strong> ${data.animal_species}</div>
        <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">تصویر:</strong> ${data.image_type}</div>
        <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">ناحیه:</strong> ${data.anatomical_region}</div>
        <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">کیفیت:</strong> ${data.image_quality}</div>
      </div>`;

      if (data.abnormal_findings && data.abnormal_findings.length > 0) {
        html += `<h4 class="font-bold text-red-600 dark:text-red-400 mb-2 border-b border-red-100 dark:border-red-900/30 pb-1">یافته‌های غیرطبیعی:</h4><ul class="space-y-3 mb-4">`;
        data.abnormal_findings.forEach((item: any) => {
           html += `<li class="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
              <div class="flex justify-between items-center mb-1">
                 <span class="font-bold text-red-800 dark:text-red-200">${item.finding}</span>
                 <span class="text-[10px] px-2 py-0.5 rounded-full ${this.getSeverityClass(item.severity)}">${item.severity}</span>
              </div>
              <p class="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">${item.description}</p>
              <div class="text-[10px] text-slate-400 text-left dir-ltr">Confidence: ${item.confidence_level}</div>
           </li>`;
        });
        html += `</ul>`;
      } else {
         html += `<p class="text-green-600 dark:text-green-400 font-bold mb-4 flex items-center gap-2"><i class="fa-solid fa-check-circle"></i> هیچ یافته غیرطبیعی واضحی مشاهده نشد.</p>`;
      }

      if (data.normal_findings && data.normal_findings.length > 0) {
        html += `<h4 class="font-bold text-teal-600 dark:text-teal-400 mb-2 border-b border-teal-100 dark:border-teal-900/30 pb-1">یافته‌های طبیعی:</h4><ul class="list-disc list-inside mb-4 text-xs text-slate-700 dark:text-slate-300 space-y-1">`;
        data.normal_findings.forEach((f: string) => html += `<li>${f}</li>`);
        html += `</ul>`;
      }

      if (data.recommendations && data.recommendations.length > 0) {
         html += `<h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2 border-b border-blue-100 dark:border-blue-900/30 pb-1">توصیه‌ها:</h4><ul class="list-decimal list-inside mb-4 text-xs text-slate-700 dark:text-slate-300 space-y-1">`;
         data.recommendations.forEach((r: string) => html += `<li>${r}</li>`);
         html += `</ul>`;
      }

      if (data.limitations) {
         html += `<div class="text-[10px] text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-700 pt-2 leading-relaxed"><strong>محدودیت‌ها:</strong> ${data.limitations}</div>`;
      }

      return html;

    } catch (e) {
      console.error("JSON Parse Error", e);
      return rawText.replace(/\n/g, '<br>');
    }
  }

  getSeverityClass(severity: string): string {
     if (!severity) return 'bg-slate-200 text-slate-800';
     const s = severity.toLowerCase();
     if (s.includes('high') || s.includes('severe') || s.includes('شدید')) return 'bg-red-200 text-red-900';
     if (s.includes('medium') || s.includes('moderate') || s.includes('متوسط')) return 'bg-orange-200 text-orange-900';
     return 'bg-green-200 text-green-900';
  }

  savePatient() {
    if (!this.weight() || !this.name()) {
      this.store.showNotification('لطفا حداقل نام و وزن حیوان را وارد کنید.', 'error');
      return;
    }

    const vacDateStr = (this.vacYear() && this.vacMonth() && this.vacDay()) 
        ? `${this.vacYear()}/${this.vacMonth()}/${this.vacDay()}` 
        : '';
        
    const dewormDateStr = (this.dewormYear() && this.dewormMonth() && this.dewormDay())
        ? `${this.dewormYear()}/${this.dewormMonth()}/${this.dewormDay()}`
        : '';

    const patient: Patient = {
      id: Date.now().toString(),
      name: this.name(),
      species: this.species(),
      breed: this.breed(),
      weight: this.weight()!,
      age: this.age() || 0,
      sex: this.sex(),
      isSterilized: this.isSterilized(),
      
      vaccineType: this.vaccineType(),
      vaccinationDate: vacDateStr,
      vaccinationStatus: this.vaccineStatusMessage(),

      dewormerType: this.dewormerType(),
      dewormingDate: dewormDateStr,
      dewormingStatus: this.dewormingStatusMessage(),

      symptoms: this.symptoms(),
      diagnosis: this.aiResult() || undefined,
      date: new Date().toLocaleDateString('fa-IR')
    };

    this.store.setPatient(patient);
    this.store.addPatient(patient);
    this.store.showNotification('اطلاعات بیمار ذخیره شد.', 'success');
  }
}

// Inline Pipe for formatting
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatLineBreaks', standalone: true })
export class FormatLineBreaksPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
  }
}