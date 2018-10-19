
import { ComponentFactory } from '@angular/core/src/render3';

import { ResponseTypes, SurveyQuestion } from './survey-question';

export class SurveyModule {
	/**
	 *
	 */
	public traisiBootstrap<T extends ResponseTypes>(component: SurveyQuestion<T>): void {}
}
