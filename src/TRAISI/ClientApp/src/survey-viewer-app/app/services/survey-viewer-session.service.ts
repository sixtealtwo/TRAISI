import { Injectable, Inject } from '@angular/core';
import { SurveyViewerSessionData } from 'app/models/survey-viewer-session-data.model';
import { ReplaySubject, Observable, zip, forkJoin } from 'rxjs';
import { SurveyViewerService } from './survey-viewer.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerSession {
	public data: ReplaySubject<SurveyViewerSessionData>;

	private _data: SurveyViewerSessionData;

	/**
	 *Creates an instance of SurveyViewerSession.
	 * @memberof SurveyViewerSession
	 */
	public constructor(@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService) {
		this.initialize();
	}

	/**
	 *
	 *
	 * @param {string} groupcode
	 * @memberof SurveyViewerSession
	 */
	public setGroupcode(groupcode: string): void {
		if (groupcode !== undefined || groupcode !== null) {
			this._data.groupcode = groupcode;
			this._data.isUsingGroupcode = true;
		} else {
			this._data.groupcode = null;
			this._data.isUsingGroupcode = false;
		}
		this.data.next(this._data);
	}

	/**
	 *
	 *
	 * @memberof SurveyViewerSession
	 */
	public initialize(): void {
		this.data = new ReplaySubject<SurveyViewerSessionData>(1);
		let $ = zip(
			this._surveyViewerService.activeSurveyId,
			this._surveyViewerService.surveyCode,
			this._surveyViewerService.isLoggedIn,
			this._surveyViewerService.activeSurveyTitle,
			this._surveyViewerService.surveyAuthenticationMode
		).subscribe(([surveyId, surveyCode, isLoggedIn, surveyTitle, authMode]: [number, string, boolean, string, any]) => {
			this._data = {
				shortcode: null,
				groupcode: null,
				surveyId: surveyId,
				surveyCode: surveyCode,
				surveyTitle: surveyTitle,
				primaryRespondent: null,
				isLoggedIn: isLoggedIn,
				isUsingGroupcode: false,
				authenticationMode: authMode
			};
			console.log('session loaded');
			if (isLoggedIn) {
				this._data.shortcode = this._surveyViewerService.currentUser.shortcode;
				this._data.groupcode = this._surveyViewerService.currentUser.groupcode;
			} else {
				this._data.shortcode = null;
				this._data.groupcode = null;
			}
			this._data.authenticationMode = authMode;
			this._data.isUsingGroupcode = this._data.groupcode !== null;
			this.data.next(this._data);

			$.unsubscribe();
		});
	}
}
