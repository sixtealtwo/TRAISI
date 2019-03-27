import { Inject, Injectable } from '@angular/core';
import { EndpointFactory } from 'shared/services/endpoint-factory.service';
import { SurveyViewerEndpointFactory } from './survey-viewer-endpoint-factory.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable(
	{
		providedIn: 'root'
	}
)
export class SurveyViewerApiEndpointService extends SurveyViewerEndpointFactory {

	private readonly _geoServiceUrl: string = '/api/GeoService';

	/**
	 * Retrieves the distance matrix from the passed origins and destinations.
	 *
	 * @param {Array<string>} origins
	 * @param {Array<string>} destinations
	 * @returns {Observable<any>}
	 * @memberof SurveyViewerApiEndpointService
	 */
	public getDistanceMatrixEndpoint(origins: Array<string>, destinations: Array<string>): Observable<any> {
		let endpointUrl = `${this._geoServiceUrl}/distancematrix/${origins.join()}/${destinations.join()}`;

		// let headers = this.getRequestHeaders(respondentId);
		// headers.headers = (<HttpHeaders>headers.headers).set('Respondent-Id', respondentId.toString());
		return this.http.get(endpointUrl).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getDistanceMatrixEndpoint(origins, destinations)
				);
			})
		);
	}
}
