import { Component, OnInit, AfterContentInit } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';

@Component({
	selector: 'app-dropdown-list',
	templateUrl: './dropdown-list.component.html'
})

export class DropdownListComponent implements OnInit {

	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;

	public dropDownListSelectedId: string;

	// Dropdown List
	public dropDownListItems: Array<string> = [];

	constructor(
		private alertService: AlertService
	) {}

	ngOnInit() {
		let optionData = JSON.parse(this.questionConfiguration.resourceData);
		optionData.options.forEach((element) => {
			this.dropDownListItems.push(element);
		});

		if (this.dropDownListSelectedId === undefined) {
			this.setDefaultValue();
		}
	}

	setDefaultValue() {
		this.dropDownListSelectedId = this.dropDownListItems[0];
	}

	getValue(){
		if (this.dropDownListSelectedId === null){
			this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Not Completed',
			`Please fill the form completely`,
			MessageSeverity.error
		);
			return;
		}
		return JSON.stringify({id: this.dropDownListSelectedId});
	}

	processPriorValue(last: string) {
		this.dropDownListSelectedId = JSON.parse(last).id;
	}

	valueChanged(e){
		this.dropDownListSelectedId = this.dropDownListItems.filter(dd => dd === e)[0];
	}

}
