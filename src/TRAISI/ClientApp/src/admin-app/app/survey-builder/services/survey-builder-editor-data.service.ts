import { Injectable } from "@angular/core";
import { QuestionTypeDefinition } from '../models/question-type-definition';

@Injectable()
export class SurveyBuilderEditorData {
    public surveyId: number;
    
    public questionTypeDefinitions: Map<string, QuestionTypeDefinition> = new Map<
		string,
		QuestionTypeDefinition
    >();
    
	public initialize(surveyId: number) {
		this.surveyId = surveyId;
	}
	public constructor() {}
}
