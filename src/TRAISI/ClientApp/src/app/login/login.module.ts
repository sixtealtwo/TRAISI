import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { LoginComponent } from './login.component';
import { TranslateLanguageLoader } from '../services/app-translation.service';

export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useClass: TranslateLanguageLoader}
    })
  ]
})
export class LoginModule {
  static routes = routes;
}
