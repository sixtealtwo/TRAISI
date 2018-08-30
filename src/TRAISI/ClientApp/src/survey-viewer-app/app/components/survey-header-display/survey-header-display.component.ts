import {Component, Input, OnInit} from '@angular/core';
import {SurveyViewPage} from '../../models/survey-view-page.model';

@Component({
	selector: 'traisi-survey-header-display',
	templateUrl: './survey-header-display.component.html',
	styleUrls: ['./survey-header-display.component.scss']
})
export class SurveyHeaderDisplayComponent implements OnInit {


	public pages: Array<SurveyViewPage> = [];



	constructor() {
	}

	ngOnInit() {
	}

}
