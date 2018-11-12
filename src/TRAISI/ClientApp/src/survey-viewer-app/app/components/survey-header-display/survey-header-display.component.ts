import { Component, Input, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';

@Component({
	selector: 'traisi-survey-header-display',
	templateUrl: './survey-header-display.component.html',
	styleUrls: ['./survey-header-display.component.scss']
})
export class SurveyHeaderDisplayComponent implements OnInit {

	public completedPages: boolean[] = [];

	public activePageIndex: number = 0;

	public get viewerState(): SurveyViewerState {
		return this._surveyViewerStateService.viewerState;
	}



	@Input() public useWhiteProgressLine: boolean;

	@Input() public pageTextColour: string;

	/**
	 * Creates an instance of survey header display component.
	 * @param _surveyViewerStateService
	 * @param _cdRef
	 * @param _surveyViewerService
	 */
	constructor(
		private _surveyViewerStateService: SurveyViewerStateService,
		private _cdRef: ChangeDetectorRef,
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _navigation: SurveyViewerNavigationService,
	) {}

	public ngOnInit(): void {
		this._navigation.navigationCompleted.subscribe(result => {
			this.viewerState.viewContainers.forEach((page, index) => {
				this.completedPages[index] = page.isComplete;
			});
		});
	}

		/**
	 * Updates active page index
	 * @param activePageIndex
	 */
	public updateActivePageIndex(activePageIndex: number): void {
		// this.activePageIndex = activePageIndex;
		this._cdRef.markForCheck();
	}


}
