import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { SurveyViewPage } from './survey-view-page.model';
export interface SurveyViewQuestion {
	configuration: object | Array<any> | any;
	id: number;
	isOptional: boolean;
	isRepeat: boolean;
	label: string;
	order: number;
	viewOrder: number;
	questionId: number;
	questionType: string;
	pageIndex: number;
	typeName: string;

	 // convenient ref to section or page

	 parentSection: SurveyViewSection;
	 parentPage: SurveyViewPage;
}
