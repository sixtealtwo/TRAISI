import { Subject } from 'rxjs';
import { IQuestionConfiguration } from './question-configuration';
import { IQuestionOption } from './question-option';
export interface ISurveyViewerService
{
     configurationData: Subject<IQuestionConfiguration[]>;
     options: Subject<IQuestionOption[]>;

};
