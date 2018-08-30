import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AlertService, MessageSeverity} from '../../../../shared/services/alert.service';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SurveyStart} from '../../models/survey-start.model';
import {AuthService} from '../../../../shared/services/auth.service';
import {User} from '../../../../shared/models/user.model';

@Component({
	selector: 'traisi-survey-start-page',
	templateUrl: './survey-start-page.component.html',
	styleUrls: ['./survey-start-page.component.scss']
})
export class SurveyStartPageComponent implements OnInit {
	surveyName: string;

	isLoading: boolean = false;

	shortcode: string;

	survey: SurveyStart;

	/**
	 *
	 * @param alertService
	 * @param surveyViewerService
	 * @param route
	 * @param router
	 */
	constructor(
		private alertService: AlertService,
		private surveyViewerService: SurveyViewerService,
		private route: ActivatedRoute,
		private router: Router
	) {
	}

	/**
	 *
	 */
	ngOnInit() {

		this.survey = new SurveyStart();
		this.shortcode = '';

		this.route.params.subscribe(params => {

			this.surveyName = params['surveyName'];

			this.surveyViewerService.getWelcomeView(this.surveyName).subscribe(
				value => {
					this.survey = value;
				},
				error => {
					this.router.navigate(['/', this.surveyName, 'error'], {relativeTo: this.route});
				}
			);
		});
	}

	/**
	 *
	 * @param caption
	 * @param message
	 */
	showErrorAlert(caption: string, message: string): void {
		this.alertService.showMessage(caption, message, MessageSeverity.error);
	}

	/**
	 * Starts the survey - this will authorize the current user with the associated
	 * short code. This will create a new survey user if one does not exist.
	 */
	startSurvey(): void {
		this.isLoading = true;
		this.surveyViewerService.surveyStart(this.survey.id, this.shortcode).subscribe(
			value => {
				this.surveyViewerService.surveyLogin(this.survey.id, this.shortcode).subscribe((user: User) => {
					this.isLoading = false;
					this.router.navigate([this.surveyName, 'terms']);
				});
			},
			error => {
				this.isLoading = false;
				this.showErrorAlert('Error', 'Some error with the shortcode');
			}
		);
	}
}
