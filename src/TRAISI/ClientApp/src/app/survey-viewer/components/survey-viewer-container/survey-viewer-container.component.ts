import {Component, ComponentFactoryResolver, OnInit, ViewEncapsulation} from '@angular/core';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {QuestionLoaderService} from '../../services/question-loader.service';
import {ActivatedRoute} from '@angular/router';
import {SurveyErrorComponent} from '../survey-error/survey-error.component';
import {SurveyStartPageComponent} from '../survey-start-page/survey-start-page.component';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'app-survey-viewer-container',
	templateUrl: './survey-viewer-container.component.html',
	styleUrls: ['./survey-viewer-container.component.scss'],
	entryComponents: [SurveyErrorComponent, SurveyStartPageComponent]
})
export class SurveyViewerContainerComponent implements OnInit {
	private surveyName: string;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 * @param componentFactoryResolver
	 */
	constructor(
		private surveyViewerService: SurveyViewerService,
		private questionLoaderService: QuestionLoaderService,
		private route: ActivatedRoute,
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	/**
	 *
	 */
	ngOnInit() {
		this.route.params.subscribe(params => {
			this.surveyName = params['surveyName'];

			// get the welcome view
			this.surveyViewerService
				.getWelcomeView(params['surveyName'])
				.subscribe(value => {}, error => {});
		});
	}
}
