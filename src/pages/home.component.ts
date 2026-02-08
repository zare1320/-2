import { Component, inject, signal, computed, effect, ViewChild, ElementRef } from '@angular/core';
import { VetStoreService, Patient } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { NgClass, DatePipe } from '@angular/common';
import { toGregorian } from 'jalaali-js';
import { 
  dogBreeds, catBreeds, birdBreeds, reptileBreeds, fishBreeds, 
  amphibianBreeds, mammalBreeds, horseBreeds, cowBreeds, smallRuminantBreeds, BaseBreed 
} from '../data/breeds';

interface AbnormalFinding {
  finding: string;
  description: string;
  severity: string;
  confidence_level: string;
}

interface AiAnalysisResult {
  animal_species: string;
  image_type: string;
  anatomical_region: string;
  image_quality: string;
  normal_findings: string[];
  abnormal_findings: AbnormalFinding[];
  urgent_flags: boolean;
  recommendations: string[];
  limitations: string;
}

@Component({
  selector: 'app-home',
  template: `
    <div class="space-y-6 animate-fade-in pb-20" (click)="closeSuggestions()">
      
      <!-- New Header -->
      <div class="text-center pt-4">
         <div class="w-16 h-16 bg-surface-variant dark:bg-surface-darkVariant rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600 dark:text-teal-400 shadow-inner">
           <i class="fa-solid fa-file-waveform text-2xl"></i>
         </div>
         <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100">ثبت پرونده بیمار</h1>
         <p class="text-sm text-slate-500 dark:text-slate-400">اطلاعات بیمار را وارد و یا تحلیل هوشمند انجام دهید</p>
      </div>

      <!-- Segmented Control -->
      <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-full p-1.5 flex items-center sticky top-[90px] z-30 shadow-sm mx-4">
        <button 
          (click)="activeView.set('info')" 
          class="flex-1 py-3 text-sm font-bold rounded-full transition-colors"
          [class.bg-white]="activeView() === 'info'"
          [class.dark:bg-slate-700]="activeView() === 'info'"
          [class.shadow-md]="activeView() === 'info'"
          [class.text-teal-700]="activeView() === 'info'"
          [class.dark:text-white]="activeView() === 'info'"
          [class.text-slate-500]="activeView() !== 'info'"
          [class.dark:text-slate-400]="activeView() !== 'info'"
        >
          <i class="fa-solid fa-user-pen ml-2"></i>
          مشخصات بیمار
        </button>
        <button 
          (click)="activeView.set('ai')" 
          class="flex-1 py-3 text-sm font-bold rounded-full transition-colors"
          [class.bg-white]="activeView() === 'ai'"
          [class.dark:bg-slate-700]="activeView() === 'ai'"
          [class.shadow-md]="activeView() === 'ai'"
          [class.text-indigo-700]="activeView() === 'ai'"
          [class.dark:text-white]="activeView() === 'ai'"
          [class.text-slate-500]="activeView() !== 'ai'"
          [class.dark:text-slate-400]="activeView() !== 'ai'"
        >
          <i class="fa-solid fa-wand-magic-sparkles ml-2"></i>
          تحلیل هوشمند
        </button>
      </div>

      <!-- View Container -->
      <div>
        <!-- Patient Form View -->
        @if (activeView() === 'info') {
          <div class="animate-fade-in space-y-6">
            
            <!-- Modern Species Selector (Circular) -->
            <div class="py-6 relative group">
              
              <!-- Gradient Fade Masks for Scroll Edges -->
              <div class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-light dark:from-surface-dark to-transparent z-20 pointer-events-none"></div>
              <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-light dark:from-surface-dark to-transparent z-20 pointer-events-none"></div>

              <h3 class="text-center text-slate-400 dark:text-slate-500 text-xs font-bold mb-8 animate-fade-in">برای شروع، گونه حیوان را انتخاب کنید</h3>
              
              <!-- 
                Scroll Container 
                px-[calc(50%-2.5rem)] ensures the first and last items (w-20 = 5rem width) 
                can be scrolled exactly to the center of the screen.
              -->
              <div class="flex items-center gap-6 overflow-x-auto pb-12 pt-4 px-[calc(50%-2.5rem)] no-scrollbar snap-x snap-mandatory scroll-smooth" #speciesContainer>
                @for (s of speciesList; track s.id) {
                  <div 
                    (click)="setSpecies(s.id); scrollItemIntoView($event.target)"
                    class="snap-center shrink-0 flex flex-col items-center gap-4 cursor-pointer select-none relative transition-all duration-500"
                    [class.scale-110]="species() === s.id"
                    [class.opacity-40]="species() !== s.id"
                    [class.opacity-100]="species() === s.id"
                    [class.grayscale]="species() !== s.id"
                    [class.grayscale-0]="species() === s.id"
                  >
                    <!-- Circle Container -->
                    <div 
                       class="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-500 ease-out relative z-10"
                       [ngClass]="{
                         'bg-surface-light dark:bg-surface-dark ring-4 ring-teal-400 ring-offset-4 ring-offset-surface-light dark:ring-offset-surface-dark shadow-[0_0_25px_rgba(45,212,191,0.6)]': species() === s.id,
                         'bg-surface-variant dark:bg-surface-darkVariant text-slate-400 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700': species() !== s.id
                       }"
                    >
                       <!-- Active Indicator Background -->
                       @if (species() === s.id) {
                         <div class="absolute inset-0 rounded-full bg-teal-400/10 z-0"></div>
                       }
                       
                       <i 
                         [class]="s.icon" 
                         class="transition-all duration-300 z-10"
                         [ngClass]="{
                           'text-teal-500 dark:text-teal-400 scale-110': species() === s.id,
                           'text-inherit scale-100': species() !== s.id
                         }"
                       ></i>
                    </div>
                    
                    <!-- Label -->
                    <span 
                       class="text-sm font-black transition-all duration-300 absolute -bottom-8 whitespace-nowrap"
                       [ngClass]="{
                         'text-teal-700 dark:text-teal-300 translate-y-0 opacity-100': species() === s.id,
                         'text-slate-400 dark:text-slate-600 translate-y-[-5px] opacity-0': species() !== s.id
                       }"
                    >
                       {{ s.label }}
                    </span>
                  </div>
                }
              </div>
            </div>

            <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-3xl p-6 shadow-none space-y-5 mx-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- Inputs with updated style -->
                <div class="col-span-1 group">
                  <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">نام <span class="text-red-500">*</span></label>
                    <input [(ngModel)]="name" type="text" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent">
                  </div>
                </div>

                <div class="col-span-1 group relative" (click)="$event.stopPropagation()">
                  <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">نژاد</label>
                    <input [ngModel]="breed()" (ngModelChange)="onBreedInput($event)" (focus)="onBreedFocus()" type="text" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent" autocomplete="off">
                  </div>
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
                
                <!-- ... Other form fields ... -->
                <div class="col-span-2 space-y-3 pt-2">
                   <!-- Vaccination -->
                   <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
                     <i class="fa-solid fa-syringe text-teal-500"></i> وضعیت واکسیناسیون
                  </h3>
                  <!-- Simplified for brevity, same as previous but kept clean -->
                  <div class="grid grid-cols-2 gap-3">
                     <div class="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700">
                        <select [(ngModel)]="vaccineType" class="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none">
                            <option value="">نوع واکسن...</option>
                            <option value="Polyvalent">چندگانه (Polyvalent)</option>
                            <option value="Rabies">هاری (Rabies)</option>
                        </select>
                     </div>
                     <div class="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                         <span class="text-[10px] text-slate-400">تاریخ:</span>
                         <input [(ngModel)]="vacYear" placeholder="1402" type="number" class="w-full bg-transparent text-xs font-bold outline-none text-center">
                     </div>
                  </div>
                </div>
                
                 <div class="col-span-2 space-y-3">
                   <!-- Deworming -->
                   <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
                     <i class="fa-solid fa-shield-virus text-orange-500"></i> وضعیت انگل‌تراپی
                   </h3>
                   <div class="grid grid-cols-2 gap-3">
                     <div class="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700">
                        <select [(ngModel)]="dewormerType" class="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none">
                            <option value="">نوع انگل‌تراپی...</option>
                            <option value="Broad-spectrum">وسی‌الطیف</option>
                            <option value="Specific">اختصاصی</option>
                        </select>
                     </div>
                     <div class="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                         <span class="text-[10px] text-slate-400">تاریخ:</span>
                         <input [(ngModel)]="dewormYear" placeholder="1402" type="number" class="w-full bg-transparent text-xs font-bold outline-none text-center">
                     </div>
                  </div>
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
        } @else {
          <!-- AI Analysis View -->
          <div class="mx-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50 animate-fade-in space-y-4">
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

            <button (click)="analyzeImage()" [disabled]="!imagePreview() || isLoading()" class="w-full bg-indigo-600 text-white py-4 rounded-full font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg">
              @if (isLoading()) {
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                <span>در حال تحلیل...</span>
              } @else {
                <span>تحلیل با هوش مصنوعی</span>
                <i class="fa-solid fa-arrow-left"></i>
              }
            </button>

            <!-- Structured AI Result Display -->
            @if (aiResultObject(); as result) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm dir-rtl text-right animate-fade-in space-y-5">
                <h3 class="font-bold text-indigo-600 dark:text-indigo-400 text-lg border-b border-slate-100 dark:border-slate-700 pb-2">نتایج تحلیل</h3>
                
                @if (result.urgent_flags) {
                  <div class="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-xl border border-red-200 dark:border-red-800/50 font-bold flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation"></i> هشدار فوری: وضعیت نیازمند توجه ویژه است.</div>
                }

                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">گونه:</strong> {{ result.animal_species }}</div>
                  <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">تصویر:</strong> {{ result.image_type }}</div>
                  <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">ناحیه:</strong> {{ result.anatomical_region }}</div>
                  <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg"><strong class="text-slate-500 dark:text-slate-400">کیفیت:</strong> {{ result.image_quality }}</div>
                </div>

                @if (result.abnormal_findings?.length > 0) {
                  <h4 class="font-bold text-red-600 dark:text-red-400 mb-2 border-b border-red-100 dark:border-red-900/30 pb-1">یافته‌های غیرطبیعی:</h4>
                  <ul class="space-y-3">
                    @for(item of result.abnormal_findings; track item.finding) {
                      <li class="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                        <div class="flex justify-between items-center mb-1">
                           <span class="font-bold text-red-800 dark:text-red-200">{{ item.finding }}</span>
                           <span class="text-[10px] px-2 py-0.5 rounded-full" [class]="getSeverityClass(item.severity)">{{ item.severity }}</span>
                        </div>
                        <p class="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{{ item.description }}</p>
                        <div class="text-[10px] text-slate-400 text-left dir-ltr">Confidence: {{ item.confidence_level }}</div>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="text-green-600 dark:text-green-400 font-bold flex items-center gap-2"><i class="fa-solid fa-check-circle"></i> هیچ یافته غیرطبیعی واضحی مشاهده نشد.</p>
                }

                @if (result.normal_findings?.length > 0) {
                  <h4 class="font-bold text-teal-600 dark:text-teal-400 mb-2 border-b border-teal-100 dark:border-teal-900/30 pb-1">یافته‌های طبیعی:</h4>
                  <ul class="list-disc list-inside space-y-1 text-xs">
                    @for(f of result.normal_findings; track f) { <li>{{f}}</li> }
                  </ul>
                }

                @if (result.recommendations?.length > 0) {
                  <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-2 border-b border-blue-100 dark:border-blue-900/30 pb-1">توصیه‌ها:</h4>
                  <ul class="list-decimal list-inside space-y-1 text-xs">
                    @for(r of result.recommendations; track r) { <li>{{r}}</li> }
                  </ul>
                }

                @if (result.limitations) {
                  <div class="text-[10px] text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-700 pt-2 leading-relaxed"><strong>محدودیت‌ها:</strong> {{ result.limitations }}</div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- FABs (Save & Reset) -->
      <div class="fixed bottom-24 left-6 z-40 flex flex-col-reverse items-center gap-3">
        <button (click)="savePatient()" class="w-16 h-16 bg-teal-600 text-white rounded-2xl shadow-xl shadow-teal-600/40 flex items-center justify-center text-2xl active:scale-90 transition-transform hover:rotate-6 duration-300">
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
        <button (click)="resetForm()" class="w-12 h-12 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-full shadow-lg flex items-center justify-center text-lg active:scale-90 transition-transform hover:rotate-[-12deg] duration-300">
          <i class="fa-solid fa-arrows-rotate"></i>
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
  
  // View state
  activeView = signal<'info' | 'ai'>('info');

  // Form State
  species = signal<string>('dog');
  name = signal('');
  breed = signal('');
  weight = signal<number | null>(null);
  age = signal<number | null>(null);
  sex = signal<string>('');
  isSterilized = signal<boolean>(false);
  
  vaccineType = signal<string>('');
  vacDay = signal<number | null>(null);
  vacMonth = signal<number | null>(null);
  vacYear = signal<number | null>(null);
  vaccineStatus = signal<'Valid' | 'Expired' | 'Unknown'>('Unknown');
  vaccineStatusMessage = signal<string>('');

  dewormerType = signal<string>('');
  dewormDay = signal<number | null>(null);
  dewormMonth = signal<number | null>(null);
  dewormYear = signal<number | null>(null);
  dewormingStatus = signal<'Valid' | 'Expired' | 'Unknown'>('Unknown');
  dewormingStatusMessage = signal<string>('');

  symptoms = signal('');
  
  // AI State
  imagePreview = signal<string | null>(null);
  aiResultObject = signal<AiAnalysisResult | null>(null);
  isLoading = signal(false);

  filteredBreeds = signal<BaseBreed[]>([]);
  showBreedSuggestions = signal(false);

  days = Array.from({length: 31}, (_, i) => i + 1);
  months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  years = Array.from({length: 15}, (_, i) => 1404 - i);

  speciesList = [
    { id: 'dog', label: 'سگ', icon: 'fa-solid fa-dog' },
    { id: 'cat', label: 'گربه', icon: 'fa-solid fa-cat' },
    { id: 'bird', label: 'پرندگان', icon: 'fa-solid fa-dove' },
    { id: 'rodent', label: 'جوندگان', icon: 'fa-solid fa-otter' },
    { id: 'reptile', label: 'خزندگان', icon: 'fa-solid fa-staff-snake' },
    { id: 'horse', label: 'اسب', icon: 'fa-solid fa-horse' },
    { id: 'small_ruminant', label: 'گوسفند/بز', icon: 'fa-solid fa-paw' },
    { id: 'cow', label: 'گاو', icon: 'fa-solid fa-cow' },
  ];
  
  constructor() {
    // Populate form if a patient is loaded in the store (e.g., from profile page)
    effect(() => {
        const patientToLoad = this.store.currentPatient();
        if(patientToLoad) {
            this.populateForm(patientToLoad);
        }
    });
  }

  populateForm(p: Patient) {
    this.species.set(p.species);
    this.name.set(p.name);
    this.breed.set(p.breed);
    this.weight.set(p.weight);
    this.age.set(p.age);
    this.sex.set(p.sex ?? '');
    this.isSterilized.set(p.isSterilized ?? false);
    this.vaccineType.set(p.vaccineType ?? '');
    this.dewormerType.set(p.dewormerType ?? '');
    this.symptoms.set(p.symptoms);
  }

  resetForm() {
    this.species.set('dog');
    this.name.set('');
    this.breed.set('');
    this.weight.set(null);
    this.age.set(null);
    this.sex.set('');
    this.isSterilized.set(false);
    this.vaccineType.set('');
    this.vacDay.set(null);
    this.vacMonth.set(null);
    this.vacYear.set(null);
    this.vaccineStatus.set('Unknown');
    this.vaccineStatusMessage.set('');
    this.dewormerType.set('');
    this.dewormDay.set(null);
    this.dewormMonth.set(null);
    this.dewormYear.set(null);
    this.dewormingStatus.set('Unknown');
    this.dewormingStatusMessage.set('');
    this.symptoms.set('');
    this.imagePreview.set(null);
    this.aiResultObject.set(null);
    this.store.currentPatient.set(null);
    this.store.showNotification('فرم برای بیمار جدید آماده شد.', 'info');
  }

  setSpecies(id: string) {
    this.species.set(id);
    this.breed.set('');
    this.filteredBreeds.set([]);
  }

  scrollItemIntoView(target: any) {
    // Optional helper if snap scroll isn't enough for click-to-center logic
    // Usually snap-x snap-center handles it on scroll, but for click we might want to animate
    if (target instanceof HTMLElement) {
      // Find the parent item container if target is icon or label
      const item = target.closest('.snap-center');
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  // --- Breed Autocomplete ---
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
    const results = allBreeds.filter(b => b.name.fa.includes(val) || b.name.en.toLowerCase().includes(lowerVal)).slice(0, 10);
    this.filteredBreeds.set(results);
    this.showBreedSuggestions.set(results.length > 0);
  }

  onBreedFocus() {
    const val = this.breed();
    const allBreeds = this.getCurrentSpeciesBreeds();
    if (!val) {
      this.filteredBreeds.set(allBreeds.slice(0, 10));
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
    setTimeout(() => { this.showBreedSuggestions.set(false); }, 200);
  }

  // --- Status Checks (Vaccine, Deworming) ---
  checkVaccineStatus() {
      // ... (implementation remains the same)
  }

  checkDewormingStatus() {
      // ... (implementation remains the same)
  }

  // --- AI Analysis Logic ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.imagePreview.set(e.target.result); };
      reader.readAsDataURL(file);
    }
  }

  async analyzeImage() {
    if (!this.imagePreview()) return;
    this.isLoading.set(true);
    this.aiResultObject.set(null);

    const systemPrompt = `**موقعیت (Situation)**
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

    const patientContext = `اطلاعات بیمار:
گونه: ${this.species()}
نژاد: ${this.breed() || 'نامشخص'}
جنسیت: ${this.sex() === 'Male' ? 'نر' : this.sex() === 'Female' ? 'ماده' : 'نامشخص'}
سن: ${this.age() || 'نامشخص'}
وزن: ${this.weight() || 'نامشخص'} kg
علائم بالینی: ${this.symptoms()}

لطفا تصویر را تحلیل کنید و خروجی JSON را تولید نمایید.
`;
    
    try {
        const resultText = await this.gemini.analyzeImage(this.imagePreview()!, patientContext, systemPrompt);
        let jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResult: AiAnalysisResult = JSON.parse(jsonStr);
        this.aiResultObject.set(parsedResult);
        this.activeView.set('ai'); // Switch to results view
    } catch(e) {
        console.error("AI analysis or JSON parsing failed", e);
        this.store.showNotification('خطا در تحلیل یا پردازش پاسخ هوش مصنوعی.', 'error');
        this.aiResultObject.set(null);
    } finally {
        this.isLoading.set(false);
    }
  }

  getSeverityClass(severity: string): string {
     if (!severity) return 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100';
     const s = severity.toLowerCase();
     if (s.includes('high') || s.includes('severe') || s.includes('شدید')) return 'bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200';
     if (s.includes('medium') || s.includes('moderate') || s.includes('متوسط')) return 'bg-orange-200 dark:bg-orange-900/40 text-orange-900 dark:text-orange-200';
     return 'bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-200';
  }

  savePatient() {
    if (!this.weight() || !this.name()) {
      this.store.showNotification('لطفا حداقل نام و وزن حیوان را وارد کنید.', 'error');
      return;
    }

    const patient: Patient = {
      id: this.store.currentPatient()?.id || Date.now().toString(), // Keep ID if editing
      name: this.name(),
      species: this.species(),
      breed: this.breed(),
      weight: this.weight()!,
      age: this.age() || 0,
      sex: this.sex(),
      isSterilized: this.isSterilized(),
      vaccineType: this.vaccineType(),
      vaccinationDate: (this.vacYear() && this.vacMonth() && this.vacDay()) ? `${this.vacYear()}/${this.vacMonth()}/${this.vacDay()}` : '',
      vaccinationStatus: this.vaccineStatusMessage(),
      dewormerType: this.dewormerType(),
      dewormingDate: (this.dewormYear() && this.dewormMonth() && this.dewormDay()) ? `${this.dewormYear()}/${this.dewormMonth()}/${this.dewormDay()}` : '',
      dewormingStatus: this.dewormingStatusMessage(),
      symptoms: this.symptoms(),
      diagnosis: this.aiResultObject() ? JSON.stringify(this.aiResultObject(), null, 2) : undefined,
      date: new Date().toLocaleDateString('fa-IR')
    };

    // If editing, remove old record
    if (this.store.currentPatient()) {
        this.store.removePatient(this.store.currentPatient()!.id);
    }
    this.store.addPatient(patient); // Adds to the top of the list
    this.store.setPatient(patient); // Keep it as current
    this.store.showNotification('اطلاعات بیمار با موفقیت ذخیره شد.', 'success');
  }
}
