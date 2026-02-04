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

            <!-- Vaccination Section -->
            <div class="col-span-2 space-y-3 pt-2">
                <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
                   <i class="fa-solid fa-syringe text-teal-500"></i> وضعیت واکسیناسیون
                </h3>
                
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                   <div class="grid grid-cols-2 gap-1">
                      <!-- Vaccine Type Dropdown -->
                      <div class="relative bg-surface-variant dark:bg-surface-darkVariant rounded-xl px-3 py-2 flex flex-col justify-center">
                         <label class="text-[9px] font-bold text-slate-400 uppercase mb-1">نوع واکسن</label>
                         <select [(ngModel)]="vaccineType" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none relative z-10">
                            <option value="">انتخاب کنید...</option>
                            <option value="DHPPi">چندگانه (DHPPi)</option>
                            <option value="DHPPiL">چندگانه + لپتوسپیروز (DHPPi+L)</option>
                            <option value="Rabies">هاری (Rabies)</option>
                            <option value="Poly+Rabies">چندگانه + هاری</option>
                            <option value="Tricat">سه‌گانه گربه (Tricat)</option>
                            <option value="FeLV">لوسمی گربه (FeLV)</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                      </div>

                      <!-- Persian Date Picker Modern -->
                      <div class="relative bg-surface-variant dark:bg-surface-darkVariant rounded-xl px-3 py-2 flex flex-col justify-center dir-ltr">
                         <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 text-right w-full">تاریخ تزریق</label>
                         <div class="flex items-center justify-between gap-1 w-full">
                             <!-- Year -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="vacYear" (change)="checkVaccineStatus()" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected>سال</option>
                                  @for(y of years; track y) { <option [value]="y">{{y}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-300 text-xs">/</span>
                             <!-- Month -->
                             <div class="relative flex-[1.5] min-w-0">
                                <select [(ngModel)]="vacMonth" (change)="checkVaccineStatus()" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected>ماه</option>
                                  @for(m of months; track m; let i = $index) { <option [value]="i+1">{{m}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-300 text-xs">/</span>
                             <!-- Day -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="vacDay" (change)="checkVaccineStatus()" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected>روز</option>
                                  @for(d of days; track d) { <option [value]="d">{{d}}</option> }
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
                      <div class="relative bg-surface-variant dark:bg-surface-darkVariant rounded-xl px-3 py-2 flex flex-col justify-center">
                         <label class="text-[9px] font-bold text-slate-400 uppercase mb-1">نوع انگل‌تراپی</label>
                         <select [(ngModel)]="dewormerType" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none relative z-10">
                             <option value="">انتخاب کنید...</option>
                             <option value="Oral Tablet">قرص خوراکی</option>
                             <option value="Spot-on">قطره پشت گردنی</option>
                             <option value="Injectable">تزریقی</option>
                             <option value="Suspension">شربت ضد انگل</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                      </div>

                      <!-- Persian Date Picker Modern -->
                      <div class="relative bg-surface-variant dark:bg-surface-darkVariant rounded-xl px-3 py-2 flex flex-col justify-center dir-ltr">
                         <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 text-right w-full">تاریخ مصرف</label>
                         <div class="flex items-center justify-between gap-1 w-full">
                             <!-- Year -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="dewormYear" (change)="checkDewormingStatus()" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected>سال</option>
                                  @for(y of years; track y) { <option [value]="y">{{y}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-300 text-xs">/</span>
                             <!-- Month -->
                             <div class="relative flex-[1.5] min-w-0">
                                <select [(ngModel)]="dewormMonth" (change)="checkDewormingStatus()" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected>ماه</option>
                                  @for(m of months; track m; let i = $index) { <option [value]="i+1">{{m}}</option> }
                                </select>
                             </div>
                             <span class="text-slate-300 text-xs">/</span>
                             <!-- Day -->
                             <div class="relative flex-1 min-w-0">
                                <select [(ngModel)]="dewormDay" (change)="checkDewormingStatus()" class="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none appearance-none text-center p-0">
                                  <option value="" disabled selected>روز</option>
                                  @for(d of days; track d) { <option [value]="d">{{d}}</option> }
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
        <h2 class="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          تشخیص هوشمند
        </h2>

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
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
              <h3 class="font-bold mb-3 text-indigo-600 dark:text-indigo-400 text-lg border-b border-slate-100 dark:border-slate-700 pb-2">نتایج تحلیل</h3>
              <div [innerHTML]="aiResult() | formatLineBreaks"></div>
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
  imports: [FormsModule, NgClass],
  pipes: [] 
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

    const prompt = `
      Analyze this veterinary image. 
      Identify any visible abnormalities, lesions, or fractures.
      Suggest differential diagnoses based on visual evidence.
      The animal is a ${this.species()} ${this.breed() ? ', breed: ' + this.breed() : ''}.
      Vaccination Status: ${this.vaccineType()} (${this.vaccineStatusMessage()} - Date: ${vacDateStr}).
      Deworming Status: ${this.dewormerType()} (${this.dewormingStatusMessage()} - Date: ${dewormDateStr}).
      Clinical signs: ${this.symptoms()}.
      Respond in Persian (Farsi).
    `;
    
    const result = await this.gemini.analyzeImage(this.imagePreview()!, prompt);
    this.aiResult.set(result);
    this.isLoading.set(false);
  }

  savePatient() {
    if (!this.weight() || !this.name()) {
      alert('لطفا حداقل نام و وزن حیوان را وارد کنید.');
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
    alert('اطلاعات بیمار ذخیره شد.');
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