import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit {
	@Output()
	configResult = new EventEmitter<string>();

	constructor() {}

	ngOnInit() {}

	saveConfiguration() {
		this.configResult.emit('save');
	}

	cancel() {
		this.configResult.emit('cancel');
	}
}
