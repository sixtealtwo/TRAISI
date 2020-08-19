import { Component, OnInit, AfterContentInit } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';
import { AlertService, MessageSeverity } from '../../../../../../shared/services/alert.service';

@Component({
	selector: 'app-dropdown-list',
	templateUrl: './dropdown-list.component.html',
})
export class DropdownListComponent implements OnInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;
	public options: { value: string; label: string }[] = [];
	public selected: string;

	constructor(private alertService: AlertService) {}

	ngOnInit() {
		let optionData = JSON.parse(this.questionConfiguration.resourceData);
		optionData.options.forEach((element) => {
			this.options.push({
				label: element,
				value: element,
			});
		});
	}

	/**
	 *
	 * @param last
	 */
	public processPriorValue(last: string): void {
		this.selected = last;
	}

	public onChanged(event): void {
		console.log(event);
		console.log(this.selected);
	}
	getValue() {
		if (this.selected === null) {
			this.alertService.stopLoadingMessage();
			this.alertService.showStickyMessage(
				'Not Completed',
				`Please fill the form completely`,
				MessageSeverity.error
			);
			return;
		}
		return this.selected ;
	}
}
