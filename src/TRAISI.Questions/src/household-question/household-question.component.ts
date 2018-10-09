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
import { SurveyRespondentEdit } from './models/survey-respondent-edit.model';

@Component({
	selector: 'traisi-household-question',
	template: require('./household-question.component.html').toString(),
	styles: [require('./household-question.component.scss').toString()]
})
export class HouseholdQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {
	public typeName: string;
	public icon: string;

	public respondents: Array<SurveyRespondentEdit>;

	/**
	 *
	 * @param _surveyResponderService
	 */
	constructor(@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder) {
		super();

		this.respondents = [];
	}

	ngOnInit(): void {
		this.respondents.push({
			respondent: {
				firstName: '',
				lastName: '',
				id: undefined
			},
			isSaved: false
		});
	}

	public addNewRespondentToList(): void {
		this.respondents.push({
			respondent: {
				firstName: '',
				lastName: '',
				id: undefined
			},
			isSaved: false
		});
	}

	/** */
	public saveRespondent(respondentEdit: SurveyRespondentEdit): void {
		console.log('in save respondent');
		console.log(respondentEdit);

		this._surveyResponderService.addSurveyGroupMember(respondentEdit.respondent).subscribe(
			value => {
				console.log(value);
			},
			error => {
				console.error(error);
			}
		);
	}

	public deleteRespondent(respondent: SurveyRespondentEdit): void {
		console.log('in delete respondent');
	}

	public modelChanged(respondent: SurveyRespondentEdit): void {
		
	}
}
