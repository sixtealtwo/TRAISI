import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';
import { SurveyStartPageComponent } from '../survey-start-page/survey-start-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SurveyViewGroupcodePage } from '../../models/survey-view-groupcode-page.model';
import { SurveyStart } from 'app/models/survey-start.model';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { find as _find } from 'lodash';

@Component({
	selector: 'traisi-survey-groupcode-page',
	templateUrl: './survey-groupcode-page.component.html',
	styleUrls: ['./survey-groupcode-page.component.scss']
})
export class SurveyGroupcodePageComponent implements OnInit {
	public startPageComponent: SurveyStartPageComponent;
	public isFinishedLoading: boolean;
	public model: SurveyViewGroupcodePage;
	public surveyStartModel: SurveyStart;
	public pageThemeInfo: any;
	private _surveyName: string;

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
		this._surveyViewerService.pageThemeInfo.subscribe((info) => {
			this.pageThemeInfo = info;
			this.isFinishedLoading = true;
			this._surveyViewerService.welcomeModel.subscribe((surveyStartModel: SurveyStart) => {
				this.surveyStartModel = surveyStartModel;
				this.isFinishedLoading = true;

				let m = JSON.parse(this.surveyStartModel.welcomeText);
				this.model.header1 = _find(m, (x) => x.sectionType === 'header1');
				this.model.header2 = _find(m, (x) => x.sectionType === 'header2');
				this.model.footer1 = _find(m, (x) => x.sectionType === 'footer1');

				console.log(this.model);
			});
		});
		return;
	}

	public onGroupcodeSubmit(): void {
		this.startPageComponent.groupcodeStartSurvey();
	}
}
