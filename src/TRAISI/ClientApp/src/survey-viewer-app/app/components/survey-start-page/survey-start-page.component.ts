import { Component, OnInit, ViewChild, ViewContainerRef, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyStart } from '../../models/survey-start.model';
import { User } from 'shared/models/user.model';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'traisi-survey-start-page',
	templateUrl: './survey-start-page.component.html',
	styleUrls: ['./survey-start-page.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class SurveyStartPageComponent implements OnInit {

	public finishedLoading: boolean = false;
	public pageThemeInfo: any = {};

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
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private elementRef: ElementRef
	) {}

	/**
	 *
	 */
	ngOnInit() {
		this.survey = new SurveyStart();
		this.shortcode = '';

		this.isAdmin = this.surveyViewerService.isAdminUser();

		this.route.params.subscribe(params => {
			this.surveyName = params['surveyName'];
			 this.surveyViewerService.getWelcomeView(this.surveyName).
			subscribe((surveyStartModel: SurveyStart) => {
				this.survey = surveyStartModel;
				this.surveyViewerService.activeSurveyTitle = surveyStartModel.titleText;
				this.surveyViewerService.getSurveyStyles(this.survey.id).subscribe(
					styles => {
						try {
							this.pageThemeInfo = JSON.parse(styles);
							if (this.pageThemeInfo === null) {
								this.pageThemeInfo = {};
								this.pageThemeInfo.viewerTemplate = '';
							}
						} catch (e) {}
						this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.pageThemeInfo.pageBackgroundColour;
						this.finishedLoading = true;
					}
				);
			},
			error => {
				console.error(error);
				this.router.navigate(['/', this.surveyName, 'error'], { relativeTo: this.route });
			});
		});




	}

	/**
	 * Starts the survey - this will authorize the current user with the associated
	 * short code. This will create a new survey user if one does not exist.
	 */
	public startSurvey(code: string): void {
		this.shortcode = code;
		this.isLoading = true;
		this.isError = false;

		this.surveyViewerService.surveyStart(this.survey.id, this.shortcode).subscribe(
			value => {
				this.isLoading = false;
				if (!this.isAdmin) {
					this.surveyViewerService.surveyLogin(this.survey.id, this.shortcode)
					.subscribe(
						(user: User) => {
							this.router.navigate([this.surveyName, 'terms']);
						}
					);
				} else {
					this.router.navigate([this.surveyName, 'terms']);
				}
			},
			error => {
				console.error(error);
				this.isLoading = false;
				this.isError = true;
			}
		);
	}
}
