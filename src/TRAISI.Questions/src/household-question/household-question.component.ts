import { Component, OnInit, Inject, ChangeDetectorRef, OnChanges, DoCheck } from '@angular/core';
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
	QuestionOption,
	SurveyRespondent
} from 'traisi-question-sdk';
import { SurveyRespondentEdit } from './models/survey-respondent-edit.model';

@Component({
	selector: 'traisi-household-question',
	template: require('./household-question.component.html').toString(),
	styles: [require('./household-question.component.scss').toString()]
})
export class HouseholdQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit, DoCheck {
	public typeName: string;
	public icon: string;

	public respondents: Array<SurveyRespondentEdit>;

	public relationships: Array<string> = ['Spouse/Partner', 'Child', 'Parent', 'Grandparent', 'Grandchild', 'Roommate', 'Other'];

	/**
	 *
	 * @param _surveyResponderService
	 */
	constructor(@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder, private _cdRef: ChangeDetectorRef) {
		super();

		this.respondents = [];
	}

	ngOnInit(): void {
		/*
		this.respondents.push({
			respondent: {
				firstName: '',
				lastName: '',
				id: undefined
			},
			isSaved: false,
			isValid: false
		}); */

		this._surveyResponderService.getSurveyGroupMembers().subscribe(value => {
			const arr = <Array<SurveyRespondent>>value;
			arr.splice(0, 1);

			arr.forEach(element => {
				this.respondents.push({
					respondent: element,
					isSaved: true,
					isValid: true
				});
			});
		});
	}

	public addNewRespondentToList(): void {
		this.respondents.push({
			respondent: {
				firstName: '',
				lastName: '',
				id: undefined,
				relationship: null 
			},
			isSaved: false,
			isValid: false
		});
	}

	/** */
	public saveRespondent(respondentEdit: SurveyRespondentEdit): void {
		this._surveyResponderService.addSurveyGroupMember(respondentEdit.respondent).subscribe(
			value => {
				respondentEdit.respondent.id = <number>value;
				respondentEdit.isSaved = true;
			},
			error => {
				console.error(error);
			}
		);
	}

	public deleteRespondent(respondent: SurveyRespondentEdit): void {
		const index = this.respondents.indexOf(respondent);

		this.respondents.splice(index, 1);

		if (respondent.respondent.id !== undefined) {
			this._surveyResponderService.removeSurveyGroupMember(respondent.respondent).subscribe(value => {
				console.log('removed');
			});
		}
	}

	/**
	 *
	 */
	public modelChanged(respondent: SurveyRespondentEdit): void {
		if (respondent.respondent.firstName !== '' && respondent.respondent.lastName !== '') {
			respondent.isValid = true;
		}
		respondent.isSaved = false;
	}

	ngDoCheck(): void {}
}
