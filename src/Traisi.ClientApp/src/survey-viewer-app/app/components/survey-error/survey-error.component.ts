import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-survey-error',
	templateUrl: './survey-error.component.html',
	styleUrls: ['./survey-error.component.scss']
})
export class SurveyErrorComponent implements OnInit {

	private missingIdentifier: boolean;

	/**
	 *
	 * @param route
	 */
	constructor(private route: ActivatedRoute) {
		route.queryParamMap.subscribe(paramMap => {
			if(paramMap.has('missingIdentifier')) {
				this.missingIdentifier = true;
			}
		});
	}

	public surveyName: string;

	public ngOnInit(): void {
		this.route.parent.params.subscribe(params => {
			this.surveyName = params['surveyName'];
		});
	}
}
