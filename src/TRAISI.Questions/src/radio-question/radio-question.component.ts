import {Component, Inject, OnInit} from '@angular/core';
import {ISurveyViewerService, QuestionOption} from "traisi-question-sdk";


@Component({
    selector: 'traisi-radio-question',
    template: <string>require('./radio-question.component.html'),
    styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent implements OnInit {

    readonly QUESTION_TYPE_NAME: string = 'Radio Question';


    questionOptions: QuestionOption[];

    typeName: string;
    icon: string;

    constructor(@Inject('ISurveyViewerService') private _surveyViewerService: ISurveyViewerService) {

        this.questionOptions = [];
    }


    ngOnInit() {


        this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {
            this.questionOptions = value;
        });
    }
}
