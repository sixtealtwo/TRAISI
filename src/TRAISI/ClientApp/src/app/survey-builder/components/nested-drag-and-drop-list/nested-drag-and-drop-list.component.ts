import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { Observable, Subject } from 'rxjs';
import { AlertService, DialogType } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
	selector: 'app-nested-drag-and-drop-list',
	templateUrl: './nested-drag-and-drop-list.component.html',
	styleUrls: ['./nested-drag-and-drop-list.component.scss']
})
export class NestedDragAndDropListComponent implements OnInit {
	public pageQuestions = [];
	public qPartQuestions: Map<number, any[]> = new Map<number, any[]>();

	public addingNewQuestion: boolean = true;
	public questionBeingEdited: any;
	private elementUniqueIndex: number = 0;

	private dragResult: Subject<boolean>;
	private dragOverContainer: Object = new Object();
	private lastDragEnter: string[] = [];
	private lastDragLeave: string[] = [];
	private dragDidNotOriginateFromChooser: boolean = false;

	@ViewChild('configurationModal') configurationModal: ModalDirective;

	constructor(private alertService: AlertService) {
		this.getQuestionPayload = this.getQuestionPayload.bind(this);
	}

	ngOnInit() {}

	editQuestionConfiguration(event: any, question: any) {
		event.stopPropagation();
		this.questionBeingEdited = question;
		this.dragResult = new Subject<boolean>();
		this.addingNewQuestion = false;
		this.configurationModal.show();
	}

	addQuestionTypeToList(qType) {
		this.dragResult = new Subject<boolean>();
		this.addingNewQuestion = true;
		this.configurationModal.show();
		this.dragResult.subscribe(
			proceed => {
				if (proceed) {
					if (qType.typeName === 'Survey Part') {
						qType.partId = this.elementUniqueIndex;
						this.qPartQuestions.set(this.elementUniqueIndex++, []);
					}
					this.pageQuestions.push(qType);
				}
			}
		);
	}

	getQuestionPayload(index) {
		return this.pageQuestions[index];
	}

	getQuestionInPartPayload(partId: number) {
		return index => {
			return this.qPartQuestions.get(partId)[index];
		};
	}

	processConfiguration(result: string) {
		if (result === 'save') {
			this.saveConfiguration();
		} else if (result === 'cancel') {
			this.cancelConfiguration();
		}
	}

	saveConfiguration() {
		if (this.addingNewQuestion) {
			this.dragResult.next(true);
		}
		this.configurationModal.hide();
	}

	cancelConfiguration() {
		if (this.addingNewQuestion) {
			this.dragResult.next(false);
		}
		this.configurationModal.hide();
	}

	onDragEnd(event) {
		if (this.lastDragEnter.length !== this.lastDragLeave.length) {
			this.dragResult = new Subject<boolean>();
			if (!this.dragDidNotOriginateFromChooser) {
				this.addingNewQuestion = true;
				this.configurationModal.show();
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
		this.pageQuestions = Utilities.applyDrag(this.pageQuestions, dropResult);
	}

	onDropInPart(partId: number, dropResult: any) {
		if (this.dragResult) {
			let questionParts = this.qPartQuestions.get(partId);
			let partQuestionsCache = [...questionParts];
			if (partId !== dropResult.payload.partId) {
				questionParts = Utilities.applyDrag(questionParts, dropResult);
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

}
