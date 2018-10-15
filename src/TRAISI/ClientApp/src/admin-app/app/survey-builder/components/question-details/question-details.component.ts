import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Utilities } from '../../../../../shared/services/utilities';
import { QuestionPart } from '../../models/question-part.model';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionOptionDefinition } from '../../models/question-option-definition.model';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionOptionValue } from '../../models/question-option-value.model';
import { QuestionOptionLabel } from '../../models/question-option-label.model';
import { AlertService, DialogType, MessageSeverity } from '../../../../../shared/services/alert.service';
import { Order } from '../../models/order.model';

@Component({
	selector: 'app-question-details',
	templateUrl: './question-details.component.html',
	styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
	public items: Map<string, QuestionOptionValue[]> = new Map<string, QuestionOptionValue[]>();
	public pendingOption: QuestionOptionValue;
	public savedItems: Map<number, string> = new Map<number, string>();

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

	@ViewChild('newOptionKey')
	public newOptionKey: ElementRef;

	constructor(private builderService: SurveyBuilderService, private alertService: AlertService) {
		this.getOptionPayload = this.getOptionPayload.bind(this);
	}

	public ngOnInit(): void {
		let qOptions = this.qTypeDefinitions.get(this.question.questionType).questionOptions;
		Object.keys(qOptions).forEach(q => {
			this.questionOptionDefinitions.push(qOptions[q]);
			this.items.set(q, []);
		});

		this.builderService.getQuestionPartOptions(this.surveyId, this.question.id, this.language).subscribe(
			options => {
				if (options !== null) {
					options.forEach(option => {
						this.items.get(option.name).push(option);
						this.savedItems.set(option.id, `${option.code}|${option.optionLabel.value}`);
					});
				}
				this.reordering = false;
			},
			error => {
				this.reordering = false;
			}
		);
	}

	public onArrowRight(event: KeyboardEvent, element: HTMLInputElement): void {
		let nextInput: HTMLInputElement;

		if (element.selectionEnd === element.value.length) {
			event.preventDefault();
			try {
				nextInput = element.nextElementSibling as HTMLInputElement;

				nextInput.focus();
				nextInput.selectionStart = 0;
				nextInput.selectionEnd = 0;
			} catch {}
		}
	}

	public onArrowLeft(event: KeyboardEvent, element: HTMLInputElement): void {
		let previousInput: HTMLInputElement;

		if (element.selectionStart === 0) {
			event.preventDefault();
			try {
				previousInput = element.previousElementSibling as HTMLInputElement;

				previousInput.focus();
				previousInput.selectionStart = previousInput.selectionEnd = previousInput.value.length;
				previousInput.selectionEnd = previousInput.selectionEnd = previousInput.value.length;
			} catch {}
		}
	}

	public onArrowDown(
		event: KeyboardEvent,
		element: HTMLInputElement,
		elementNum: number,
		addNewIfAtEnd?: boolean,
		newName?: string
	): void {
		let nextInput: HTMLInputElement;

		if (element.selectionEnd === element.value.length || addNewIfAtEnd) {
			event.preventDefault();

			try {
				nextInput = element.parentElement.parentElement.parentElement.nextElementSibling.firstElementChild
					.firstElementChild.firstElementChild as HTMLInputElement;

				for (let i = 0; i < elementNum; i++) {
					nextInput = nextInput.nextElementSibling as HTMLInputElement;
				}
				nextInput.focus();
				nextInput.selectionStart = 0;
				nextInput.selectionEnd = 0;
			} catch {
				if (addNewIfAtEnd && !this.pendingOption) {
					this.addOption(newName);
					setTimeout(() => {
						this.newOptionKey.nativeElement.focus();
					}, 0);
				} else if (this.newOptionKey) {
					this.newOptionKey.nativeElement.focus();
				}
			}
		}
	}

	public onArrowUp(event: KeyboardEvent, element: HTMLInputElement, elementNum: number): void {
		let previousInput: HTMLInputElement;

		if (element.selectionStart === 0) {
			event.preventDefault();
			try {
				previousInput = element.parentElement.parentElement.parentElement.previousElementSibling
					.firstElementChild.firstElementChild.firstElementChild as HTMLInputElement;

				for (let i = 0; i < elementNum; i++) {
					previousInput = previousInput.nextElementSibling as HTMLInputElement;
				}
				previousInput.focus();
				previousInput.selectionStart = previousInput.value.length;
				previousInput.selectionEnd = previousInput.value.length;
			} catch {}
		}
	}

	public onEnter(event: KeyboardEvent, item: QuestionOptionValue, element: HTMLInputElement): void {
		this.onArrowDown(event, element, 0, true, item.name);
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
		return this.savedItems.get(item.id) !== `${item.code}|${item.optionLabel.value}`;
	}

	public updateQuestionOrder(options: QuestionOptionValue[]) {
		options.forEach((q, index) => (q.order = index));
	}

	public savePendingOption(activeInputElement?: number) {
		this.builderService.setQuestionPartOption(this.surveyId, this.question.id, this.pendingOption).subscribe(
			addedOption => {
				this.items.get(this.pendingOption.name).push(addedOption);
				this.savedItems.set(addedOption.id, `${addedOption.code}|${addedOption.optionLabel.value}`);
				this.pendingOption = undefined;
				if (activeInputElement !== undefined) {
					let smoothDndWrapper: Element = this.newOptionKey.nativeElement.parentElement.parentElement
						.previousElementSibling;
					setTimeout(() => {
						let newlyAdded: HTMLInputElement =
							smoothDndWrapper.firstElementChild.lastElementChild.firstElementChild.firstElementChild
								.children[activeInputElement] as HTMLInputElement;
						newlyAdded.focus();
					}, 0);
				}

				// this.addingOption = false;
			},
			error => {
				this.alertService.showMessage(
					'Error',
					`Problem saving option!\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error
				);
			}
		);
	}

	public pendingOptionValid(): boolean {
		return this.pendingOption.code !== '' && this.pendingOption.optionLabel.value !== '';
	}

	public deletePendingOption(): void {
		this.pendingOption = undefined;
	}

	public addOption(optionDefName: string) {
		// this.addingOption = true;
		let optionOrder = this.items.get(optionDefName).length;
		this.pendingOption = new QuestionOptionValue(
			0,
			'',
			optionDefName,
			new QuestionOptionLabel(0, '', this.language),
			optionOrder
		);
	}

	public deleteOption(optionDefName: string, order: number) {
		this.alertService.showDialog('Are you sure you want to delete this option?', DialogType.confirm, () => {
			let optionList = this.items.get(optionDefName);
			this.builderService
				.deleteQuestionPartOption(this.surveyId, this.question.id, optionList[order].id)
				.subscribe(success => {
					let deleted = optionList.splice(order, 1);
					this.savedItems.delete(deleted[0].id);
					this.updateQuestionOrder(optionList);
				});
		});
	}

	public saveOption(option: QuestionOptionValue) {
		this.builderService.setQuestionPartOption(this.surveyId, this.question.id, option).subscribe(
			result => {
				this.savedItems.set(option.id, `${option.code}|${option.optionLabel.value}`);
			},
			error => {
				this.alertService.showMessage(
					'Error',
					`Problem saving option!\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error
				);
			}
		);
	}
}
