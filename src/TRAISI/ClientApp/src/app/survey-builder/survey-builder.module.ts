import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import { ROUTES } from './survey-builder.routes';
import { SharedModule } from '../shared/shared.module';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';

import { SurveyBuilderEndpointService } from './services/survey-builder-endpoint.service';
import { SurveyBuilderService } from './services/survey-builder.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { QuestionTypeChooserComponent } from '../survey-builder/components/question-type-chooser/question-type-chooser.component';
import { TooltipModule } from '../../../node_modules/ngx-bootstrap';

@NgModule({
	imports: [CommonModule, SharedModule, NgxSmoothDnDModule, TooltipModule, FroalaEditorModule, FroalaViewModule, ROUTES],
	declarations: [SurveyBuilderComponent, QuestionTypeChooserComponent, NestedDragAndDropListComponent],
	providers: [SurveyBuilderEndpointService, SurveyBuilderService]
})
export class SurveyBuilderModule {}
