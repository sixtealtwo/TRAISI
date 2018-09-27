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
	selector: 'traisi-likert-question',
	template: require('./likert-question.component.html').toString(),
	styles: [require('./likert-question.component.scss').toString()]
})
export class LikertQuestionComponent extends SurveyQuestion<ResponseTypes.List> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Likert Question';

	typeName: string;
	icon: string;
	/**
	 *Creates an instance of LikertQuestionComponent.
	 * @param {SurveyViewer} _surveyViewerService
	 * @param {SurveyResponder} _surveyResponderService
	 * @memberof LikertQuestionComponent
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'likert';
	}

	ngOnInit() {}
}
