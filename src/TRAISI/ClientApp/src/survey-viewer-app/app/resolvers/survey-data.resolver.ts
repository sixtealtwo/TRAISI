import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SurveyViewerService } from 'app/services/survey-viewer.service';
import { take } from 'rxjs/operators';

@Injectable()
export class SurveyDataResolver implements Resolve<SurveyData> {
	constructor(private _viewer: SurveyViewerService) {}

	/**
	 *
	 * @param route
	 * @param state
	 */
	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		console.log('in data resolve');
		return this._viewer.surveyData.pipe(take(1));
	}
}
