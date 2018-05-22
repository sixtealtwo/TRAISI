import { Component, OnInit } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionTypeDefinition } from '../../models/question-type-definition';

@Component({
	selector: 'traisi-question-type-chooser',
	templateUrl: './question-type-chooser.component.html',
	styleUrls: ['./question-type-chooser.component.scss']
})
export class QuestionTypeChooserComponent implements OnInit {
	public questionTypeDefinitions: QuestionTypeDefinition[];

	constructor(private surveyBuilderService: SurveyBuilderService) {}

	/**
	 * Component initialization
	 */
	ngOnInit() {
		this.questionTypeDefinitions = [];

		// retrieve all question types from the server
		this.surveyBuilderService
			.getQuestionTypes()
			.subscribe((value: QuestionTypeDefinition[]) => {
				this.questionTypeDefinitions = value;
				console.log(value);
			});
	}
}
