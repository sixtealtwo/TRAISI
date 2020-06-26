import { Component, OnInit } from '@angular/core';
import { SurveyViewerStateService } from 'app/services/survey-viewer-state.service';
import { SurveyViewPage } from 'app/models/survey-view-page.model';
import { SurveyNavigator } from 'app/modules/survey-navigation/services/survey-navigator/survey-navigator.service';
import { NavigationState } from 'app/models/navigation-state.model';
import { SurveyViewScreening } from 'app/models/survey-view-screening.model';
import { SurveyViewSection } from 'app/models/survey-view-section.model';

@Component({
	selector: 'traisi-survey-progress',
	templateUrl: './survey-progress.component.html',
	styleUrls: ['./survey-progress.component.scss'],
})
export class SurveyProgressComponent implements OnInit {
	public pages: SurveyViewPage[];
	public constructor(public viewerStateService: SurveyViewerStateService, public navigator: SurveyNavigator) {}
	public ngOnInit(): void {
	}

	/**
	 *
	 * @param page
	 */
	public navigateToPage(page: SurveyViewPage) {
		this.navigator.navigateToPage(page.id).subscribe();
	}

	/**
	 *
	 * @param section
	 * @param page
	 */
	public navigateToSection(section: SurveyViewSection, page: SurveyViewPage) {
		this.navigator.navigateToSection(page, section).subscribe();
	}
}
