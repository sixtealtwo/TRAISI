import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { HouseholdQuestionComponent } from 'household-question/household-question.component';
import { TextMaskModule } from 'angular2-text-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumberQuestionValidatorDirective } from 'number-question/number-question-validator.directive';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
export const forRoot: ModuleWithProviders = BsDatepickerModule.forRoot();
export const tooltipForRoot: ModuleWithProviders = TooltipModule.forRoot();
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
		LikertQuestionComponent,
		NumberQuestionValidatorDirective,
		HouseholdQuestionComponent
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
		LikertQuestionComponent,
		HouseholdQuestionComponent
	],
	providers: [
		{
			provide: 'widgets',
			multi: true,
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
				},
				{
					name: 'household-question',
					id: 'household',
					component: HouseholdQuestionComponent
				},
				{
					name: 'slider-question',
					id: 'slider',
					component: HouseholdQuestionComponent
				}
			]
			]
		}
	],
	imports: [CommonModule, FormsModule, HttpClientModule, forRoot, tooltipForRoot,
		 TextMaskModule, NgSelectModule, TimepickerModule,]
})
export default class TraisiQuestions {
	public components: Array<{ name: string; id: string; component: any }>;

	public constructor() {
		this.components = [];
		this.components.push({
			name: 'traisi-time-question',
			id: 'time',
			component: TimeQuestionComponent
		});
	}
}
