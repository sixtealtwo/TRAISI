export enum SurveyNavigatorEventType {
	NextPressed = 'NextPressed',
	PreviousPressed = 'PreviousPressed',
	NavigatedToSection = 'NavigatedToSection',
	NavigatedToPage = 'NavigatedToPage',
	NavigatedToSurveyEnd = 'NavigatedToSurveyEnd',
}

export interface SurveyNavigatorEvent {
	eventType: SurveyNavigatorEventType;
	eventValue?: any;
}
