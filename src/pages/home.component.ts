import { Component, inject, signal } from '@angular/core';
import { VetStoreService, Patient } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `
    <div class="space-y-6 animate-fade-in">
      
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
                  (click)="species.set(s.id)"
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

            <div class="col-span-1 group">
              <div class="bg-white dark:bg-slate-800 rounded-t-2xl px-4 pt-3 pb-1 border-b-2 border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 transition-colors">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">نژاد</label>
                <input [(ngModel)]="breed" type="text" class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none placeholder-transparent">
              </div>
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
  symptoms = signal('');
  
  // Image State
  imagePreview = signal<string | null>(null);
  aiResult = signal<string | null>(null);
  isLoading = signal(false);

  // Expanded Species List with Icons
  speciesList = [
    { id: 'dog', label: 'سگ', icon: 'fa-solid fa-dog' },
    { id: 'cat', label: 'گربه', icon: 'fa-solid fa-cat' },
    { id: 'bird', label: 'پرندگان', icon: 'fa-solid fa-dove' },
    { id: 'reptile', label: 'خزندگان', icon: 'fa-solid fa-staff-snake' },
    { id: 'aquatic', label: 'آبزیان', icon: 'fa-solid fa-fish' },
    { id: 'amphibian', label: 'دوزیستان', icon: 'fa-solid fa-frog' },
    { id: 'horse', label: 'اسب', icon: 'fa-solid fa-horse' },
    { id: 'small_ruminant', label: 'گوسفند و بز', icon: 'fa-solid fa-paw' },
    { id: 'cow', label: 'گاو', icon: 'fa-solid fa-cow' },
  ];

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
    const prompt = `
      Analyze this veterinary image. 
      Identify any visible abnormalities, lesions, or fractures.
      Suggest differential diagnoses based on visual evidence.
      The animal is a ${this.species()} ${this.breed() ? ', breed: ' + this.breed() : ''}.
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

    const patient: Patient = {
      id: Date.now().toString(),
      name: this.name(),
      species: this.species(),
      breed: this.breed(),
      weight: this.weight()!,
      age: this.age() || 0,
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