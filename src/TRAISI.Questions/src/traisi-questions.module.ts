import { NgModule } from '@angular/core';
import { TextQuestionComponent } from './text-question/text-question.component';
import { RadioQuestionComponent } from './radio-question/radio-question.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxQuestionComponent } from './checkbox-question/checkbox-question.component';
import { LikertQuestionComponent } from './likert-question/likert-question.component';
import { MatrixQuestionComponent } from './matrix-question/matrix-question.component';
import { NumberQuestionComponent } from './number-question/number-question.component';
import { RangeQuestionComponent } from './range-question/range-question.component';
import { SelectQuestionComponent } from './select-question/select-question.component';
import { HeadingQuestionComponent } from './heading-question/heading-question.component';
import { DateQuestionComponent } from './date-question/date-question.component';
import { TimeQuestionComponent } from './time-question/time-question.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
	declarations: [
		TextQuestionComponent,
		RadioQuestionComponent,
		NumberQuestionComponent,
		RangeQuestionComponent,
		CheckboxQuestionComponent,
		SelectQuestionComponent,
		HeadingQuestionComponent,
		TimeQuestionComponent,
		DateQuestionComponent,
		LikertQuestionComponent
	],
	entryComponents: [
		TextQuestionComponent,
		RadioQuestionComponent,
		NumberQuestionComponent,
		RangeQuestionComponent,
		CheckboxQuestionComponent,
		SelectQuestionComponent,
		HeadingQuestionComponent, 
		TimeQuestionComponent,
		DateQuestionComponent,
		LikertQuestionComponent
	],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-text-question',
					id: 'text',
					component: TextQuestionComponent
				},
				{
					name: 'traisi-radio-question',
					id: 'radio',
					component: RadioQuestionComponent
				},
				{
					name: 'traisi-checkbox-question',
					id: 'checkbox',
					component: CheckboxQuestionComponent
				},
				{
					name: 'traisi-likert-question',
					id: 'likert',
					component: LikertQuestionComponent
				},
				{
					name: 'traisi-matrix-question',
					id: 'matrix',
					component: MatrixQuestionComponent
				},
				{
					name: 'traisi-number-question',
					id: 'number',
					component: NumberQuestionComponent
				},
				{
					name: 'traisi-range-question',
					id: 'range',
					component: RangeQuestionComponent
				},
				{
					name: 'traisi-select-question',
					id: 'select',
					component: SelectQuestionComponent
				},
				{
					name: 'traisi-heading-question',
					id: 'heading',
					component: HeadingQuestionComponent
				},
				{
					name: 'traisi-date-question',
					id: 'date',
					component: DateQuestionComponent
				},
				{
					name: 'traisi-time-question',
					id: 'time',
					component: TimeQuestionComponent
				}
			],
			multi: true
		}
	],
	imports: [
		CommonModule,
		FontAwesomeModule,
		FormsModule,
		HttpClientModule,
		BsDatepickerModule.forRoot()
	]
})
export default class TraisiQuestions {}
