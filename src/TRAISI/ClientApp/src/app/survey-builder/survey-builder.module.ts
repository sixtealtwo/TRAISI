import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import { ROUTES } from './survey-builder.routes';
import { SharedModule } from '../shared/shared.module';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';
import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { SurveyBuilderEndpointService } from './services/survey-builder-endpoint.service';
import { SurveyBuilderService } from './services/survey-builder.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxSmoothDnDModule } from '../shared/ngx-smooth-dnd/ngx-smooth-dnd.module';
import { QuestionTypeChooserComponent } from './components/question-type-chooser/question-type-chooser.component';
import { TooltipModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { WidgetModule } from '../layout/widget/widget.module';
import { FormsModule } from '@angular/forms';
import { QuestionConfigurationComponent } from './components/question-configuration/question-configuration.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { Select2Module } from 'ng2-select2';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import { CheckboxComponent } from './components/question-configuration/checkbox-field/checkbox.component';
import { DateInputComponent } from './components/question-configuration/date-input-field/date-input.component';
import { DropdownListComponent } from './components/question-configuration/dropdown-list-field/dropdown-list.component';
import { MultiSelectComponent } from './components/question-configuration/multi-select-field/multi-select.component';
import { TextboxComponent } from './components/question-configuration/textbox-field/textbox.component';
import { TextAreaComponent } from './components/question-configuration/textarea-field/textarea.component';
import { NumericTextboxComponent } from './components/question-configuration/numeric-textbox-field/numeric-textbox.component';
import { SliderComponent } from './components/question-configuration/slider-field/slider.component';
import { SwitchComponent } from './components/question-configuration/switch-field/switch.component';
import { TimeInputComponent } from './components/question-configuration/time-input-field/time-input.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { LocationFieldComponent } from './components/question-configuration/location-field/location.component';
import { RadioComponent } from './components/question-configuration/radio-field/radio.component';

@NgModule({
	imports: [
		CommonModule,
		WidgetModule,
		SharedModule,
		ModalModule,
		FormsModule,
		NgxSmoothDnDModule,
		TooltipModule,
		FroalaEditorModule,
		FroalaViewModule,
		BsDatepickerModule.forRoot(),
		NgxSelectModule,
		NgxBootstrapSliderModule,
		Select2Module,
		AmazingTimePickerModule,
		NgxMapboxGLModule.forRoot({
			accessToken:
				'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2oyOTlwdjNjMDB5cTMzcXFsdmRyM3NnNCJ9.NXgWTnWfvGRnNgkWdd5wKg'
		}),
		ROUTES,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
		})
	],
	declarations: [
		SurveyBuilderComponent,
		QuestionTypeChooserComponent,
		NestedDragAndDropListComponent,
		QuestionConfigurationComponent,
		CheckboxComponent,
		DateInputComponent,
		DropdownListComponent,
		MultiSelectComponent,
		TextboxComponent,
		TextAreaComponent,
		NumericTextboxComponent,
		SliderComponent,
		SwitchComponent,
		TimeInputComponent,
		LocationFieldComponent,
		RadioComponent
	],
	providers: [SurveyBuilderEndpointService, SurveyBuilderService],
	entryComponents: [
		CheckboxComponent,
		DateInputComponent,
		DropdownListComponent,
		MultiSelectComponent,
		TextboxComponent,
		TextAreaComponent,
		NumericTextboxComponent,
		SliderComponent,
		SwitchComponent,
		TimeInputComponent,
		LocationFieldComponent,
		RadioComponent
	]
})
export class SurveyBuilderModule {}
