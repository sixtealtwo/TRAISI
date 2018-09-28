import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {SurveyViewTermsModel} from '../../models/survey-view-terms.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-survey-terms-page',
	templateUrl: './survey-terms-page.component.html',
	styleUrls: ['./survey-terms-page.component.scss']
})
export class SurveyTermsPageComponent implements OnInit {
	private surveyName: string;

	private surveyId: number;

	public model: SurveyViewTermsModel;

	contentModel: any;

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
		@Inject('SurveyViewerService')private surveyViewerService: SurveyViewerService,
		private router: Router,
		private translate: TranslateService
	) {
		this.model = {} as SurveyViewTermsModel;

		this.contentModel = {
			textBlock1: ''
		};
	}

	public begin() {

		this.router.navigate([this.surveyName, 'viewer']);
	}

	/**
	 *
	 */
	ngOnInit() {


		this.surveyViewerService.activeSurveyId.subscribe(surveyId => {

			this.surveyId = surveyId;

			this.surveyViewerService.getSurveyViewerTermsAndConditions(this.surveyId).subscribe(
				value => {

					this.model = value;
					this.contentModel = JSON.parse(this.model.termsAndConditionsText);
				},
				error => {
					this.model = {} as SurveyViewTermsModel;
				}
			);
		});
		this.route.parent.params.subscribe(params => {
			this.surveyName = params['surveyName'];
		});


	}
}
