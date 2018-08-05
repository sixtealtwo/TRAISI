import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit {

	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;

	public newQuestion: boolean = true;

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

	delete() {
		this.configResult.emit('delete');
	}

	processConfigurations() {
		this.configurations = Object.keys(this.questionType.questionConfigurations);
	}
}
