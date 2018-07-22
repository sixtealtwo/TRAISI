import { Component, OnInit } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { Observable, Subject } from '../../../../../node_modules/rxjs';
import { AlertService, DialogType } from '../../../services/alert.service';

@Component({
	selector: 'app-nested-drag-and-drop-list',
	templateUrl: './nested-drag-and-drop-list.component.html',
	styleUrls: ['./nested-drag-and-drop-list.component.scss']
})
export class NestedDragAndDropListComponent implements OnInit {
	public pageQuestions = [];
	public qPartQuestions: Map<number, any[]> = new Map<number, any[]>();
	private elementUniqueIndex: number = 0;

	private dragResult: Subject<boolean>;
	private dragOverContainer: Object = new Object();
	private lastDragEnter: string[] = [];
	private lastDragLeave: string[] = [];
	private dragDidNotOriginateFromChooser: boolean = false;

	constructor(private alertService: AlertService) {
		this.getQuestionPayload = this.getQuestionPayload.bind(this);
	}

	ngOnInit() {}

	addQuestionTypeToList(qType) {
		this.alertService.showDialog('Are you sure you want to add a question?', DialogType.confirm, () => {
			if (qType.typeName === 'Survey Part') {
				qType.partId = this.elementUniqueIndex;
				this.qPartQuestions.set(this.elementUniqueIndex++, []);
			}
			this.pageQuestions.push(qType);
		});
	}

	getQuestionPayload(index) {
		return this.pageQuestions[index];
	}

	getQuestionInPartPayload(partId: number) {
		return index => {
			return this.qPartQuestions.get(partId)[index];
		};
	}

	onDragEnd(event) {
		if (this.lastDragEnter.length !== this.lastDragLeave.length) {
			this.dragResult = new Subject<boolean>();
			if (!this.dragDidNotOriginateFromChooser) {
				this.alertService.showDialog(
					'Are you sure you want to create a new question?',
					DialogType.confirm,
					() => this.dragResult.next(true),
					() => this.dragResult.next(false)
				);
			} else {
				setTimeout(() => {
					this.dragResult.next(true);
				}, 0);
			}
		}
		this.lastDragEnter = [];
		this.lastDragLeave = [];
		this.dragDidNotOriginateFromChooser = false;
		this.dragOverContainer = new Object();
	}

	onDragStart(event: any) {
		this.dragDidNotOriginateFromChooser = this.dragDidNotOriginateFromChooser || event.isSource;
	}

	onDragEnter(containerName: string) {
		this.lastDragEnter.push(containerName);
		this.dragOverContainer[containerName] = true;
	}

	onDragLeave(containerName: string) {
		this.lastDragLeave.push(containerName);
		this.dragOverContainer[containerName] = false;
	}

	onDrop(dropResult: any) {
		if (this.dragResult) {
			// create shadow list to give illusion of transfer before decision made
			let pageQuestionsCache = [...this.pageQuestions];
			this.proceedWithDrop(dropResult);
			this.dragResult.subscribe(proceed => {
				if (proceed === false) {
					this.pageQuestions = pageQuestionsCache;
				}
				this.dragResult = undefined;
			});
		}
	}

	proceedWithDrop(dropResult: any) {
		if (dropResult.payload.typeName === 'Survey Part' && dropResult.removedIndex === null) {
			if (dropResult.payload.partId === undefined) {
				dropResult.payload.partId = this.elementUniqueIndex++;
				this.dragOverContainer[dropResult.payload.partId] = false;
			}
			if (!this.qPartQuestions.has(dropResult.payload.partId)) {
				this.qPartQuestions.set(dropResult.payload.partId, []);
			}
		}
		this.pageQuestions = this.applyDrag(this.pageQuestions, dropResult);
	}

	onDropInPart(partId: number, dropResult: any) {
		if (this.dragResult) {
			let questionParts = this.qPartQuestions.get(partId);
			let partQuestionsCache = [...questionParts];
			if (partId !== dropResult.payload.partId) {
				questionParts = this.applyDrag(questionParts, dropResult);
				this.qPartQuestions.set(partId, questionParts);
			}
			this.dragResult.subscribe(proceed => {
				if (proceed === false) {
					this.qPartQuestions.set(partId, partQuestionsCache);
				}
			});
		}
	}

	shouldAcceptDrop(sourceContainerOptions, payload) {
		return true;
	}

	shouldAcceptDropPart(sourceContainerOptions, payload) {
		if (payload.typeName === 'Survey Part') {
			return false;
		} else {
			return true;
		}

		/*let thisContainer: any = this;

		let groupName: string = thisContainer.groupName;
		if (groupName.startsWith('builder-part-')) {
			let split: string[] = groupName.split('-');
			let partNum: number = +split[split.length -1];
			if (partNum === payload.partId) {
				return false;
			}
		}
		return true;*/

		/*if (sourceContainerOptions.groupName === 'builder-questions' || sourceContainerOptions.groupName === thisContainer) {
			return true;
		}
		return false;
*/
	}

	applyDrag = (arr, dragResult) => {
		const { removedIndex, addedIndex, payload } = dragResult;
		if (removedIndex === null && addedIndex === null) {
			return arr;
		}

		const result = [...arr];
		let itemToAdd = payload;

		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}

		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}

		return result;
	}
}
