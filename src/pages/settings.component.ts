import { Component, inject, signal, computed } from '@angular/core';
import { VetStoreService, AppTheme } from '../services/vet-store.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  template: `
    <div class="min-h-screen pb-28 animate-fade-in relative">
      
      <!-- Header -->
      <header class="sticky top-0 z-10 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 mb-6">
        <div class="flex items-center justify-center p-4">
          <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-white">{{ store.t().settings }}</h1>
        </div>
      </header>

      <main class="px-4 space-y-8 max-w-2xl mx-auto">
        
        <!-- Profile Section -->
        @if (store.user()) {
          <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div class="flex items-center gap-4 mb-4">
              <!-- Avatar -->
              <div class="shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 flex items-center justify-center text-2xl font-black text-teal-700 dark:text-teal-200 overflow-hidden shadow-inner">
                 @if (store.user()?.photoUrl) {
                    <img [src]="store.user()?.photoUrl" class="w-full h-full object-cover">
                 } @else {
                    {{ getInitials(store.user()?.displayName) }}
                 }
              </div>
              <!-- Info -->
              <div class="grow text-start">
                <h2 class="text-xl font-extrabold text-slate-800 dark:text-white mb-0.5">{{ store.user()?.displayName || 'کاربر' }}</h2>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ store.user()?.email || store.user()?.phoneNumber }}</p>
                @if (store.user()?.medicalCode) {
                   <p class="text-[10px] text-slate-400 mt-1 font-mono">Code: {{ store.user()?.medicalCode }}</p>
                }
                <span class="inline-block mt-2 px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-[10px] font-bold rounded-md">
                   {{ store.isPremium() ? 'نسخه حرفه‌ای (DVM)' : 'نسخه رایگان' }}
                </span>
              </div>
            </div>
            
            <button 
              (click)="openEditProfile()" 
              class="w-full py-3 px-4 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:shadow-teal-600/30 active:scale-[0.98] transition-all"
            >
              <i class="fa-solid fa-user-pen mr-2"></i>
              ویرایش پروفایل
            </button>
          </div>
        } @else {
          <!-- Login Prompt (If no user) -->
          <div class="bg-teal-700 rounded-3xl p-6 text-center text-white shadow-xl shadow-teal-700/30 relative overflow-hidden">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <i class="fa-solid fa-shield-cat text-4xl mb-3 relative z-10"></i>
             <h2 class="text-lg font-black mb-1 relative z-10">{{ store.t().login_required }}</h2>
             <p class="text-xs opacity-90 mb-4 relative z-10">{{ store.t().login_msg }}</p>
             <button (click)="router.navigate(['/login'])" class="bg-white text-teal-800 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform w-full relative z-10">
                {{ store.t().login_btn }}
             </button>
          </div>
        }

        <!-- General Settings -->
        <section>
          <h3 class="px-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">عمومی</h3>
          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
            
            <!-- Language -->
            <button (click)="store.toggleLanguage()" class="w-full flex items-center p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                <i class="fa-solid fa-globe"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">زبان برنامه</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">تغییر زبان رابط کاربری</p>
              </div>
              <div class="flex items-center gap-2 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                 <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ store.currentLanguage() === 'fa' ? 'فارسی' : 'English' }}</span>
                 <i class="fa-solid fa-chevron-left text-xs"></i>
              </div>
            </button>

            <div class="border-t border-slate-100 dark:border-slate-700 mx-4"></div>

            <!-- Theme -->
            <button (click)="cycleTheme()" class="w-full flex items-center p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                <i class="fa-solid fa-circle-half-stroke"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">{{ store.t().theme }}</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">حالت شب و روز</p>
              </div>
              <div class="flex items-center gap-2 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                 <span class="text-xs font-bold text-slate-600 dark:text-slate-300">
                    @switch(store.theme()) {
                        @case('light') { {{ store.t().theme_light }} }
                        @case('dark') { {{ store.t().theme_dark }} }
                        @case('system') { {{ store.t().theme_system }} }
                    }
                 </span>
                 <i class="fa-solid fa-chevron-left text-xs"></i>
              </div>
            </button>

          </div>
        </section>

        <!-- Notifications Settings -->
        <section>
          <h3 class="px-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">اعلانات</h3>
          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
            
            <!-- Push Toggle -->
            <div class="w-full flex items-center p-4 text-start">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 rounded-full text-orange-600 dark:text-orange-400">
                <i class="fa-solid fa-bell"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">اعلانات برنامه</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">دریافت پیام‌های مهم</p>
              </div>
              <div class="shrink-0">
                 <!-- Custom Toggle -->
                 <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" [checked]="pushEnabled()" (change)="pushEnabled.set(!pushEnabled())">
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600 dir-ltr"></div>
                 </label>
              </div>
            </div>

            <div class="border-t border-slate-100 dark:border-slate-700 mx-4"></div>

            <!-- Email Toggle -->
            <div class="w-full flex items-center p-4 text-start">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-pink-50 dark:bg-pink-900/20 rounded-full text-pink-600 dark:text-pink-400">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">ایمیل خبرنامه</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">دریافت اخبار و مقالات</p>
              </div>
              <div class="shrink-0">
                 <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" [checked]="emailEnabled()" (change)="emailEnabled.set(!emailEnabled())">
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600 dir-ltr"></div>
                 </label>
              </div>
            </div>

          </div>
        </section>

        <!-- Data & Privacy -->
        <section>
          <h3 class="px-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">حریم خصوصی و داده‌ها</h3>
          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
             
             <!-- Sync -->
             <button class="w-full flex items-center p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                <i class="fa-solid fa-rotate"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">همگام‌سازی</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">ذخیره ابری اطلاعات</p>
              </div>
              <div class="flex items-center gap-2 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                 <span class="text-xs font-bold text-slate-600 dark:text-slate-300">خودکار</span>
                 <i class="fa-solid fa-chevron-left text-xs"></i>
              </div>
            </button>

            <div class="border-t border-slate-100 dark:border-slate-700 mx-4"></div>

            <!-- Privacy Policy -->
            <button (click)="openInfoView('privacy')" class="w-full flex items-center p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">سیاست حریم خصوصی</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">قوانین استفاده از داده‌ها</p>
              </div>
              <div class="shrink-0 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                 <i class="fa-solid fa-chevron-left text-xs"></i>
              </div>
            </button>

             <div class="border-t border-slate-100 dark:border-slate-700 mx-4"></div>

            <!-- Terms -->
            <button (click)="openInfoView('terms')" class="w-full flex items-center p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
                <i class="fa-solid fa-file-contract"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">قوانین و مقررات</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">شرایط سرویس‌دهی</p>
              </div>
              <div class="shrink-0 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                 <i class="fa-solid fa-chevron-left text-xs"></i>
              </div>
            </button>
          </div>
        </section>

        <!-- Calculator Defaults -->
        <section>
          <h3 class="px-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">پیش‌فرض‌های محاسبات</h3>
          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
             <button (click)="toggleWeightUnit()" class="w-full flex items-center p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600 dark:text-indigo-400">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <div class="grow mx-4">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">واحد وزن</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">واحد پیش‌فرض در فرم‌ها</p>
              </div>
              <div class="flex items-center gap-2 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                 <span class="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">{{ weightUnit() }}</span>
                 <i class="fa-solid fa-chevron-left text-xs"></i>
              </div>
            </button>
          </div>
        </section>

        <!-- Account Actions -->
        @if (store.user()) {
            <section>
              <h3 class="px-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">حساب کاربری</h3>
              <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
                <button (click)="store.logout()" class="w-full flex items-center p-4 text-start hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
                  <div class="shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                    <i class="fa-solid fa-right-from-bracket"></i>
                  </div>
                  <div class="grow mx-4">
                    <p class="font-bold text-sm text-red-600 dark:text-red-400">{{ store.t().logout }}</p>
                    <p class="text-[10px] text-red-400 dark:text-red-500/70 mt-0.5">خروج امن از حساب</p>
                  </div>
                </button>
              </div>
            </section>
        }

        <div class="text-center text-xs text-slate-400 font-medium pb-4">
          <p>Smart Vet Assistant <span class="dir-ltr inline-block">v1.2.0</span></p>
        </div>

      </main>

      <!-- EDIT PROFILE MODAL -->
      @if (showEditProfile()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" style="animation-duration: 0.2s;">
          <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col max-h-[90vh]">
            <h3 class="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 shrink-0">
              <i class="fa-solid fa-user-doctor text-teal-500"></i>
              تکمیل اطلاعات کاربری
            </h3>

            <div class="space-y-4 overflow-y-auto pr-1">
              <!-- Name -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">نام و نام خانوادگی (نمایشی)</label>
                <input [(ngModel)]="editForm.displayName" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 transition-colors" placeholder="مثلا: Dr. John Doe">
              </div>

               <!-- Medical Code -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">شماره نظام دامپزشکی / دانشجویی</label>
                <input [(ngModel)]="editForm.medicalCode" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 transition-colors dir-ltr text-left" placeholder="e.g. 12345">
              </div>

               <!-- Email -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">ایمیل</label>
                <input [(ngModel)]="editForm.email" type="email" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 transition-colors dir-ltr text-left">
              </div>

               <!-- University / Workplace -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">دانشگاه / محل کار</label>
                <input [(ngModel)]="editForm.workplace" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 transition-colors">
              </div>
            </div>

            <div class="flex gap-3 mt-8 shrink-0">
              <button (click)="showEditProfile.set(false)" class="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold transition-colors">انصراف</button>
              <button (click)="saveProfile()" class="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">ذخیره تغییرات</button>
            </div>
          </div>
        </div>
      }

      <!-- INFO MODAL (Privacy/Terms) -->
      @if (activeInfoView()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" style="animation-duration: 0.2s;">
          <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col max-h-[90vh]">
            @if (activeInfoView() === 'privacy') {
              <h3 class="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3 shrink-0">
                <i class="fa-solid fa-shield-halved text-blue-500"></i>
                سیاست حریم خصوصی
              </h3>
            } @else {
               <h3 class="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3 shrink-0">
                <i class="fa-solid fa-file-contract text-purple-500"></i>
                قوانین و مقررات
              </h3>
            }

            <div class="space-y-4 overflow-y-auto pr-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              @if (activeInfoView() === 'privacy') {
                <div class="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    ما به حریم خصوصی شما احترام می‌گذاریم. این سند نحوه جمع‌آوری، استفاده و محافظت از اطلاعات شما را هنگام استفاده از اپلیکیشن "دستیار هوشمند دامپزشک" تشریح می‌کند.
                  </p>
                  <h4>۱. اطلاعات جمع‌آوری شده</h4>
                  <ul>
                    <li><strong>اطلاعات کاربری:</strong> شامل نام، شماره تماس، ایمیل و اطلاعات پروفایل که برای ایجاد و مدیریت حساب شما استفاده می‌شود.</li>
                    <li><strong>اطلاعات بیمار:</strong> داده‌های مربوط به حیوانات (نام، گونه، وزن، علائم و ...) که توسط شما وارد می‌شود، به صورت محلی بر روی دستگاه شما ذخیره می‌گردد.</li>
                    <li><strong>داده‌های تحلیل هوشمند:</strong> تصاویر و پرامپت‌های متنی که برای تحلیل به Gemini API ارسال می‌شوند، تابع سیاست‌های حریم خصوصی گوگل هستند. ما این داده‌ها را بر روی سرورهای خود ذخیره نمی‌کنیم.</li>
                  </ul>
                  <h4>۲. نحوه استفاده از اطلاعات</h4>
                  <p>
                    اطلاعات شما برای ارائه خدمات اصلی برنامه، شخصی‌سازی تجربه کاربری و پشتیبانی فنی استفاده می‌شود. ما اطلاعات شخصی شما را با شخص ثالث به اشتراک نمی‌گذاریم، مگر با رضایت شما یا به حکم قانون.
                  </p>
                   <h4>۳. امنیت داده‌ها</h4>
                  <p>
                    تمام داده‌های حساس بیماران به صورت محلی (localStorage) روی دستگاه شما ذخیره می‌شوند و به سرورهای ما منتقل نمی‌شوند. این امر حداکثر کنترل و امنیت را برای شما فراهم می‌کند.
                  </p>
                </div>
              } @else {
                <div class="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    با استفاده از اپلیکیشن "دستیار هوشمند دامپزشک"، شما با قوانین و مقررات زیر موافقت می‌کنید.
                  </p>
                  <h4>۱. مسئولیت کاربر</h4>
                  <p>
                    شما مسئول صحت اطلاعات وارد شده در برنامه هستید. تصمیمات بالینی نهایی باید همیشه توسط دامپزشک مسئول و بر اساس قضاوت حرفه‌ای گرفته شود.
                  </p>
                  <h4>۲. محدودیت مسئولیت</h4>
                  <p>
                    ابزارهای محاسبه‌گر و تحلیل هوشمند این برنامه به عنوان یک ابزار کمکی طراحی شده‌اند و نباید جایگزین تشخیص و نظر تخصصی دامپزشک شوند. ما هیچ مسئولیتی در قبال خسارات ناشی از استفاده نادرست یا اتکای صرف به اطلاعات این برنامه را بر عهده نمی‌گیریم.
                  </p>
                  <h4>۳. مالکیت معنوی</h4>
                  <p>
                    تمامی حقوق مالکیت معنوی این اپلیکیشن متعلق به توسعه‌دهندگان آن است. هرگونه کپی‌برداری یا استفاده غیرمجاز از محتوا و کدهای برنامه پیگرد قانونی خواهد داشت.
                  </p>
                </div>
              }
            </div>

            <div class="mt-8 shrink-0">
              <button (click)="activeInfoView.set(null)" class="w-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold transition-colors">بستن</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  imports: [NgClass, FormsModule]
})
export class SettingsComponent {
  store = inject(VetStoreService);
  router = inject(Router);

  // Local state for UI toggles
  pushEnabled = signal(true);
  emailEnabled = signal(true);
  weightUnit = signal<'kg' | 'lbs'>('kg');
  
  // Edit Profile Modal State
  showEditProfile = signal(false);
  editForm = {
    displayName: '',
    email: '',
    medicalCode: '',
    workplace: ''
  };

  // Info Modal State (Privacy/Terms)
  activeInfoView = signal<'privacy' | 'terms' | null>(null);

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  cycleTheme() {
    const current = this.store.theme();
    const next: AppTheme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.store.setTheme(next);
  }

  toggleWeightUnit() {
    this.weightUnit.update(u => u === 'kg' ? 'lbs' : 'kg');
  }

  openEditProfile() {
    const u = this.store.user();
    if (u) {
        this.editForm = {
            displayName: u.displayName || '',
            email: u.email || '',
            medicalCode: u.medicalCode || '',
            workplace: u.workplace || ''
        };
        this.showEditProfile.set(true);
    }
  }

  saveProfile() {
    this.store.updateUser({
        displayName: this.editForm.displayName,
        email: this.editForm.email,
        medicalCode: this.editForm.medicalCode,
        workplace: this.editForm.workplace,
        isProfileComplete: true
    });
    this.showEditProfile.set(false);
    this.store.showNotification('اطلاعات کاربری با موفقیت بروزرسانی شد', 'success');
  }

  openInfoView(view: 'privacy' | 'terms') {
    this.activeInfoView.set(view);
  }
}