import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import {ROUTES} from "../survey-builder/survey-builder.routes";
import {SharedModule} from "../shared/shared.module";
import { NestedDragAndDropListComponent } from './nested-drag-and-drop-list/nested-drag-and-drop-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTES,
  ],
  declarations: [SurveyBuilderComponent, NestedDragAndDropListComponent]
})
export class SurveyBuilderModule { }
