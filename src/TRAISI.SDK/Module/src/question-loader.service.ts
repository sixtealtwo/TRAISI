import { ReplaySubject } from 'rxjs';
import { ComponentFactory } from '@angular/core';
import { SurveyQuestion } from './traisi-survey-question';

export interface QuestionLoaderService {
	componentFactories$: ReplaySubject<ComponentFactory<SurveyQuestion<any>>>;
}
