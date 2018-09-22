import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyStart } from '../../models/survey-start.model';
import { User } from 'shared/models/user.model';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'traisi-survey-start-page',
	templateUrl: './survey-start-page.component.html',
	styleUrls: ['./survey-start-page.component.scss']
})
export class SurveyStartPageComponent implements OnInit {
	surveyName: string;

	isLoading: boolean = false;

	shortcode: string;

	isAdmin: boolean = false;

	survey: SurveyStart;

	isError: boolean = false;

	@ViewChild('adminAlert')
	adminAlert: AlertComponent;

	/**
	 *
	 * @param alertService
	 * @param surveyViewerService
	 * @param route
	 * @param router
	 */
	constructor(
		private surveyViewerService: SurveyViewerService,
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService
	) {}

	/**
	 *
	 */
	ngOnInit() {
		this.survey = new SurveyStart();
		this.shortcode = '';

		if (this.surveyViewerService.isAdminUser()) {
			this.isAdmin = true;
		}

		this.route.params.subscribe(params => {
			this.surveyName = params['surveyName'];

			this.surveyViewerService.getWelcomeView(this.surveyName).subscribe(
				value => {
					this.survey = value;

					this.surveyViewerService.activeSurveyTitle = value.titleText;
				},
				error => {
					this.router.navigate(['/', this.surveyName, 'error'], { relativeTo: this.route });
				}
			);
		});
	}


	/**
	 * Starts the survey - this will authorize the current user with the associated
	 * short code. This will create a new survey user if one does not exist.
	 */
	startSurvey(): void {
		this.isLoading = true;
		this.isError = false;
		console.log('starting');
		this.surveyViewerService.surveyStart(this.survey.id, this.shortcode).subscribe(
			value => {
				this.isLoading = false;
				if (!this.isAdmin) {
					this.surveyViewerService.surveyLogin(this.survey.id, this.shortcode).subscribe((user: User) => {


					});
				}
				else{
					this.router.navigate([this.surveyName, 'terms']);

				}
			},
			error => {
				this.isLoading = false;
				this.isError = true;

			}
		);
	}
}
