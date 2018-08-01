import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit {

	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: any;

	public configurations: any[];

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

	processConfigurations() {
		this.configurations = Object.keys(this.questionType.questionConfigurations);
	}
}
