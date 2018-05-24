import { NgModule } from '@angular/core';
import {TextQuestionComponent} from './text-question/text-question.component';

@NgModule({
    declarations: [TextQuestionComponent],
    entryComponents: [TextQuestionComponent],
    providers: [
        {
            provide: 'widgets',
            useValue: [
                {
                    name: 'traisi-text-question',
                    component: TextQuestionComponent
                }
            ],
            multi: true
        }
    ]
})
export default class TraisiQuestions {

}