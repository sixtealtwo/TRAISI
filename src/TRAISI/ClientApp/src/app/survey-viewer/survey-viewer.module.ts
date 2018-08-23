import { NgModule, SystemJsNgModuleLoader } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionLoaderService } from './services/question-loader.service';
import { QuestionLoaderEndpointService } from './services/question-loader-endpoint.service';
import { ROUTES } from './survey-viewer.routes';
import { SharedModule } from '../shared/shared.module';
import { SurveyViewerComponent } from './components/survey-viewer/survey-viewer.component';
import { SurveyViewerService } from './services/survey-viewer.service';
import { SurveyViewerEndpointService } from './services/survey-viewer-endpoint.service';
import { SurveyStartPageComponent } from './components/survey-start-page/survey-start-page.component';
import { SurveyTermsPageComponent } from './components/survey-terms-page/survey-terms-page.component';
import { SurveyCompletePageComponent } from './components/survey-complete-page/survey-complete-page.component';
import { SurveyViewerContainerComponent } from './components/survey-viewer-container/survey-viewer-container.component';
import { SurveyErrorComponent } from './components/survey-error/survey-error.component';
import { FormsModule } from '@angular/forms';
import { QuestionContainerComponent } from './components/question-container/question-container.component';

@NgModule({
	imports: [CommonModule, SharedModule, FormsModule, ROUTES],
	declarations: [
		SurveyViewerComponent,
		SurveyStartPageComponent,
		SurveyTermsPageComponent,
		SurveyCompletePageComponent,
		SurveyViewerContainerComponent,
		SurveyErrorComponent,
		QuestionContainerComponent
	],
	providers: [
		QuestionLoaderEndpointService,
		QuestionLoaderService,
		SurveyViewerService,
		SurveyViewerEndpointService
	],
	exports: []
})
export class SurveyViewerModule {}
