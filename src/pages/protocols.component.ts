import { Component, inject, signal, computed } from '@angular/core';
import { VetStoreService } from '../services/vet-store.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { protocolsDatabase, Protocol } from '../data/protocols-database';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-protocols',
  template: `
    <div class="space-y-6 animate-fade-in pb-20 min-h-screen">
      
      @if (!store.isPremium()) {
        <!-- Premium Lock View with Description -->
        <div class="flex flex-col items-center justify-center pt-8 px-4 animate-slide-up">

          <!-- Hero Icon -->
          <div class="w-24 h-24 bg-teal-100 dark:bg-teal-900/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner text-teal-600 dark:text-teal-400 rotate-3 transform hover:rotate-6 transition-transform duration-500">
             <i class="fa-solid fa-file-medical text-4xl"></i>
          </div>

          <!-- Section Title -->
          <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-4 text-center">پروتکل‌های درمانی</h2>

          <!-- Specific Description Text Required -->
          <p class="text-center text-sm font-medium text-slate-600 dark:text-slate-300 max-w-sm leading-8 mb-8">
            این بخش امکان جست‌وجو در مجموعه‌ای از بیماری‌ها، عارضه‌ها و علائم حیوانات را فراهم می‌کند و اطلاعات مربوط به روش‌های درمانی مختلف را در اختیار کاربر قرار می‌دهد.
          </p>

          <!-- Lock Card / CTA -->
          <div class="w-full max-w-sm bg-surface-variant dark:bg-surface-darkVariant rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
             
             <!-- Decorative Background Lock Icon -->
             <div class="absolute -right-6 -top-6 text-slate-200 dark:text-slate-700/30 text-9xl opacity-20 transform rotate-12 group-hover:rotate-6 transition-transform pointer-events-none">
                <i class="fa-solid fa-lock"></i>
             </div>

             <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                   <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <i class="fa-solid fa-crown"></i>
                   </div>
                   <div>
                      <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm">دسترسی ویژه (VIP)</h3>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400">بانک اطلاعاتی تخصصی</p>
                   </div>
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                   برای مشاهده جزئیات کامل پروتکل‌ها، دوز داروها و روش‌های تشخیص، لطفا اشتراک خود را فعال کنید.
                </p>

                <button (click)="handleUpgrade()" class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span>{{ store.user() ? 'خرید اشتراک ویژه' : 'ورود و خرید اشتراک' }}</span>
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
             </div>
          </div>

        </div>
      } @else {
        <!-- Main Content View (Accessible only for Premium Users) -->
        <div>
          <!-- Header and Search Bar -->
          <div class="sticky top-[85px] z-30 mb-6">
            <div class="bg-surface-variant/90 dark:bg-surface-darkVariant/90 backdrop-blur-md rounded-3xl p-4 shadow-lg shadow-black/5">
               <div class="relative">
                  <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                     <i class="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <input 
                     type="text" 
                     [(ngModel)]="searchTerm"
                     placeholder="جستجوی بیماری، علائم یا دارو..." 
                     class="w-full bg-white dark:bg-slate-800 rounded-full py-3 pr-10 pl-4 text-sm font-medium border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  >
               </div>
               
               <!-- Species Filters -->
               <div class="flex gap-2 overflow-x-auto pt-3 -mx-2 px-2 no-scrollbar">
                  <button (click)="selectedSpecies.set('all')" [class]="selectedSpecies() === 'all' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'" class="px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors shadow-sm">
                     همه
                  </button>
                  @for (s of speciesList; track s.id) {
                     <button (click)="selectedSpecies.set(s.id)" [class]="selectedSpecies() === s.id ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'" class="px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors shadow-sm flex items-center gap-2">
                        <i [class]="s.icon"></i>
                        <span>{{s.label}}</span>
                     </button>
                  }
               </div>
            </div>
          </div>

          <!-- LIST VIEW / DETAIL VIEW -->
          @if (selectedProtocol(); as protocol) {
            <!-- Detail View -->
            <div class="animate-fade-in">
                <button (click)="selectedProtocol.set(null)" class="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 hover:text-teal-600 transition-colors">
                   <i class="fa-solid fa-arrow-right"></i>
                   بازگشت به لیست نتایج
                </button>

                <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                   <h2 class="text-2xl font-black text-slate-800 dark:text-white">{{ protocol.name.fa }}</h2>
                   <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{{ protocol.name.en }}</p>
                   
                   <div class="space-y-2">
                      @for (section of getProtocolSections(protocol); track section.id) {
                         <div class="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
                            <button (click)="toggleAccordion(section.id)" class="w-full flex items-center justify-between p-4" [style.background-color]="section.color + '1A'" [style.color]="section.color">
                               <div class="flex items-center gap-3">
                                  <i [class]="section.icon" class="text-lg w-5 text-center"></i>
                                  <span class="font-bold text-sm">{{ section.title }}</span>
                               </div>
                               <i class="fa-solid fa-chevron-down transition-transform" [class.rotate-180]="activeAccordionSection() === section.id"></i>
                            </button>
                            @if (activeAccordionSection() === section.id) {
                              <div class="p-4 bg-surface-light dark:bg-surface-darkVariant text-xs leading-relaxed text-slate-700 dark:text-slate-300 animate-fade-in">
                                 <div [innerHTML]="section.content"></div>
                              </div>
                            }
                         </div>
                      }
                   </div>
                </div>
            </div>

          } @else {
            <!-- List View -->
            <div class="space-y-3 animate-fade-in">
               @if (filteredProtocols().length > 0) {
                  @for (p of filteredProtocols(); track p.id) {
                    <button (click)="selectProtocol(p)" class="w-full text-right bg-white dark:bg-slate-800 p-5 rounded-3xl flex items-center justify-between hover:bg-teal-50 dark:hover:bg-slate-700 transition-all group border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-800">
                        <div>
                           <h3 class="font-bold text-lg text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">{{ p.name.fa }}</h3>
                           <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{{ p.definition.substring(0, 100) }}...</p>
                        </div>
                        <div class="flex items-center gap-2">
                           <div class="flex -space-x-2 rtl:space-x-reverse">
                              @for(s of p.species.slice(0, 2); track s) {
                                 <div class="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 text-xs shadow-sm">
                                    <i [class]="getSpeciesIcon(s)"></i>
                                 </div>
                              }
                           </div>
                           <i class="fa-solid fa-chevron-left text-slate-400 group-hover:translate-x-[-4px] transition-transform"></i>
                        </div>
                    </button>
                  }
               } @else {
                  <div class="text-center pt-16">
                     <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                        <i class="fa-solid fa-file-circle-question text-3xl"></i>
                     </div>
                     <h3 class="font-bold text-slate-700 dark:text-slate-200">
                        {{ searchTerm() ? 'نتیجه‌ای یافت نشد' : 'جستجو را شروع کنید' }}
                     </h3>
                     <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {{ searchTerm() ? 'عبارت جستجو یا فیلترها را تغییر دهید.' : 'نام بیماری مورد نظر خود را وارد کنید.' }}
                     </p>
                  </div>
               }
            </div>
          }
        </div>
      }
    </div>
  `,
  imports: [FormsModule, NgClass]
})
export class ProtocolsComponent {
  store = inject(VetStoreService);
  router = inject(Router);

  allProtocols = signal<Protocol[]>(protocolsDatabase);
  searchTerm = signal('');
  selectedSpecies = signal('all');
  selectedProtocol = signal<Protocol | null>(null);
  activeAccordionSection = signal<string | null>('definition');

  speciesList = [
    { id: 'dog', label: 'سگ', icon: 'fa-solid fa-dog' },
    { id: 'cat', label: 'گربه', icon: 'fa-solid fa-cat' },
    { id: 'horse', label: 'اسب', icon: 'fa-solid fa-horse' }
  ];

  filteredProtocols = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const species = this.selectedSpecies();
    
    if (!term && species === 'all') {
      return this.allProtocols();
    }

    return this.allProtocols().filter(p => {
      const speciesMatch = species === 'all' || p.species.includes(species);
      
      const termMatch = !term || (
        p.name.en.toLowerCase().includes(term) ||
        p.name.fa.toLowerCase().includes(term) ||
        p.signs.some(s => s.toLowerCase().includes(term)) ||
        p.medications.primary.some(m => m.name.toLowerCase().includes(term))
      );

      return speciesMatch && termMatch;
    });
  });

  handleUpgrade() {
    if (!this.store.user()) {
      this.router.navigate(['/login']);
    } else {
      // In a real app, this would navigate to a subscription page
      this.store.togglePremium(); 
    }
  }

  selectProtocol(protocol: Protocol) {
    this.selectedProtocol.set(protocol);
    this.activeAccordionSection.set('definition'); // Auto-open first section
    window.scrollTo(0, 0);
  }

  toggleAccordion(sectionId: string) {
    this.activeAccordionSection.update(current => current === sectionId ? null : sectionId);
  }

  getSpeciesIcon(speciesId: string): string {
    const icons: { [key: string]: string } = {
      'dog': 'fa-solid fa-dog',
      'cat': 'fa-solid fa-cat',
      'horse': 'fa-solid fa-horse',
      'ferret': 'fa-solid fa-paw'
    };
    return icons[speciesId] || 'fa-solid fa-paw';
  }

  // Helper to structure protocol details for the accordion
  getProtocolSections(p: Protocol) {
    return [
      { id: 'definition', title: 'تعریف بیماری', icon: 'fa-solid fa-book-medical', color: '#0f766e', content: `<p>${p.definition}</p><p class="mt-2 text-xs"><strong>گونه(ها):</strong> ${p.signalment}</p>` },
      { id: 'signs', title: 'علائم بالینی', icon: 'fa-solid fa-stethoscope', color: '#4f46e5', content: `<ul>${p.signs.map(s => `<li>${s}</li>`).join('')}</ul>` },
      { id: 'diagnosis', title: 'تشخیص', icon: 'fa-solid fa-vial-virus', color: '#c026d3', content: `
          <h4 class="font-bold mb-1">تشخیص افتراقی:</h4><ul>${p.diagnosis.differential.map(s => `<li>${s}</li>`).join('')}</ul>
          <h4 class="font-bold mt-3 mb-1">آزمایش‌ها:</h4><ul>${p.diagnosis.lab_tests.map(s => `<li>${s}</li>`).join('')}</ul>
          <h4 class="font-bold mt-3 mb-1">تصویربرداری:</h4><ul>${p.diagnosis.imaging.map(s => `<li>${s}</li>`).join('')}</ul>` 
      },
      { id: 'treatment', title: 'درمان', icon: 'fa-solid fa-pills', color: '#16a34a', content: `
          <h4 class="font-bold mb-1">مراقبت‌های پرستاری:</h4><ul>${p.treatment.nursing_care.map(s => `<li>${s}</li>`).join('')}</ul>
          <h4 class="font-bold mt-3 mb-1">رژیم غذایی:</h4><p>${p.treatment.diet}</p>
          <h4 class="font-bold mt-3 mb-1">آموزش به صاحب حیوان:</h4><ul>${p.treatment.client_education.map(s => `<li>${s}</li>`).join('')}</ul>` 
      },
      { id: 'medications', title: 'داروها', icon: 'fa-solid fa-syringe', color: '#ea580c', content: `
          <h4 class="font-bold mb-1">داروهای انتخابی:</h4><ul>${p.medications.primary.map(s => `<li><strong>${s.name}:</strong> ${s.notes}</li>`).join('')}</ul>
          @if (p.medications.contraindicated.length > 0) {
            <h4 class="font-bold mt-3 mb-1 text-red-500">منع مصرف:</h4><ul>${p.medications.contraindicated.map(s => `<li><strong>${s.name}:</strong> ${s.notes}</li>`).join('')}</ul>
          }
          @if (p.medications.precautions.length > 0) {
            <h4 class="font-bold mt-3 mb-1">احتیاط‌ها:</h4><ul>${p.medications.precautions.map(s => `<li>${s}</li>`).join('')}</ul>
          }` 
      },
    ];
  }
}