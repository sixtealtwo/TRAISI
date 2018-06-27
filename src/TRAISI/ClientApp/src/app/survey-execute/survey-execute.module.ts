import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { SurveyExecuteComponent } from './survey-execute.component';
import { ROUTES } from './survey-execute.routes';
import { TestSurveyComponent } from './test-survey/test-survey.component';
import { LiveSurveyComponent } from './live-survey/live-survey.component';

@NgModule({
	imports: [
		CommonModule,
		ROUTES,
		FormsModule,
		SharedModule,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
		})
	],
	declarations: [SurveyExecuteComponent, TestSurveyComponent, LiveSurveyComponent]
})
export class SurveyExecuteModule {}
