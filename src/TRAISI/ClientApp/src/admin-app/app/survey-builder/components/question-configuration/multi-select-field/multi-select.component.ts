import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';
import { Select2OptionData } from 'ng2-select2';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
	selector: 'app-multi-select',
	templateUrl: './multi-select.component.html',
	styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;

	public options: Select2OptionData[] = [];
	public selected: string[] = [];

	public select2Options: any = {
		theme: 'bootstrap',
		multiple: true
	};
	public multiSelectValues: string;

	@ViewChild('selectElement', { static: true })
	public selectElement: ElementRef;

	constructor() {}

	public ngOnInit(): void {
		let optionData = JSON.parse(this.questionConfiguration.resourceData);
		optionData.options.forEach(element => {
			this.options.push({ text: element, id: element });
		});

		$(this.selectElement.nativeElement)['selectpicker']();
		this.setDefaultValue();

		$(this.selectElement.nativeElement).on('changed.bs.select', (e, clickedIndex, isSelected, previousValue) => {
			// do something...
			let values: Array<string> = $(this.selectElement.nativeElement)['selectpicker']('val');
			this.multiSelectValues = values.join(' | ');
			// console.log(e);
		});
	}

	public setDefaultValue() {
		this.multiSelectValues = this.questionConfiguration.defaultValue;
		this.selected.push(this.questionConfiguration.defaultValue);
	}

	public getValue() {
		return JSON.stringify(this.multiSelectValues);
	}

	/**
	 *
	 * @param last
	 */
	public processPriorValue(last: string): void {
		this.multiSelectValues = JSON.parse(last);
		this.selected = this.multiSelectValues.split(' | ');

		setTimeout(() => {
			(<any>$(this.selectElement.nativeElement)).selectpicker('val', this.selected);
			(<any>$(this.selectElement.nativeElement)).selectpicker('refresh');
			console.log((<any>$(this.selectElement.nativeElement)).selectpicker().val());
		});
	}

	public getSelect2GroupedList(): Select2OptionData[] {
		return this.options;
	}
	public changed(data: { value: string[] }) {
		// this.multiSelectValues = data.value.join(' | ');
	}
}
