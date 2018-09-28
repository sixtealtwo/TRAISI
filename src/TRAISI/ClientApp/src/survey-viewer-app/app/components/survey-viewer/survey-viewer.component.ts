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
import { flatMap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyHeaderDisplayComponent } from '../survey-header-display/survey-header-display.component';
import { sortBy } from 'lodash';
import { QuestionContainerComponent } from '../question-container/question-container.component';
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

	@ViewChild(QuestionContainerComponent)
	questionContainer: QuestionContainerComponent;

	public activeQuestion;

	public activeQuestionIndex: number = -1;

	public isLoaded: boolean = false;

	public navigatePreviousEnabled: boolean = false;

	public navigateNextEnabled: boolean = false;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
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
		this.questions = sortBy(page.questions, ['order']);

		this.activeQuestionIndex = 0;
		this.validateNavigation();

		this.isLoaded = true;
	}

	/**
	 *
	 */
	private navigateToActiveIndex() {
		this.activeQuestion = this.questions[this.activeQuestionIndex];
	}

	public navigateNext() {
		this.activeQuestionIndex += 1;
		this.validateNavigation();
	}

	public navigatePrevious() {
		this.activeQuestionIndex -= 1;
		this.validateNavigation();
	}

	/**
	 * Validates the disabled / enabled state of the navigation buttons.
	 */
	private validateNavigation() {
		if (this.activeQuestionIndex > 0) {
			this.navigatePreviousEnabled = true;
		} else {
			this.navigatePreviousEnabled = false;
		}

		if (this.activeQuestionIndex >= this.questions.length - 1) {
			this.navigateNextEnabled = false;
		} else {
			this.navigateNextEnabled = true;
		}
	}
}
