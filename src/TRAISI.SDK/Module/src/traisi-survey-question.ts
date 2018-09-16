import {QuestionResponseState} from './question-response-state';
import {EventEmitter} from '@angular/core';
import {QuestionConfiguration} from './question-configuration';

export namespace TRAISI {

	export class SurveyQuestion {

		state: QuestionResponseState;

		response: EventEmitter<Response>;

		data: QuestionConfiguration[];

		constructor() {
			this.state = QuestionResponseState.PRISTINE;
			this.response = new EventEmitter<Response>();
			this.data = [];
		}
	}


	/**
	 * Interface for passing response information - includes type and actual response data.
	 *
	 * @export
	 * @interface Response
	 */
	export interface Response {

		responseType: string;
		responseData: any;
	}
}
