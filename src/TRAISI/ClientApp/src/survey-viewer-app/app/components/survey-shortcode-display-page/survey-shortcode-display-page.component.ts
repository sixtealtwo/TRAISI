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
import { SurveyViewGroupcodePage } from 'app/models/survey-view-groupcode-page.model';
import { FormGroup, FormControl } from '@angular/forms';
import { find as _find } from 'lodash';
@Component({
	selector: 'traisi-survey-shortcode-display-page',
	templateUrl: './survey-shortcode-display-page.component.html',
	styleUrls: ['./survey-shortcode-display-page.component.scss']
})
export class SurveyShortcodeDisplayPageComponent implements OnInit {
	public startPageComponent: SurveyStartPageComponent;

	public isFinishedLoading: boolean;
	public model: SurveyViewGroupcodePage & { shortcode?: string };
	public surveyStartModel: SurveyStart;
	public pageThemeInfo: any;
	private _surveyName: string;
	public groupcodeFormGroup: FormGroup;
	private _surveyId: number;

	public constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _translate: TranslateService,
		private _elementRef: ElementRef
	) {
		this.isFinishedLoading = false;
		this.model = {};
	}

	public ngOnInit(): void {
		console.log('in shortcode display');
		console.log(this._route);
		this._surveyViewerService.pageThemeInfo.subscribe(info => {
			this.pageThemeInfo = info;
			this.isFinishedLoading = true;
			this._surveyViewerService.welcomeModel.subscribe((surveyStartModel: SurveyStart) => {
				this.surveyStartModel = surveyStartModel;
				this.isFinishedLoading = true;

				let m = JSON.parse(this.surveyStartModel.welcomeText);
				this.model.header1 = _find(m, x => x.sectionType === 'header1');
				this.model.header2 = _find(m, x => x.sectionType === 'header2');
				this.model.footer1 = _find(m, x => x.sectionType === 'footer1');

				this.groupcodeFormGroup = new FormGroup({});
				this.groupcodeFormGroup.addControl('groupcode', new FormControl(''));

				this._surveyViewerService.activeSurveyId.subscribe((surveyId: number) => {
					this._surveyId = surveyId;
				});

				this._route.queryParamMap.subscribe(params => {
					this.model.shortcode = params.get('shortcode');
				});
			});
		});
		return;
	}

	/**
	 *
	 *
	 * @memberof SurveyShortcodeDisplayPageComponent
	 */
	public onStartSurvey(): void {
		this.startPageComponent.surveyLogin(this.model.shortcode);
	}
}
