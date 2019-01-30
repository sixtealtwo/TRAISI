import { Injectable } from '@angular/core';
import { SurveyBuilderEndpointService } from './survey-builder-endpoint.service';
import { Observable } from 'rxjs';

declare const SystemJS;

@Injectable()
export class CustomBuilderService {
	/**
	 *Creates an instance of CustomBuilderService.
	 * @param {SurveyBuilderEndpointService} _surveyBuilderEndpointService
	 * @memberof CustomBuilderService
	 */
	constructor(private _surveyBuilderEndpointService: SurveyBuilderEndpointService) {}

	/**
	 *
	 *
	 * @param {string} name
	 * @returns {Observable<any>}
	 * @memberof SurveyBuilderService
	 */
	public loadCustomClientBuilderView(name: string): Observable<any> {
		return this.loadClientBuilderModule(name);
	}

	/**
	 *
	 *
	 * @private
	 * @param {string} name
	 * @returns {Observable<any>}
	 * @memberof SurveyBuilderService
	 */
	private loadClientBuilderModule(name: string): Observable<any> {
		const result = Observable.create(observer => {
			SystemJS.import(this._surveyBuilderEndpointService.getSurveyBuilderClientBuilderCodeUrl(name)).then(
				module => {
					observer.next(module);
				}
			);
		});

		return result;
	}
}
