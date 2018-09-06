import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {SurveyResponderService} from '../../services/survey-responder.service';
import {QuestionLoaderEndpointService} from '../../services/question-loader-endpoint.service';
import {QuestionLoaderService} from '../../services/question-loader.service';
import {SurveyViewerEndpointService} from '../../services/survey-viewer-endpoint.service';
import {SurveyResponderEndpointService} from '../../services/survey-responder-endpoint.service';
import {LoadingPlaceholderDirective} from '../../directives/loading-placeholder.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [LoadingPlaceholderDirective],
	providers: []
})
export class CoreModule {
}
