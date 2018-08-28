import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuestionContainerComponent} from "../components/question-container/question-container.component";
import {QuestionPlaceholderComponent} from "../components/question-placeholder/question-placeholder.component";
import {SurveyStartPageComponent} from "../components/survey-start-page/survey-start-page.component";
import {Survey} from "../../../admin-app/app/models/survey.model";
import {SurveyTermsPageComponent} from "../components/survey-terms-page/survey-terms-page.component";
import {SurveyViewerComponent} from "../components/survey-viewer/survey-viewer.component";
import {SurveyViewerContainerComponent} from "../components/survey-viewer-container/survey-viewer-container.component";
import {SurveyHeaderDisplayComponent} from "../components/survey-header-display/survey-header-display.component";
import {SurveyCompletePageComponent} from "../components/survey-complete-page/survey-complete-page.component";
import {SurveyErrorComponent} from "../components/survey-error/survey-error.component";
import {SurveyViewerService} from "../../../admin-app/app/survey-viewer/services/survey-viewer.service";
import {SurveyResponderService} from "../../../admin-app/app/survey-viewer/services/survey-responder.service";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  imports: [
	  BrowserModule,
	  HttpClientModule,
	  BrowserAnimationsModule,
	  FormsModule
  ],
  declarations: [
  	QuestionContainerComponent,
	  QuestionPlaceholderComponent,
	  SurveyStartPageComponent,
	  SurveyTermsPageComponent,
	  SurveyViewerComponent,
	  SurveyViewerContainerComponent,
	  SurveyHeaderDisplayComponent,
	  SurveyCompletePageComponent,
	  SurveyErrorComponent
  ],
	providers: [
		{provide: 'SurveyViewerService', useClass: SurveyViewerService},
		{provide: 'SurveyResponderService', useClass: SurveyResponderService}
	]

})
export class CoreModule { }
