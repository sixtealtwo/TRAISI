import { Component, OnInit } from '@angular/core';
import { SurveyViewerStateService } from 'app/services/survey-viewer-state.service';
import { SurveyViewPage } from 'app/models/survey-view-page.model';
import { SurveyNavigator } from 'app/modules/survey-navigation/services/survey-navigator/survey-navigator.service';
import { NavigationState } from 'app/models/navigation-state.model';

@Component({
	selector: 'traisi-survey-progress',
	templateUrl: './survey-progress.component.html',
	styleUrls: ['./survey-progress.component.scss'],
})
export class SurveyProgressComponent implements OnInit {

	public pages: SurveyViewPage[];
	public constructor(public viewerStateService: SurveyViewerStateService, public navigator: SurveyNavigator) {

	}
	public ngOnInit(): void {
		// throw new Error('Method not implemented.');
		// this.pages = this._viewerStateService.viewerState.surveyPages;
		console.log(this.pages);
	}

	public navigateToPage(page: SurveyViewPage) {
		console.log(page);
	}
}
