import { Component, OnInit } from '@angular/core';
import { SurveyBuilderService } from './services/survey-builder.service';

@Component({
	selector: 'traisi-survey-builder',
	templateUrl: './survey-builder.component.html',
	styleUrls: ['./survey-builder.component.scss']
})
export class SurveyBuilderComponent implements OnInit {

	constructor(private surveyBuilderService: SurveyBuilderService) {

	}

	ngOnInit() {
	}

}
