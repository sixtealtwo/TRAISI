import { Subject } from 'rxjs';
import { QuestionConfiguration } from './question-configuration';
import { QuestionOption } from './question-option';
export interface ISurveyViewerService
{
     configurationData: Subject<QuestionConfiguration[]>;
     options: Subject<QuestionOption[]>;

};
