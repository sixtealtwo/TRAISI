import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SurveyViewerService} from "../../services/survey-viewer.service";

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		SurveyViewerService
	]
})
export class CoreModule {
}
