import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SurveyStart } from 'app/models/survey-start.model';

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
	public isAdmin: boolean = false;
	public survey: SurveyStart;
	public isError: boolean = false;
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
	public ngOnInit(): void {
		return;
	}
}
