import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Select2Module } from 'ng2-select2';

import { ROUTES } from './account-management.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    ROUTES,
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useClass: TranslateLanguageLoader}
    })
  ],
  declarations: [
    UserPreferencesComponent,
    UserInfoComponent
  ],
  exports: [UserInfoComponent]
})

export class AccountManagementModule {
}
