import { ReplaySubject } from 'rxjs';
import { ComponentFactory } from '@angular/core';
import { TRAISI } from './traisi-survey-question';

export interface QuestionLoaderService {
	componentFactories$: ReplaySubject<ComponentFactory<TRAISI.SurveyQuestion<any>>>;
}
