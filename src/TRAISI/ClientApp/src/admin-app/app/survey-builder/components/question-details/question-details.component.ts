import { Component, OnInit, Input } from '@angular/core';
import { Utilities } from '../../../services/utilities';
import { QuestionPart } from '../../models/question-part.model';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionOptionDefinition } from '../../models/question-option-definition.model';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionOptionValue } from '../../models/question-option-value';
import { QuestionOptionLabel } from '../../models/question-option-label.model';
import { AlertService, DialogType } from '../../../services/alert.service';
import { Order } from '../../models/order.model';

@Component({
	selector: 'app-question-details',
	templateUrl: './question-details.component.html',
	styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
	public items: Map<string, QuestionOptionValue[]> = new Map<string, QuestionOptionValue[]>();
	public savedItems: Map<number, string> = new Map<number, string>();
	public changeMade = [];
	public addingOption: boolean = false;
	public reordering: boolean = true;

	public questionOptionDefinitions: QuestionOptionDefinition[] = [];

	@Input()
	public surveyId: number;
	@Input()
	public question: QuestionPart;
	@Input()
	public language: string;
	@Input()
	public qTypeDefinitions: Map<string, QuestionTypeDefinition> = new Map<string, QuestionTypeDefinition>();

	constructor(private builderService: SurveyBuilderService, private alertService: AlertService) {
		this.getOptionPayload = this.getOptionPayload.bind(this);
	}

	ngOnInit() {
		let qOptions = this.qTypeDefinitions.get(this.question.questionType).questionOptions;
		Object.keys(qOptions).forEach(q => {
			this.questionOptionDefinitions.push(qOptions[q]);
			this.items.set(q, []);
		});

		this.builderService
			.getQuestionPartOptions(this.surveyId, this.question.id, this.language)
			.subscribe(options => {
				if (options !== null) {
					options.forEach(option => {
						this.items.get(option.name).push(option);
						this.savedItems.set(option.id, option.optionLabel.value);
					});

					Object.keys(qOptions).forEach(qName => {
						if (this.items.get(qName).length === 0) {
							this.addOption(qName);
						}
					});
				}
				this.reordering = false;
			},
			error => {
				this.reordering = false;
			});
	}

	public getOptionPayload(index: number) {
		return this.items[index];
	}

	public onDrop(dropResult: any, optionName: string) {
		this.reordering = true;
		let optionList = this.items.get(optionName);
		optionList = Utilities.applyDrag(optionList, dropResult);
		this.items.set(optionName, optionList);
		this.updateQuestionOrder(optionList);
		let newOrder: Order[] = optionList.map(ap => new Order(ap.id, ap.order));
		this.builderService.updateQuestionPartOptionsOrder(this.surveyId, this.question.id, newOrder).subscribe(
			result => {
				this.reordering = false;
			},
			error => {
				this.reordering = false;
			}
		);
	}

	public optionChanged(item: QuestionOptionValue): boolean {
		return this.savedItems.get(item.id) !== item.optionLabel.value;
	}

	public updateQuestionOrder(options: QuestionOptionValue[]) {
		options.forEach((q, index) => (q.order = index));
	}

	public addOption(optionDefName: string) {
		this.addingOption = true;
		let newOption = new QuestionOptionValue(
			0,
			optionDefName,
			new QuestionOptionLabel(0, '', this.language),
			this.items.get(optionDefName).length
		);
		this.builderService.setQuestionPartOption(this.surveyId, this.question.id, newOption).subscribe(addedOption => {
			this.items.get(optionDefName).push(addedOption);
			this.savedItems.set(addedOption.id, addedOption.optionLabel.value);
			this.addingOption = false;
		},
		error => {
			this.addingOption = false;
		});
	}

	public deleteOption(optionDefName: string, order: number) {
		this.alertService.showDialog('Are you sure you want to delete this option?', DialogType.confirm,
			() => {
				let optionList = this.items.get(optionDefName);
				this.builderService.deleteQuestionPartOption(this.surveyId, this.question.id, optionList[order].id).subscribe(success => {
					let deleted = optionList.splice(order, 1);
					this.savedItems.delete(deleted[0].id);
					this.updateQuestionOrder(optionList);
				});
			});
	}

	public saveOption(option: QuestionOptionValue) {
		this.builderService.setQuestionPartOption(this.surveyId, this.question.id, option).subscribe( result => {
			this.savedItems.set(option.id, option.optionLabel.value);
		});

	}
}
