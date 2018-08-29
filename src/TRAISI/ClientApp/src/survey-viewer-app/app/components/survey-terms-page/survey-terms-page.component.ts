import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {SurveyViewTermsModel} from '../../models/survey-view-terms.model';

@Component({
	selector: 'app-survey-terms-page',
	templateUrl: './survey-terms-page.component.html',
	styleUrls: ['./survey-terms-page.component.scss']
})
export class SurveyTermsPageComponent implements OnInit {
	private surveyName: string;

	private surveyId: number;

	public model: SurveyViewTermsModel;

	/**
	 *
	 * @param route
	 */
	constructor(
		private route: ActivatedRoute,
		private surveyViewerService: SurveyViewerService,
		private router: Router
	) {
		this.model = {} as SurveyViewTermsModel;
	}

	public begin() {
		this.router.navigate(['/survey', this.surveyName, 'viewer']);
	}

	/**
	 *
	 */
	ngOnInit() {
		console.log('active id: ' + this.surveyViewerService.activeSurveyId);

		this.surveyId = this.surveyViewerService.activeSurveyId;
		this.route.parent.params.subscribe(params => {
			this.surveyName = params['surveyName'];
		});

		this.surveyViewerService.getSurveyViewerTermsAndConditions(this.surveyId).subscribe(
			value => {
				console.log(value);
				this.model = value;
			},
			error => {
				this.model = {} as SurveyViewTermsModel;
			}
		);
	}
}
