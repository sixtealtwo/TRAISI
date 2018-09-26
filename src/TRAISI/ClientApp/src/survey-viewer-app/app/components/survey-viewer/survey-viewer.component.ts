import {
	Component,
	OnInit,
	ViewChild,
	ViewContainerRef,
	ComponentFactory,
	SystemJsNgModuleLoader,
	Inject
} from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { NextObserver } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyHeaderDisplayComponent } from '../survey-header-display/survey-header-display.component';

@Component({
	selector: 'traisi-survey-viewer',
	templateUrl: './survey-viewer.component.html',
	styleUrls: ['./survey-viewer.component.scss']
})
export class SurveyViewerComponent implements OnInit {
	public questions: any[];

	public surveyId: number;

	public titleText: string;

	@ViewChild(SurveyHeaderDisplayComponent)
	headerDisplay: SurveyHeaderDisplayComponent;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 */
	constructor(
		@Inject('SurveyViewerService')private surveyViewerService: SurveyViewerService,
		private questionLoaderService: QuestionLoaderService,
		private route: ActivatedRoute
	) {}

	/**
	 * Initialization
	 */
	ngOnInit() {
		// this.surveyViewerService.getWelcomeView()


		this.titleText = this.surveyViewerService.activeSurveyTitle;

		this.route.queryParams.subscribe((value: Params) => {


			this.surveyViewerService.activeSurveyId.subscribe((surveyId: number) => {
				this.surveyId = surveyId;

				console.log(surveyId);
				this.surveyViewerService.getSurveyViewPages(this.surveyId).subscribe((pages: SurveyViewPage[]) => {
					this.headerDisplay.pages = pages;
					this.loadPageQuestions(pages[0]);
				});
			});
		});


	}

	/**
	 *
	 * @param page
	 */
	private loadPageQuestions(page: SurveyViewPage) {
		this.questions = page.questions;
	}
}
