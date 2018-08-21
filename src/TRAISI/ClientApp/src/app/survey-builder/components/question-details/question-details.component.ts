import { Component, OnInit, Input } from '@angular/core';
import { Utilities } from '../../../services/utilities';
import { QuestionPart } from '../../models/question-part.model';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionOptionDefinition } from '../../models/question-option-definition.model';

@Component({
	selector: 'app-question-details',
	templateUrl: './question-details.component.html',
	styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
	public items = [1, 2, 3];
	public changeMade = [];

	public questionOptionDefinitions: QuestionOptionDefinition[] = [];

	@Input()
	public question: QuestionPart;
	@Input()
	public language: string;
	@Input()
	public qTypeDefinitions: Map<string, QuestionTypeDefinition> = new Map<string, QuestionTypeDefinition>();

	constructor() {
		this.getOptionPayload = this.getOptionPayload.bind(this);
	}

	ngOnInit() {
		let qOptions = this.qTypeDefinitions.get(this.question.questionType).questionOptions;
		Object.keys(qOptions).forEach(q => {
			this.questionOptionDefinitions.push(qOptions[q]);
		});
	}

	public getOptionPayload(index: number) {
		return this.items[index];
	}

	public onDrop(dropResult: any) {
		this.items = Utilities.applyDrag(this.items, dropResult);
	}

	public optionChanged(item: any): boolean {
		return this.changeMade.find(r => r === item) !== undefined;
	}

	public indicateChange(item: any) {
		if (this.changeMade.find(r => r === item) === undefined) {
			this.changeMade.push(item);
		}
	}
}
