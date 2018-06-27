import { Component, OnInit } from '@angular/core';
import { SurveyBuilderService } from './services/survey-builder.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'traisi-survey-builder',
	templateUrl: './survey-builder.component.html',
	styleUrls: ['./survey-builder.component.scss']
})
export class SurveyBuilderComponent implements OnInit {
	public surveyId: number;

	constructor(private surveyBuilderService: SurveyBuilderService, private route: ActivatedRoute) {
		this.route.params.subscribe(params => {
			this.surveyId = params['id'];
		});
	}

	ngOnInit() {}
}
