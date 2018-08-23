import {
	Component,
	OnInit,
	ViewChild,
	ViewContainerRef,
	ComponentFactory,
	SystemJsNgModuleLoader
} from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { NextObserver } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'traisi-survey-viewer',
	templateUrl: './survey-viewer.component.html',
	styleUrls: ['./survey-viewer.component.scss']
})
export class SurveyViewerComponent implements OnInit {
	@ViewChild('vc', { read: ViewContainerRef })
	vc;
	@ViewChild('vcmap', { read: ViewContainerRef })
	vcmap;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 */
	constructor(
		private surveyViewerService: SurveyViewerService,
		private questionLoaderService: QuestionLoaderService,
		private route: ActivatedRoute
	) {



	}

	/**
	 * Initialization
	 */
	ngOnInit() {
		// this.surveyViewerService.getWelcomeView()

		this.surveyViewerService.getDefaultSurveyView(this.surveyViewerService.activeSurveyId).subscribe( value => {

			console.log(value);
		});

		this.route.params.subscribe(value => {
			let page: number = value["page"];

			this.surveyViewerService.getSurveyViewerRespondentPageQuestions(this.surveyViewerService.activeSurveyId,
				page,"en").subscribe(value => {
					console.log(value);
			})
		})
	}
}
