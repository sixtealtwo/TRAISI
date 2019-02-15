import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SurveyStart } from 'app/models/survey-start.model';
import { SurveyStartPageComponent } from '../survey-start-page/survey-start-page.component';

@Component({
	selector: 'traisi-survey-shortcode-page',
	templateUrl: './survey-shortcode-page.component.html',
	styleUrls: ['./survey-shortcode-page.component.scss']
})
export class SurveyShortcodePageComponent implements OnInit {
	public finishedLoading: boolean = false;
	public pageThemeInfo: any = {};
	public surveyName: string;
	public isLoading: boolean = false;
	public shortcode: string;
	public survey: SurveyStart;
	public isError: boolean = false;
	public startPageComponent: SurveyStartPageComponent;
	/**
	 *Creates an instance of SurveyShortcodeStartPageComponent.
	 * @param {SurveyViewerService} _surveyViewerService
	 * @param {ActivatedRoute} _route
	 * @param {Router} _router
	 * @param {TranslateService} _translate
	 * @param {ElementRef} _elementRef
	 * @memberof SurveyShortcodeStartPageComponent
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _translate: TranslateService,
		private _elementRef: ElementRef
	) {}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.survey = new SurveyStart();
		this.shortcode = '';
		this._route.params.subscribe((params) => {
			this.surveyName = params['surveyName'];
			this._surveyViewerService.welcomeModel.subscribe(
				(surveyStartModel: SurveyStart) => {
					this.survey = surveyStartModel;
					// this.surveyViewerService.activeSurveyTitle = surveyStartModel.titleText;
					this._surveyViewerService.pageThemeInfoJson.subscribe(
						(styles) => {
							try {
								console.log(styles);
								this.pageThemeInfo = styles;
								if (this.pageThemeInfo === null) {
									this.pageThemeInfo = {};
									this.pageThemeInfo.viewerTemplate = '';
								}
							} catch (e) {
								console.log(e);
							}
							this._elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.pageThemeInfo.pageBackgroundColour;
							this.finishedLoading = true;
							console.log('finished loading');
						},
						(error) => {
							console.error(error);
						}
					);
				},
				(error) => {
					console.error(error);
					this._router.navigate(['/', this.surveyName, 'error'], { relativeTo: this._route });
				}
			);
		});
	}
}
