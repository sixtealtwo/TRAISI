import { Subject } from 'rxjs';
import { IQuestionConfiguration } from './question-configuration';
export interface ISurveyViewerService
{
     configurationData: Subject<IQuestionConfiguration[]>;

};
