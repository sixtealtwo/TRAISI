import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewTermsModel } from '../../models/survey-view-terms.model';
import { TranslateService } from '@ngx-translate/core';
import { flatMap } from 'rxjs/operators';
import { SurveyViewScreening } from 'app/models/survey-view-screening.model';
@Component({
	selector: 'app-survey-terms-page',
	templateUrl: './survey-terms-page.component.html',
	styleUrls: ['./survey-terms-page.component.scss']
})
export class SurveyTermsPageComponent implements OnInit {
	private surveyName: string;

	private surveyId: number;

	public model: SurveyViewTermsModel;

	public hasScreeningQuestions: boolean;

	public finishedLoading: boolean = false;

	public pageThemeInfo: any = {};

	/**
	 *Creates an instance of SurveyTermsPageComponent.
	 * @param {ActivatedRoute} route
	 * @param {SurveyViewerService} surveyViewerService
	 * @param {Router} router
	 * @param {TranslateService} translate
	 * @memberof SurveyTermsPageComponent
	 */
	constructor(
		private route: ActivatedRoute,
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		private router: Router,
		private translate: TranslateService,
		private elementRef: ElementRef
	) {
		this.model = {} as SurveyViewTermsModel;
	}

	/**
	 *
	 *
	 * @memberof SurveyTermsPageComponent
	 */
	public begin(): void {
		if (!this.hasScreeningQuestions) {
			this.router.navigate([this.surveyName, 'viewer']);
		} else {
			this.router.navigate([this.surveyName, 'screening']);
		}
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.surveyViewerService.activeSurveyId
			.pipe(
				flatMap(id => {
					this.surveyId = id;
					return this.surveyViewerService.termsModel;
				})
			)
			.pipe(
				flatMap(terms => {
					this.model = terms;
					return this.surveyViewerService.screeningQuestionsModel;
				})
			)
			.pipe(
				flatMap((screening: SurveyViewScreening) => {
					console.log(screening);
					this.hasScreeningQuestions = screening.questionsList.length > 0;
					return this.surveyViewerService.pageThemeInfoJson;
				})
			)
			.subscribe(value => {
				this.pageThemeInfo = value;
				this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.pageThemeInfo.pageBackgroundColour;
				this.finishedLoading = true;
			});

		this.route.parent.params.subscribe(params => {
			this.surveyName = params['surveyName'];
		});
	}
}
