import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';

@Component({
	selector: 'app-live-survey',
	templateUrl: './live-survey.component.html',
	styleUrls: ['./live-survey.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LiveSurveyComponent implements OnInit {
	public surveyId: number;
	public survey: Survey;

	constructor(private surveyService: SurveyService, private route: ActivatedRoute) {
		this.route.params.subscribe(params => {
			this.surveyId = params['id'];
		});
		this.survey = new Survey();
	}

	ngOnInit() {
		this.survey = this.surveyService.getLastSurvey();
		if (!this.survey || this.survey == null)
		{
			this.survey = new Survey();
			this.surveyService.getSurvey(this.surveyId).subscribe(result =>
				{
					this.survey = result;
				}, error => {});
		}
	}
}
