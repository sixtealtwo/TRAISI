import { NgModule, ModuleWithProviders } from '@angular/core';
import { SurveyNavigator } from './services/survey-navigator/survey-navigator.service';

@NgModule({
	imports: [],
	declarations: [],
	providers: [],
	exports: []
})
export class SurveyNavigationModule {
	public static forRoot(): ModuleWithProviders {
		return {
		  ngModule: SurveyNavigationModule,
		  providers: [ SurveyNavigator ]
		};
	  }
}
