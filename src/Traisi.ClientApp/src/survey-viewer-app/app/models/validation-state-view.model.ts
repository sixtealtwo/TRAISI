import { ValidationState } from "traisi-question-sdk/question-response-state";

export interface ValidationStateViewModel { 
    relatedQuestions?: number[] | undefined;
    validationState: ValidationState;
    errorMessages: string[] | undefined;
}