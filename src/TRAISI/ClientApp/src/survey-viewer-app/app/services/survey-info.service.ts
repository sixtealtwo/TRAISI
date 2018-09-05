import {Injectable} from '@angular/core';


@Injectable({
	providedIn: 'root'
})
export class SurveyInfo {
	public surveyTitle: string;
	public surveyId: number;
	public surveyCode: string;


	constructor() {

	}

}
