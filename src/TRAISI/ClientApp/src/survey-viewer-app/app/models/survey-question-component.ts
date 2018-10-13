import { SurveyModule } from "traisi-sdk/survey-module";
import { ComponentFactory } from "@angular/core";

export interface SurveyQuestionComponent
{
	surveyModule: SurveyModule;
	componentFactory: ComponentFactory<any>;
	questionType: string;

}
