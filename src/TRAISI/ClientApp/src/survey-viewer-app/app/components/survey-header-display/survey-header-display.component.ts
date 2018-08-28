import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'traisi-survey-header-display',
	templateUrl: './survey-header-display.component.html',
	styleUrls: ['./survey-header-display.component.scss']
})
export class SurveyHeaderDisplayComponent implements OnInit {

	@Input()
	headerSection: any[];

	constructor() {
	}

	ngOnInit() {
	}

}
