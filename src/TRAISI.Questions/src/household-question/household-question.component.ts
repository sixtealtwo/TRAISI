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
	SurveyRespondent,
	ResponseValidationState
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

	public primaryRespondent;
	SurveyRespondentEdit;

	public relationships: Array<string> = ['Spouse/Partner', 'Child', 'Parent', 'Grandparent', 'Grandchild', 'Roommate', 'Other'];

	/**
	 *
	 * @param _surveyResponderService
	 */
	constructor(@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder, private _cdRef: ChangeDetectorRef) {
		super();

		this.respondents = [];

		this.primaryRespondent = {
			respondent: {
				firstName: '',
				lastName: '',
				id: -1
			},
			isSaved: false,
			isValid: false
		};
	}

	ngOnInit(): void {
		this.validationState.emit(ResponseValidationState.INVALID);

		this._surveyResponderService.getSurveyGroupMembers().subscribe(value => {
			const arr = <Array<SurveyRespondent>>value;

			if (arr.length >= 1) {
				this.validationState.emit(ResponseValidationState.VALID);
				this.primaryRespondent = {
					respondent: arr[0],
					isSaved: true,
					isValid: true
				};
			}
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
				name: '',
				id: undefined,
				relationship: null
			},
			isSaved: false,
			isValid: false
		});
	}

	/** */
	public saveRespondent(respondentEdit: SurveyRespondentEdit): void {
		if (respondentEdit.respondent.id === undefined) {
			this._surveyResponderService.addSurveyGroupMember(respondentEdit.respondent).subscribe(
				value => {
					respondentEdit.respondent.id = <number>value;
					respondentEdit.isSaved = true;
				},
				error => {
					console.error(error);
				}
			);
		} else {
			this._surveyResponderService.updateSurveyGroupMember(respondentEdit.respondent).subscribe(
				value => {
					respondentEdit.isSaved = true;
				},
				error => {
					console.error(error);
				}
			);
		}
	}

	/**
	 *
	 */
	public deleteRespondent(respondent: SurveyRespondentEdit): void {
		const index = this.respondents.indexOf(respondent);

		this.respondents.splice(index, 1);

		if (respondent.respondent.id !== undefined) {
			this._surveyResponderService.removeSurveyGroupMember(respondent.respondent).subscribe(value => {});
		}
	}

	/**
	 *
	 */
	public modelChanged(respondent: SurveyRespondentEdit): void {
		if (respondent.respondent.name !== '' && respondent.respondent.relationship !== null) {
			respondent.isValid = true;
		}

		respondent.isSaved = false;

	}

	public primaryModelChanged(): void {}

	public primaryBlur(): void {
		if (this.primaryRespondent.respondent.name !== '') {
			this._surveyResponderService.updateSurveyGroupMember(this.primaryRespondent.respondent).subscribe(
				value => {
					this.primaryRespondent.isSaved = true;
					this.validationState.emit(ResponseValidationState.VALID);
				},
				error => {
					console.error(error);
				}
			);
		} else {
			this.validationState.emit(ResponseValidationState.INVALID);
		}
	}

	ngDoCheck(): void {}
}
