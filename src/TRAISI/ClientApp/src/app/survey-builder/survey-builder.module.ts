import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import {ROUTES} from "../survey-builder/survey-builder.routes";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTES,
  ],
  declarations: [SurveyBuilderComponent]
})
export class SurveyBuilderModule { }
