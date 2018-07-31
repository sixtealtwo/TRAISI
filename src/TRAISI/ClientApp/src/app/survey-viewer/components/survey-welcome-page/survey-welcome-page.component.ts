import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
	selector: 'app-survey-welcome-page',
	templateUrl: './survey-welcome-page.component.html',
	styleUrls: ['./survey-welcome-page.component.scss']
})
export class SurveyWelcomePageComponent implements OnInit {

	surveyName: string;

	@ViewChild('shortcode', {read: HTMLInputElement}) content;

	constructor() {
	}

	ngOnInit() {
	}

}
