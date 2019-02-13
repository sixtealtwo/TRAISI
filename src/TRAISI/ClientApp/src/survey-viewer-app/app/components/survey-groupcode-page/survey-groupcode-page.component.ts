import { Component, Input, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';
import { SurveyStartPageComponent } from '../survey-start-page/survey-start-page.component';

@Component({
	selector: 'traisi-survey-groupcode-page',
	templateUrl: './survey-groupcode-page.component.html',
	styleUrls: ['./survey-groupcode-page.component.scss']
})
export class SurveyGroupcodePageComponent implements OnInit {
	public startPageComponent: SurveyStartPageComponent;
	public ngOnInit(): void {
		return;
	}

	public onGroupcodeSubmit(): void {
		this.startPageComponent.groupcodeStartSurvey();
	}
}
