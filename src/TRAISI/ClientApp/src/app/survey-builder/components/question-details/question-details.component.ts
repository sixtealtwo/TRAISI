import { Component, OnInit, Input } from '@angular/core';
import { Utilities } from '../../../services/utilities';

@Component({
	selector: 'app-question-details',
	templateUrl: './question-details.component.html',
	styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
	public items = [1, 2, 3];
	public changeMade = [];

	@Input()
	public questionId: number;

	constructor() {
		this.getOptionPayload = this.getOptionPayload.bind(this);
	}

	ngOnInit() {}

	public getOptionPayload(index: number) {
		return this.items[index];
	}

	public onDrop(dropResult: any) {
		this.items = Utilities.applyDrag(
			this.items,
			dropResult
		);
	}

	public optionChanged(item: any): boolean
	{
		return this.changeMade.find(r => r === item) !== undefined;
	}

	public indicateChange(item: any) {
		if (this.changeMade.find(r => r === item) === undefined) {
			this.changeMade.push(item);
		}
	}
}
