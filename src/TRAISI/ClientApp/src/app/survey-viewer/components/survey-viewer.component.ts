import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactory, SystemJsNgModuleLoader } from '@angular/core';
import { SurveyViewerService } from '../services/survey-viewer.service';
import { QuestionLoaderService } from '../services/question-loader.service';
import { NextObserver } from 'rxjs';


@Component({
	selector: 'traisi-survey-viewer',
	templateUrl: './survey-viewer.component.html',
	styleUrls: ['./survey-viewer.component.scss']
})
export class SurveyViewerComponent implements OnInit {

	@ViewChild('vc', {read: ViewContainerRef}) vc;
	@ViewChild('vcmap', {read: ViewContainerRef}) vcmap;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 */
	constructor(private surveyViewerService: SurveyViewerService,
		private questionLoaderService: QuestionLoaderService
	) {

	}

	/**
	 * Initialization
	 */
	ngOnInit() {

		// loads the component into the view child slot
		// tests with the Map type currently
		this.questionLoaderService.getQuestionComponentFactory('Text').subscribe((value: ComponentFactory<any>) => {
			this.vc.createComponent(value);
		});

		this.questionLoaderService.getQuestionComponentFactory('Map').subscribe((value: ComponentFactory<any>) => {
			this.vcmap.createComponent(value);
		});
	}

}
