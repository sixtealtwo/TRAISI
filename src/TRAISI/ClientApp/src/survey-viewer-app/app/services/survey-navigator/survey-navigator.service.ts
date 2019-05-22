import { Injectable } from '@angular/core';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { Subject } from 'rxjs';
import { NavigationState } from '../../models/navigation-state.model';


/**
 *
 *
 * @export
 * @class SurveyNavigator
 */
@Injectable()
export class SurveyNavigator {


	/**
	 * Navigation state changed event emitter.
	 */
	public navigationStateChanged: Subject<NavigationState>;


	/**
	 *Creates an instance of SurveyNavigator.
	 * @param {SurveyViewerStateService} _surveyState
	 * @memberof SurveyNavigator
	 */
	public constructor(private _surveyState: SurveyViewerStateService) {
		this.navigationStateChanged = new Subject<NavigationState>();

		this.navigationStateChanged.next(null);
	}

	/**
	 *
	 */
	public navigateNext(): Subject<void> {

		let subject = new Subject<void>();

		return subject;
	}

	/**
	 *
	 */
	public navigatePrevious(): Subject<void> {

		let subject = new Subject<void>();

		return subject;
	}
}
