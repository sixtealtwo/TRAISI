import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-survey-terms-page',
	templateUrl: './survey-terms-page.component.html',
	styleUrls: ['./survey-terms-page.component.scss']
})
export class SurveyTermsPageComponent implements OnInit {
	private surveyName: string;

	/**
	 *
	 * @param route
	 */
	constructor(private route: ActivatedRoute) {}

	/**
	 *
	 */
	ngOnInit() {
		this.route.parent.params.subscribe(params => {
			this.surveyName = params['surveyName'];
		});
	}
}
