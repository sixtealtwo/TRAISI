import { SurveyQuestion, ResponseTypes, OnVisibilityChanged } from "traisi-question-sdk";
import { Component, ViewEncapsulation, OnInit, AfterViewInit } from "@angular/core";

import templateString from './travel-diary-question.component.html';
import styleString from './travel-diary-question.component.scss';

@Component({
	selector: 'traisi-travel-diary-question',
	template: '' + templateString,
	encapsulation: ViewEncapsulation.None,
	styles: ['' + styleString],
})
export class TravelDiaryQuestionComponent extends SurveyQuestion<ResponseTypes.Location> implements OnInit, AfterViewInit, OnVisibilityChanged {

    public viewDate: Date = new Date();
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    ngAfterViewInit(): void {
        throw new Error("Method not implemented.");
    }
    onQuestionShown(): void {
        throw new Error("Method not implemented.");
    }
    onQuestionHidden(): void {
        throw new Error("Method not implemented.");
    }

}