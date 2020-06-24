import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ResponseData, ResponseValidationState, OptionSelectResponseData } from 'traisi-question-sdk';
import { SurveyQuestion, ResponseTypes, QuestionConfiguration, SurveyViewer, QuestionOption } from 'traisi-question-sdk';

import templateString from './contact-information-question.component.html';
import styleString from './contact-information-question.component.scss';
import { NgForm } from '@angular/forms';
/**
 *
 * @export
 * @class LikertQuestionComponent
 * @extends {SurveyQuestion<ResponseTypes.List>}
 * @implements {OnInit}
 */
@Component({
	selector: 'traisi-contact-information-question',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class ContactInformationQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {
	@ViewChild('contactForm', { static: true })
	public contactForm: NgForm;

	public model: {
		respondentName: string;
		email: string;
		phoneNumber: string;
	} = {
		email: '',
		respondentName: '',
		phoneNumber: '',
	};

	public traisiOnLoaded(): void {
		console.log(this.configuration);
		this.isLoaded.next(true);
	}

	public ngOnInit(): void {
		this.contactForm.valueChanges.subscribe((v) => {
			if (this.contactForm.status === 'VALID') {
				this.validationState.emit(ResponseValidationState.VALID);
			} else {
				console.log('invalid');
				this.validationState.emit(ResponseValidationState.INVALID);
			}
		});
	}

	public onSubmit() {
		console.log('submitted');
	}
}
