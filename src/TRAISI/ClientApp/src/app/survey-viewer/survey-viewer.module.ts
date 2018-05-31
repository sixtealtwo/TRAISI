import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionLoaderService } from './services/question-loader.service';
import { QuestionLoaderEndpointService } from 'app/survey-viewer/services/question-loader-endpoint.service';
import { ROUTES } from './survey-viewer.routes';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyViewerComponent } from './components/survey-viewer.component';
import { SurveyViewerService } from './services/survey-viewer.service';
import { SurveyViewerEndpointService } from './services/survey-viewer-endpoint.service';

@NgModule({
	imports: [
		CommonModule, SharedModule, ROUTES
	],
	declarations: [SurveyViewerComponent],
	providers: [QuestionLoaderEndpointService,
		QuestionLoaderService, SurveyViewerService, SurveyViewerEndpointService],
	exports: []
})
export class SurveyViewerModule { }
