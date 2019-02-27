import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StatedPreferenceQuestionComponent } from './viewer/stated-preference-question.component';
import { StatedPreferenceBuilderComponent } from './builder/stated-preference-builder.component';
import { dot } from 'dot';

@NgModule({
	declarations: [StatedPreferenceQuestionComponent, StatedPreferenceBuilderComponent],
	entryComponents: [StatedPreferenceQuestionComponent, StatedPreferenceBuilderComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-sp-question',
					id: 'stated_preference',
					component: StatedPreferenceQuestionComponent
				},
				{
					name: 'traisi-sp-custom-builder',
					id: 'stated_preference_custom_builder',
					component: StatedPreferenceBuilderComponent
				}
			],
			multi: true
		}
	],
	imports: [CommonModule, HttpClientModule]
})
export default class TraisiStatedPreferenceQuestionModule {}