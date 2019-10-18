import { NgModule } from '@angular/core';
import { PopupComponent } from './components/popup/popup.component';
import { SurveyQuestionInternalViewDirective } from './directives/survey-question-internal-view.directive';
import { SurveyQuestionViewDirective } from './directives/survey-question-view.directive';

@NgModule({
	entryComponents: [PopupComponent],
	exports: [PopupComponent],
	declarations: [PopupComponent, SurveyQuestionInternalViewDirective, SurveyQuestionViewDirective]
})
export class TraisiSdkModule {
	public constructor() {}
}
