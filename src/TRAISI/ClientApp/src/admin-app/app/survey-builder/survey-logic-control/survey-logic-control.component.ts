import { OnInit, Component, OnDestroy } from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';
import { defaultConfig } from './query-config';
@Component({
	selector: "traisi-survey-logic-control",
	templateUrl: "./survey-logic-control.component.html",
	styleUrls: ["./survey-logic-control.component.html"],
	providers: [],
	animations: []
})
export class SurveyBuilderComponent implements OnInit, OnDestroy {

    public config: QueryBuilderConfig;

    public constructor( ) {
        this.config = defaultConfig;
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
}