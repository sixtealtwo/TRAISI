import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemListComponent} from "./item-list/item-list.component";
import {SurveyService} from "../services/survey.service";
import {SurveyEndpointService} from "../services/survey-endpoint.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [SurveyEndpointService,SurveyService],
  declarations: [ItemListComponent],
  exports: [ItemListComponent]
})
export class SharedModule { }
