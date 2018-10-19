import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';

@Component({
	selector: 'traisi-survey-header-display',
	templateUrl: './survey-header-display.component.html',
	styleUrls: ['./survey-header-display.component.scss']
})
export class SurveyHeaderDisplayComponent implements OnInit {
	public get viewerState(): SurveyViewerState {
		return this._surveyViewerStateService.viewerState;
	}

	public pages: Array<SurveyViewPage> = [];

	public activePageIndex: number = 0;

	/**
	 * Updates active page index
	 * @param activePageIndex
	 */
	public updateActivePageIndex(activePageIndex: number): void {
		this.activePageIndex = activePageIndex;
		this._cdRef.markForCheck();
	}

	/**
	 * Creates an instance of survey header display component.
	 * @param _surveyViewerStateService
	 * @param _cdRef
	 */
	constructor(private _surveyViewerStateService: SurveyViewerStateService, private _cdRef: ChangeDetectorRef) {}

	public ngOnInit(): void {}
}
