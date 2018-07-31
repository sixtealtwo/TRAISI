import {Component, OnInit, ViewContainerRef} from '@angular/core';

@Component({
	selector: 'app-survey-error',
	templateUrl: './survey-error.component.html',
	styleUrls: ['./survey-error.component.scss']
})
export class SurveyErrorComponent implements OnInit {


	constructor() {
	}

	public surveyName: string;

	ngOnInit() {

		console.log(this.surveyName);

	}

}
