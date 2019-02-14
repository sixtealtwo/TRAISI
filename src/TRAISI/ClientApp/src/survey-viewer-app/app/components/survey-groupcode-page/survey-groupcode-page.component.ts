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

@Component({
	selector: 'traisi-survey-groupcode-page',
	templateUrl: './survey-groupcode-page.component.html',
	styleUrls: ['./survey-groupcode-page.component.scss']
})
export class SurveyGroupcodePageComponent implements OnInit {
	public startPageComponent: SurveyStartPageComponent;
	public isFinishedLoading: boolean;
	public model: SurveyViewGroupcodePage;

	public constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _translate: TranslateService,
		private _elementRef: ElementRef
	) {
		this.isFinishedLoading = false;
	}

	public ngOnInit(): void {
		this.isFinishedLoading = true;
		this.model = {};
		return;
	}

	public onGroupcodeSubmit(): void {
		this.startPageComponent.groupcodeStartSurvey();
	}
}
