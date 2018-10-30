import { SurveyViewerStateService } from './survey-viewer-state.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerNavigationService {
	/**
	 *
	 * @param _viewerState
	 */
	public constructor(private _viewerState: SurveyViewerStateService) {}
}
