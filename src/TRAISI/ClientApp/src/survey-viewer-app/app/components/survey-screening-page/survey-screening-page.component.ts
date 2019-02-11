import { Component, OnInit, ViewChild, ViewContainerRef, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyStart } from '../../models/survey-start.model';
import { User } from 'shared/models/user.model';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';

/**
 *
 *
 * @export
 * @class SurveyScreeningPageComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'survey-screening-page',
	templateUrl: './survey-screening-page.component.html',
	styleUrls: ['./survey-screening-page.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveyScreeningPageComponent implements OnInit {
	/**
	 *Creates an instance of SurveyScreeningPageComponent.
	 * @param {SurveyViewerService} _surveyViewerService
	 * @param {ActivatedRoute} _route
	 * @param {Router} _router
	 * @param {TranslateService} _translate
	 * @param {ElementRef} _elementRef
	 * @memberof SurveyScreeningPageComponent
	 */
	public constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _translate: TranslateService,
		private _elementRef: ElementRef
	) {}

	/**
	 *
	 *
	 * @memberof SurveyScreeningPageComponent
	 */
	public ngOnInit(): void {}
}
