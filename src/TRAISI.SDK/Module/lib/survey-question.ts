export interface ISurveyViewerInstance {
	updateResponse(questionId: number, value: any): void;
}

/**
 *
 */
export interface ISurveyQuestion {
	new (viewer: ISurveyViewerInstance, questionId: number): ISurveyQuestion;

	questionShown(): void;

	questionHidden(): void;
}
