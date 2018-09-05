import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { Observable, Subject } from 'rxjs';
import { AlertService, DialogType, MessageSeverity } from '../../../../../shared/services/alert.service';
import { Utilities } from '../../../../../shared/services/utilities';
import { ModalDirective } from 'ngx-bootstrap';
import { QuestionConfigurationComponent } from '../question-configuration/question-configuration.component';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';
import { QuestionPart } from '../../models/question-part.model';
import { QuestionPartViewLabel } from '../../models/question-part-view-label.model';
import { Order } from '../../models/order.model';

@Component({
	selector: 'app-nested-drag-and-drop-list',
	templateUrl: './nested-drag-and-drop-list.component.html',
	styleUrls: ['./nested-drag-and-drop-list.component.scss']
})
export class NestedDragAndDropListComponent implements OnInit {
	public qPartQuestions: Map<number, QuestionPartView> = new Map<number, QuestionPartView>();
	public qTypeDefinitions: Map<string, QuestionTypeDefinition> = new Map<string, QuestionTypeDefinition>();

	public currentPage: QuestionPartView = new QuestionPartView();
	public configurationModalShowing: boolean = false;
	public addingNewQuestion: boolean = true;
	public dealingWithPart: boolean = false;
	public questionBeingEdited: QuestionPartView;

	private dragResult: Subject<boolean>;
	private dragOverContainer: Object = new Object();
	private lastDragEnter: string[] = [];
	private lastDragLeave: string[] = [];
	private dragDidNotOriginateFromChooser: boolean = false;

	@Input()
	surveyId: number;
	@Input()
	currentLanguage: string;

	@ViewChild('configurationModal')
	configurationModal: ModalDirective;
	@ViewChild('qConfiguration')
	qConfiguration: QuestionConfigurationComponent;

	constructor(private alertService: AlertService, private surveyBuilderService: SurveyBuilderService) {
		this.getQuestionPayload = this.getQuestionPayload.bind(this);
		this.getQuestionInPartPayload = this.getQuestionInPartPayload.bind(this);
		let sectionType: QuestionTypeDefinition = {
			typeName: 'Survey Part',
			icon: 'fa-archive',
			questionOptions: [],
			questionConfigurations: [],
			responseType: ''
		};
		this.qTypeDefinitions.set('Survey Part', sectionType);
	}

	ngOnInit() {}

	configurationShown() {
		this.qConfiguration.surveyId = this.surveyId;
		this.qConfiguration.questionBeingEdited = new QuestionPartView();
		this.qConfiguration.questionBeingEdited = JSON.parse(JSON.stringify(this.questionBeingEdited));
		this.qConfiguration.editing = true;
		this.qConfiguration.newQuestion = this.addingNewQuestion;
		if (this.questionBeingEdited.questionPart === undefined || this.questionBeingEdited.questionPart === null) {
			this.qConfiguration.questionType = this.qTypeDefinitions.get('Survey Part');
		} else {
			this.qConfiguration.questionType = this.qTypeDefinitions.get(
				this.questionBeingEdited.questionPart.questionType
			);
		}
		this.configurationModalShowing = true;
		this.qConfiguration.processConfigurations();
	}

	configurationHidden() {
		this.qConfiguration.editing = false;
		this.qConfiguration.questionBeingEdited = undefined;
		this.qConfiguration.configurations = [];
		this.qConfiguration.questionType = null;
	}

	editQuestionConfiguration(event: any, question: any) {
		event.stopPropagation();
		this.questionBeingEdited = question;
		this.dragResult = new Subject<boolean>();
		this.addingNewQuestion = false;
		if (question.questionPart === undefined || question.questionPart === null) {
			this.dealingWithPart = true;
		} else {
			this.dealingWithPart = false;
		}
		this.configurationModal.show();
	}

	addQuestionTypeToList(qType) {
		this.dragResult = new Subject<boolean>();
		this.addingNewQuestion = true;
		if (qType.typeName === 'Survey Part') {
			this.dealingWithPart = true;
		} else {
			this.dealingWithPart = false;
		}
		this.questionBeingEdited = this.generateQuestionViewFromType(qType);
		this.configurationModal.show();
		this.dragResult.asObservable().subscribe(proceed => {
			if (proceed) {
				this.questionBeingEdited.order = this.currentPage.questionPartViewChildren.length;
				this.addNewQuestionPartView(this.questionBeingEdited, this.currentPage, true);
			}
		});
	}

	generateQuestionViewFromType(qType: QuestionTypeDefinition): QuestionPartView {
		let newQPart: QuestionPart;
		if (qType.typeName !== 'Survey Part') {
			newQPart = new QuestionPart(0, qType.typeName);
		}
		let newQPartLabel: QuestionPartViewLabel = new QuestionPartViewLabel(0, '', this.currentLanguage);
		let newQPartView: QuestionPartView = new QuestionPartView(0, newQPartLabel, 0, [], 0, newQPart);
		return newQPartView;
	}

	addNewQuestionPartView(newPartView: QuestionPartView, parentView: QuestionPartView, addToList: boolean) {
		this.surveyBuilderService
			.addQuestionPartView(this.surveyId, parentView.id, this.currentLanguage, newPartView)
			.subscribe(newQuestion => {
				newPartView.id = newQuestion.id;
				newPartView.parentViewId = newQuestion.parentViewId;
				if ((newQuestion.questionPart === undefined || newQuestion.questionPart === null) && !this.qPartQuestions.has(newQuestion.id)) {
					this.qPartQuestions.set(newQuestion.id, newQuestion);
				} else {
					newPartView.questionPart = newQuestion.questionPart;
					// send advanced configuration
					this.surveyBuilderService
						.updateQuestionPartConfigurations(
							this.surveyId,
							newQuestion.questionPart.id,
							this.qConfiguration.configurationValues
						)
						.subscribe();
				}
				if (addToList) {
					if (parentView === this.currentPage) {
						this.currentPage.questionPartViewChildren.push(newQuestion);
					}
				}
				this.configurationModal.hide();
			},	error => {
				this.alertService.showStickyMessage(
					'Update Error',
					`Unable to add question.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error,
					error
				);
			});
	}

	getIcon(questionTypeName: string): string {
		let qType: QuestionTypeDefinition = this.qTypeDefinitions.get(questionTypeName);
		return qType.icon;
	}

	getQuestionPayload(index) {
		return this.currentPage.questionPartViewChildren[index];
	}

	getQuestionInPartPayload(part: QuestionPartView) {
		return index => {
			let test = this.qPartQuestions;
			return this.qPartQuestions.get(part.id).questionPartViewChildren[index];
		};
	}

	getQuestionPartViewChildren(partId: number): QuestionPartView[] {
		if (this.qPartQuestions.has(partId)) {
			return this.qPartQuestions.get(partId).questionPartViewChildren;
		} else {
			return [];
		}
	}

	processConfiguration(result: string) {
		if (result === 'save') {
			Object.assign(this.questionBeingEdited, this.qConfiguration.questionBeingEdited);
			this.saveConfiguration();
		} else if (result === 'cancel') {
			this.configurationModalShowing = false;
			this.cancelConfiguration();
		} else if (result === 'delete') {
			this.configurationModalShowing = false;
			this.deleteQuestion();
		}
	}

	saveConfiguration() {
		if (this.addingNewQuestion) {
			this.dragResult.next(true);
		} else {
			this.surveyBuilderService.updateQuestionPartViewData(this.surveyId, this.questionBeingEdited).subscribe(
				result => {
					if (this.qConfiguration.configurationValues.length > 0) {
						this.surveyBuilderService
							.updateQuestionPartConfigurations(
								this.surveyId,
								this.questionBeingEdited.questionPart.id,
								this.qConfiguration.configurationValues
							)
							.subscribe(
								configResult => {
									this.alertService.showMessage(
										'Success',
										`Question data and configurations updated successfully!`,
										MessageSeverity.success
									);
									this.configurationModal.hide();
								},
								error => {
									this.alertService.showStickyMessage(
										'Update Error',
										`Unable to update question configurations.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
										MessageSeverity.error,
										error
									);
								}
							);
					} else {
						this.alertService.showMessage(
							'Success',
							`Question data and configurations updated successfully!`,
							MessageSeverity.success
						);
						this.configurationModal.hide();
					}
				},
				error => {
					this.alertService.showStickyMessage(
						'Update Error',
						`Unable to update question data.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
						MessageSeverity.error,
						error
					);
				}
			);
		}
	}

	cancelConfiguration() {
		if (this.addingNewQuestion) {
			this.dragResult.next(false);
		}
		this.configurationModal.hide();
	}

	deleteQuestion() {
		this.alertService.showDialog('Are you sure you want to delete the question?', DialogType.confirm, () =>
			this.continueDelete()
		);
		this.configurationModal.hide();
	}

	continueDelete() {
		this.surveyBuilderService
			.deleteQuestionPartView(this.surveyId, this.questionBeingEdited.parentViewId, this.questionBeingEdited.id)
			.subscribe(result => {
				let dropResult = {
					removedIndex: this.questionBeingEdited.order,
					addedIndex: null,
					payload: this.questionBeingEdited
				};
				if (this.currentPage.id === this.questionBeingEdited.parentViewId) {
					this.currentPage.questionPartViewChildren = Utilities.applyDrag(
						this.currentPage.questionPartViewChildren,
						dropResult
					);
					this.updateQuestionOrder(this.currentPage);
				} else {
					let parentView = this.qPartQuestions.get(this.questionBeingEdited.parentViewId);
					parentView.questionPartViewChildren = Utilities.applyDrag(
						parentView.questionPartViewChildren,
						dropResult
					);
					this.updateQuestionOrder(parentView);
				}
			});
	}

	updateQuestionOrder(parentView: QuestionPartView) {
		parentView.questionPartViewChildren.forEach((q, index) => (q.order = index));
	}

	onDragEnd(event) {
		if (this.lastDragEnter.length !== this.lastDragLeave.length) {
			this.dragResult = new Subject<boolean>();
			if (!this.dragDidNotOriginateFromChooser) {
				this.addingNewQuestion = true;
				this.questionBeingEdited = this.generateQuestionViewFromType(event.payload);
				if (event.payload.typeName === 'Survey Part') {
					this.dealingWithPart = true;
				} else {
					this.dealingWithPart = false;
				}
				this.configurationModal.show();
			} else {
				this.addingNewQuestion = false;
				this.questionBeingEdited = event.payload;
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

	public getCharFromIndex(index: number) {
		return String.fromCharCode(65 + index);
	}

	onDrop(dropResult: any) {
		if (this.dragResult) {
			// create shadow list to give illusion of transfer before decision made
			let pageQuestionsCache = [...this.currentPage.questionPartViewChildren];
			this.proceedWithDrop(dropResult);
			this.dragResult.subscribe(proceed => {
				if (proceed === false) {
					this.currentPage.questionPartViewChildren = pageQuestionsCache;
					this.questionBeingEdited = undefined;
				} else if (dropResult.addedIndex !== null) {
					this.updateQuestionOrder(this.currentPage);
					if (dropResult.removedIndex === null && dropResult.addedIndex !== null) {
						this.questionBeingEdited.order = dropResult.addedIndex;
						this.addNewQuestionPartView(this.questionBeingEdited, this.currentPage, false);
					} else if (dropResult.addedIndex !== null) {
						let questionsOrder: Order[] = this.currentPage.questionPartViewChildren.map(
							q => new Order(q.id, q.order)
						);
						this.surveyBuilderService
							.updateQuestionPartViewOrderEndpoint(this.surveyId, this.currentPage.id, questionsOrder)
							.subscribe();
					}
				}
			});
		}
	}

	proceedWithDrop(dropResult: any) {
		dropResult.payload = this.questionBeingEdited;
		this.currentPage.questionPartViewChildren = Utilities.applyDrag(
			this.currentPage.questionPartViewChildren,
			dropResult
		);
	}

	onDropInPart(partId: number, dropResult: any) {
		if (this.dragResult) {
			if (partId !== dropResult.payload.id) {
				let questionPart = this.qPartQuestions.get(partId);
				let partQuestionsCache = [...questionPart.questionPartViewChildren];
				dropResult.payload = this.questionBeingEdited;
				questionPart.questionPartViewChildren = Utilities.applyDrag(
					questionPart.questionPartViewChildren,
					dropResult
				);
				this.dragResult.subscribe(proceed => {
					if (proceed === false) {
						questionPart.questionPartViewChildren = partQuestionsCache;
					} else {
						this.updateQuestionOrder(questionPart);
						if (dropResult.removedIndex === null && dropResult.addedIndex !== null) {
							this.questionBeingEdited.order = dropResult.addedIndex;
							this.addNewQuestionPartView(this.questionBeingEdited, questionPart, false);
						} else if (dropResult.addedIndex !== null) {
							let questionsOrder: Order[] = questionPart.questionPartViewChildren.map(
								q => new Order(q.id, q.order)
							);
							this.surveyBuilderService
								.updateQuestionPartViewOrderEndpoint(this.surveyId, partId, questionsOrder)
								.subscribe();
						}
					}
				});
			}
		}
	}

	shouldAcceptDrop(sourceContainerOptions, payload) {
		if (sourceContainerOptions.groupName.indexOf('optionlist') >= 0) {
			return false;
		}
		return true;
	}

	shouldAcceptDropPart(sourceContainerOptions, payload) {
		if (sourceContainerOptions.groupName.indexOf('optionlist') >= 0) {
			return false;
		}
		if (sourceContainerOptions.behaviour === 'copy') {
			if (payload.typeName === 'Survey Part') {
				return false;
			} else {
				return true;
			}
		} else {
			if (payload.questionPart === undefined || payload.questionPart === null) {
				return false;
			} else {
				return true;
			}
		}
	}
}
