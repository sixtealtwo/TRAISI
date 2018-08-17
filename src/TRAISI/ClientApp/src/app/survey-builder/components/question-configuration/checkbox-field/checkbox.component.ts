import { Component, OnInit } from '@angular/core';
// import { SharedDataService } from '../../../services/shared-data.service';
// import { Parameters } from '../../../models/simulationModel/parameters.model';

@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
	public title;
	public name;
	// public currentParamter: Parameters;

	public options = [];

	constructor() {}// private sharedDataService: SharedDataService) {}

	ngOnInit() {
	/*	this.sharedDataService.parameterlistCache.forEach(parameter => {
			if (parameter.name === this.name) {
				this.currentParamter = new Parameters(
					parameter.id,
					this.name,
					parameter.description,
					parameter.type
				);

				for (let index = 0; index < parameter.status.length; index++) {
					this.options.push({
						id: this.name + '_' + index,
						status: parameter.status[index],
						label: parameter.label[index]
					});
				}
			}
		});*/

	}

	onChange(event, option) {
		option.status = !option.status;
	}

	getValue() {
		let data = [];
		this.options.forEach(option => {
			if (option.status) {
				data.push({ label: option.label });
			}
		});
		// this.currentParamter.data = JSON.stringify(data);
		// return this.currentParamter;
	}
}
