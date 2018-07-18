import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import { ROUTES } from './survey-builder.routes';
import { SharedModule } from '../shared/shared.module';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';

import { SurveyBuilderEndpointService } from './services/survey-builder-endpoint.service';
import { SurveyBuilderService } from './services/survey-builder.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxSmoothDnDModule } from '../shared/ngx-smooth-dnd/ngx-smooth-dnd.module';
import { QuestionTypeChooserComponent } from './components/question-type-chooser/question-type-chooser.component';
import { TooltipModule } from 'ngx-bootstrap';
import { WidgetModule } from '../layout/widget/widget.module';

@NgModule({
	imports: [CommonModule, WidgetModule, SharedModule, NgxSmoothDnDModule, TooltipModule, FroalaEditorModule, FroalaViewModule, ROUTES],
	declarations: [SurveyBuilderComponent, QuestionTypeChooserComponent, NestedDragAndDropListComponent],
	providers: [SurveyBuilderEndpointService, SurveyBuilderService]
})
export class SurveyBuilderModule {}
