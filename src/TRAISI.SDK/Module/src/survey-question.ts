import {QuestionResponseState} from './question-response-state';
import {EventEmitter} from '@angular/core';

export interface SurveyQuestion {


	state: QuestionResponseState;

	response: EventEmitter<any>;
	

}

