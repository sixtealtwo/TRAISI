import { Component, OnInit, Inject } from '@angular/core';
import { ResponseData, ResponseValidationState, OptionSelectResponseData } from 'traisi-question-sdk';
import { SurveyQuestion, ResponseTypes, QuestionConfiguration, SurveyViewer, QuestionOption } from 'traisi-question-sdk';

import templateString from './contact-information-question.component.html';
import styleString from './contact-information-question.component.scss';
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
    public ngOnInit(): void {}
    

    public traisiOnLoaded(): void {
        console.log(this.configuration);
    }
}
