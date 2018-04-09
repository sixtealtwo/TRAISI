import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BootstrapSelectDirective } from '../directives/bootstrap-select.directive';
import { UserInfoComponent } from './user-info.component';
import { TranslateLanguageLoader } from '../services/app-translation.service';

export const routes = [
  { path: '', component: UserInfoComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useClass: TranslateLanguageLoader}
    })
  ],
  declarations: [UserInfoComponent, BootstrapSelectDirective]
})
export class UserInfoModule {
  static routes = routes;
}
