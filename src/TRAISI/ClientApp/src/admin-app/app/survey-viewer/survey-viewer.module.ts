import { NgModule, SystemJsNgModuleLoader } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionLoaderService } from './services/question-loader.service';
import { QuestionLoaderEndpointService } from './services/question-loader-endpoint.service';
import { ROUTES } from './survey-viewer.routes';
import { SharedModule } from '../shared/shared.module';
import { SurveyViewerService } from './services/survey-viewer.service';
import { SurveyViewerEndpointService } from './services/survey-viewer-endpoint.service';

import { FormsModule } from '@angular/forms';

import {SurveyResponderService} from "./services/survey-responder.service";
import {SurveyResponderEndpointService} from "./services/survey-responder-endpoint.service";

@NgModule({
	imports: [CommonModule, SharedModule, FormsModule, ROUTES],
	declarations: [

	],
	providers: [
		QuestionLoaderEndpointService,
		QuestionLoaderService,
		SurveyViewerService,
		SurveyViewerEndpointService,
		SurveyResponderEndpointService,
		{provide: 'SurveyViewerService', useClass: SurveyViewerService},
		{provide: 'SurveyResponderService', useClass: SurveyResponderService}
	],
	exports: []
})
export class SurveyViewerModule {}
