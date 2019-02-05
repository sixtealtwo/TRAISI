import { Component, Input, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';

@Component({
	selector: 'traisi-survey-group-start-page',
	templateUrl: './survey-group-start-page.component.html',
	styleUrls: ['./survey-group-start-page.component.scss']
})
export class SurveyGroupStartPageComponent implements OnInit {
	public ngOnInit(): void {
		return;
	}
}


