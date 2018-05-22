import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import { ROUTES } from './survey-builder.routes';
import { SharedModule } from '../shared/shared.module';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';
import { QuestionTypeChooserComponent } from './components/question-type-chooser/question-type-chooser.component';
import { SurveyBuilderEndpointService } from './services/survey-builder-endpoint.service';
import { SurveyBuilderService } from './services/survey-builder.service';

@NgModule({
	imports: [CommonModule, SharedModule, ROUTES],
	declarations: [
		SurveyBuilderComponent,
		NestedDragAndDropListComponent,
		QuestionTypeChooserComponent
	],
	providers: [
		SurveyBuilderEndpointService,
		SurveyBuilderService,
	]
})
export class SurveyBuilderModule {}
