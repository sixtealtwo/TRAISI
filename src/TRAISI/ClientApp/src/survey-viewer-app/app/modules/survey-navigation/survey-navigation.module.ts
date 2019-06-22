import { NgModule } from '@angular/core';
import { SurveyNavigator } from './services/survey-navigator/survey-navigator.service';

@NgModule({
	imports: [],
	declarations: [],
	providers: [SurveyNavigator],
	exports: [SurveyNavigator]
})
export class SurveyNavigationModule {}
