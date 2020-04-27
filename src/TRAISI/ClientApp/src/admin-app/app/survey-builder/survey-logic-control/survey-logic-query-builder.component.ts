import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { QueryBuilderComponent } from 'angular2-query-builder';

@Component({
	selector: 'traisi-survey-logic-query-builder',
	templateUrl: './survey-logic-query-builder.component.html',
	styleUrls: ['./survey-logic-query-builder.component.scss'],
})
export class SurveyLogicQueryBuilderComponent extends QueryBuilderComponent {
    @Input()
    public rootLevel: boolean = false;
}