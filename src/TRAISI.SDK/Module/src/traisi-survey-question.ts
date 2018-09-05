import {QuestionResponseState} from './question-response-state';
import {EventEmitter} from '@angular/core';
import {QuestionConfiguration} from './question-configuration';

export namespace TRAISI {

	export class SurveyQuestion {

		state: QuestionResponseState;

		response: EventEmitter<any>;

		data: QuestionConfiguration[];

		constructor() {
			this.state = QuestionResponseState.PRISTINE;
			this.response = new EventEmitter<any>();
			this.data = [];
		}
	}
}