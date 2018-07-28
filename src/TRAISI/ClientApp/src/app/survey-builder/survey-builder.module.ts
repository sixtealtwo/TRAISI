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
import { TooltipModule, ModalModule } from 'ngx-bootstrap';
import { WidgetModule } from '../layout/widget/widget.module';
import { FormsModule } from '@angular/forms';
import { QuestionConfigurationComponent } from './components/question-configuration/question-configuration.component';

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
		ROUTES,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
		})
	],
	declarations: [SurveyBuilderComponent, QuestionTypeChooserComponent, NestedDragAndDropListComponent, QuestionConfigurationComponent],
	providers: [SurveyBuilderEndpointService, SurveyBuilderService]
})
export class SurveyBuilderModule {}
