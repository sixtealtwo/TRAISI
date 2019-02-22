import { Injectable, Inject } from '@angular/core';
import { SurveyViewerSessionData } from 'app/models/survey-viewer-session-data.model';
import { ReplaySubject, Observable, zip } from 'rxjs';
import { SurveyViewerService } from './survey-viewer.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerSession {
	public data: ReplaySubject<SurveyViewerSessionData>;

	/**
	 *Creates an instance of SurveyViewerSession.
	 * @memberof SurveyViewerSession
	 */
	public constructor(@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService) {
		this.initialize();
	}

	public initialize(): void {
		this.data = new ReplaySubject<SurveyViewerSessionData>(1);
		zip(
			this._surveyViewerService.activeSurveyId,
			Observable.of(this._surveyViewerService.activeSurveyCode),
			this._surveyViewerService.activeSurveyTitle
		).subscribe(([surveyId, surveyCode, surveyTitle]: [number, string, string]) => {
			const data = {
				shortcode: '',
				groupcode: '',
				surveyId: surveyId,
				surveyCode: surveyCode,
				surveyTitle: surveyTitle,
				primaryRespondent: null
			};
			console.log(' init session service');
			console.log(data);
			this.data.next(data);
		});
	}
}
