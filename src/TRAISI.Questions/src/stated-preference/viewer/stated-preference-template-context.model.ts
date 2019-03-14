import { StatedPreferenceQuestionComponent } from './stated-preference-question.component';

export interface StatedPreferenceTemplateContext {
    response: (questionId: string, type?: string) => void;
    isResponsesLoaded: boolean;
    responsesToLoad: Array<string>;
    component: StatedPreferenceQuestionComponent;

}