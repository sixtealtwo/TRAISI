import { ResponseValidationState } from './question-response-state';
import { EventEmitter, Output, Inject, ChangeDetectorRef, Component, Directive } from '@angular/core';
import { QuestionConfiguration } from './question-configuration';
import { QuestionLoaderService } from './question-loader.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Directive({
	selector: 'traisiSurveyQuestionInternalView',
	exportAs: 'traisiSurveyQuestionInternalView'
})
export class SurveyQuestionInternalViewDirective {}
