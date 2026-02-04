import { Component, inject } from '@angular/core';
import { VetStoreService, Patient } from '../services/vet-store.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  template: `
    <div class="space-y-6 animate-fade-in pb-20">
      
      <div class="flex items-center justify-between px-2">
         <h2 class="text-2xl font-bold text-slate-800 dark:text-white">پرونده‌ها</h2>
         <span class="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-xs font-bold">{{ store.savedPatients().length }} بیمار</span>
      </div>

      @if (store.savedPatients().length === 0) {
        <div class="bg-surface-variant dark:bg-surface-darkVariant rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div class="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
             <i class="fa-regular fa-folder-open text-3xl"></i>
          </div>
          <p class="text-slate-500 dark:text-slate-400 font-bold">هنوز پرونده‌ای ثبت نشده است.</p>
          <button routerLink="/" class="mt-6 text-teal-600 font-bold text-sm">ایجاد پرونده جدید</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-4">
          @for (p of store.savedPatients(); track p.id) {
            <div class="bg-surface-variant dark:bg-surface-darkVariant p-5 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group relative">
              
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-300 text-xl">
                     @switch (p.species) {
                        @case('dog') { <i class="fa-solid fa-dog"></i> }
                        @case('cat') { <i class="fa-solid fa-cat"></i> }
                        @case('bird') { <i class="fa-solid fa-dove"></i> }
                        @case('reptile') { <i class="fa-solid fa-staff-snake"></i> }
                        @case('aquatic') { <i class="fa-solid fa-fish"></i> }
                        @case('amphibian') { <i class="fa-solid fa-frog"></i> }
                        @case('horse') { <i class="fa-solid fa-horse"></i> }
                        @case('cow') { <i class="fa-solid fa-cow"></i> }
                        @default { <i class="fa-solid fa-paw"></i> }
                     }
                  </div>
                  <div>
                    <h3 class="font-bold text-lg text-slate-800 dark:text-white">{{ p.name }}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ p.breed }} • {{ p.age }} ساله</p>
                  </div>
                </div>
                
                <div class="flex flex-col items-end gap-2">
                   <div class="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 px-2 py-1 rounded-lg">
                      {{ p.date }}
                   </div>
                   <!-- Delete Button -->
                   <button (click)="deletePatient(p.id, $event)" class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm relative z-20 cursor-pointer active:scale-95">
                      <i class="fa-solid fa-trash-can text-sm pointer-events-none"></i>
                   </button>
                </div>
              </div>

              <!-- Medical Status Chips -->
              <div class="space-y-2 mb-3">
                 @if (p.vaccineType) {
                    <div class="flex items-center justify-between bg-white dark:bg-slate-700/50 p-2 rounded-xl">
                        <div class="flex items-center gap-2">
                           <div class="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                               <i class="fa-solid fa-syringe text-xs"></i>
                           </div>
                           <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ p.vaccineType }}</span>
                        </div>
                        <span class="text-[10px] text-slate-500 dark:text-slate-400">{{ p.vaccinationDate }}</span>
                    </div>
                    @if(p.vaccinationStatus) {
                         <p class="text-[10px] text-slate-500 dark:text-slate-400 px-1">{{ p.vaccinationStatus }}</p>
                    }
                 }
                 
                 @if (p.dewormerType) {
                    <div class="flex items-center justify-between bg-white dark:bg-slate-700/50 p-2 rounded-xl">
                        <div class="flex items-center gap-2">
                           <div class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300">
                               <i class="fa-solid fa-shield-virus text-xs"></i>
                           </div>
                           <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ p.dewormerType }}</span>
                        </div>
                        <span class="text-[10px] text-slate-500 dark:text-slate-400">{{ p.dewormingDate }}</span>
                    </div>
                    @if(p.dewormingStatus) {
                         <p class="text-[10px] text-slate-500 dark:text-slate-400 px-1">{{ p.dewormingStatus }}</p>
                    }
                 }
              </div>

              @if (p.diagnosis) {
                 <div class="bg-white dark:bg-slate-700/50 rounded-xl p-3 mb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-700">
                   <strong class="text-teal-600 dark:text-teal-400 block mb-1">تشخیص هوشمند:</strong> 
                   {{ p.diagnosis.substring(0, 80) }}...
                 </div>
              }

              <div class="flex gap-2">
                <button (click)="loadPatient(p)" class="flex-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                   مشاهده
                </button>
                <button (click)="loadForCalc(p)" class="flex-1 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 py-3 rounded-xl text-xs font-bold hover:bg-teal-200 dark:hover:bg-teal-900/60 transition-colors">
                  <i class="fa-solid fa-calculator mr-1"></i> محاسبه دوز
                </button>
              </div>

            </div>
          }
        </div>
      }
    </div>
  `,
  imports: [NgClass]
})
export class ProfileComponent {
  store = inject(VetStoreService);
  router = inject(Router);

  loadPatient(p: Patient) {
    this.store.setPatient(p);
    this.router.navigate(['/']); 
  }

  loadForCalc(p: Patient) {
    this.store.setPatient(p);
    this.router.navigate(['/calculators']);
  }

  deletePatient(id: string, event: Event) {
    event.stopPropagation();
    if (window.confirm('آیا از حذف این پرونده اطمینان دارید؟\nاین عملیات غیرقابل بازگشت است.')) {
      this.store.removePatient(id);
    }
  }
}
