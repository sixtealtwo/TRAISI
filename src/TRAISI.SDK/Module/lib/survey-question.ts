export interface ISurveyViewerInstance {
  updateResponse(questionId: number, value: any): void;
  
  getQuestionData(questionId:number):void;
}

/**
 *
 */
export interface ISurveyQuestion {
	new (viewer: ISurveyViewerInstance, questionId: number): ISurveyQuestion;

	questionShown(): void;

  questionHidden(): void;
  
  
}
