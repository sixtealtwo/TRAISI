import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserPreferencesComponent } from './user-preferences.component';
import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Select2Module } from 'ng2-select2';

export const routes = [
  { path: '', component: UserPreferencesComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useClass: TranslateLanguageLoader}
    })
  ],
  declarations: [UserPreferencesComponent]
})
export class UserPreferencesModule {
  static routes = routes;
}
