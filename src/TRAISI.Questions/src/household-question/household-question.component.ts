import { Component, OnInit, Inject } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-household-question',
	template: require('./household-question.component.html').toString(),
	styles: [require('./household-question.component.scss').toString()]
})
export class HouseholdQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {
	public typeName: string;
	public icon: string;

	/**
	 *
	 * @param _surveyResponderService
	 */
	constructor(@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder) {
		super();
	}

	ngOnInit(): void {}
}
