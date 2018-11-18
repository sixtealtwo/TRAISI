import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
import { SurveyQuestionContainer } from './survey-question-container';
import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { SurveyGroupContainer } from './survey-group-container';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { SurveyRepeatContainer } from './survey-repeat-container';

export class SurveySectionContainer extends SurveyContainer {
	private _sectionModel: SurveyViewSection;

	private _children: Array<SurveyGroupContainer>;

	private _activeGroupMemberIndex: number = 0;

	public get containerId(): number {
		return this._sectionModel.id;
	}

	public get activeGroupContainer(): SurveyGroupContainer {
		return this._children[this._activeGroupMemberIndex];
	}

	public get sectionModel(): SurveyViewSection {
		return this._sectionModel;
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activeGroupMemberIndex].activeViewContainer;
	}

	public get activeQuestion(): SurveyViewQuestion {
		return null;
	}

	public get isComplete(): boolean {
		let complete = true;

		this.children.forEach(groupContainer => {
			if (!groupContainer.isComplete) {
				complete = false;
			}
		});
		return complete;
	}

	public get groupContainers(): Array<SurveyGroupContainer> {
		return this._children;
	}

	/**
	 * Gets child containers
	 */
	public get children(): Array<SurveyGroupContainer> {
		return this._children;
	}

	public get isHousehold(): boolean {
		if (this._sectionModel !== null) {
			if (this._sectionModel.isHousehold === true) {
				return true;
			}
		}
		return false;
	}

	public get activeRespondent(): SurveyViewGroupMember {
		if (this._sectionModel !== null) {
			if (this._sectionModel.isHousehold === false) {
				return this._state.viewerState.primaryRespondent;
			} else {
				return this._state.viewerState.groupMembers[this._activeGroupMemberIndex];
			}
		} else {
			return this._state.viewerState.primaryRespondent;
		}
	}

	/**
	 * Creates an instance of survey section container.
	 * @param section
	 */
	public constructor(section: SurveyViewSection, private _state: SurveyViewerStateService) {
		super();

		this._sectionModel = section;
		this._children = [];
		this.initialize();
	}

	public iterateNext(): boolean {
		return this.activeGroupContainer.iterateNext();
	}
	public iteratePrevious(): boolean {
		return this.activeGroupContainer.iteratePrevious();
	}

	public canNavigateNext(): boolean {
		let val = this.activeGroupContainer.canNavigateNext();
		if (this._activeGroupMemberIndex < this._children.length - 1 || val) {
			return true;
		} else {
			return false;
		}
	}
	public canNavigatePrevious(): boolean {
		let val = this.activeGroupContainer.canNavigatePrevious();
		if (this._activeGroupMemberIndex > 0 || val) {
			return true;
		} else {
			return false;
		}
	}

	public updateGroup(): void {
		this._state.viewerState.activeRespondent = this.activeRespondent;
	}

	/**
	 * Sets group member active
	 * @param index
	 */
	public setGroupMemberActive(index: number): void {
		this._activeGroupMemberIndex = index;
		this._state.viewerState.activeRespondent = this.activeRespondent;
	}

	/**
	 * Navigates previous
	 * @returns true if previous
	 */
	public navigatePrevious(): boolean {
		if (this.activeGroupContainer.navigatePrevious()) {
			if (this._activeGroupMemberIndex <= 0) {
				return true;
			} else {
				this.decrementGroup();

				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Navigates next
	 * @returns true if next
	 */
	public navigateNext(): boolean {
		// returns true if there is no longer any internal navigation

		if (this.activeGroupContainer.navigateNext()) {
			if (
				(this.isHousehold && this._activeGroupMemberIndex >= this._state.viewerState.groupMembers.length - 1) ||
				!this.isHousehold
			) {
				return true;
			} else {
				this.incrementGroup();

				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Increments question
	 */
	private incrementGroup(): void {
		this._activeGroupMemberIndex++;
		this._state.viewerState.activeRespondent = this.activeRespondent;
		this.activeGroupContainer.initialize();
	}

	/**
	 * Increments question
	 */
	private decrementGroup(): void {
		this._activeGroupMemberIndex--;
		this._state.viewerState.activeRespondent = this.activeRespondent;
		this.activeGroupContainer.initialize();
	}

	/**
	 * Initializes survey section container
	 * @returns initialize
	 */
	public initialize(): Subject<void> {
		this._state.viewerState.activeRespondent = this.activeRespondent;

		if (this._sectionModel !== null && this._sectionModel.isHousehold) {
			if (this.groupContainers.length === 0) {
				this._state.viewerState.groupMembers.forEach(member => {
					let groupContainer = new SurveyGroupContainer(this._state);
					this.groupContainers.push(groupContainer);
				});
			}
		} else if (this._sectionModel !== null) {
			let groupContainer = new SurveyGroupContainer(this._state);

			this.groupContainers.push(groupContainer);
		}

		// this.activeQuestionContainer.initialize();

		// this._children = [];

		/* his._questionContainers.forEach((container) => {
			container.initialize();
			this._children = this._children.concat(container.children);
		}); */

		if (this.activeGroupContainer !== undefined) {
			this.activeGroupContainer.initialize();
		}




		return null;
	}

	public updateGroups(): void {
		this._state.viewerState.activeRespondent = this.activeRespondent;
		let questionRepeats = this.groupContainers[0].children;
		if (this._sectionModel !== null && this._sectionModel.isHousehold) {
			if (this.children.length < this._state.viewerState.groupMembers.length) {
				this._state.viewerState.groupMembers.forEach((member, index) => {
					if (index >= this.children.length) {
						let groupContainer = new SurveyGroupContainer(this._state, member);
						this.groupContainers.push(groupContainer);
						questionRepeats.forEach(questionRepeatContainer => {
							let question = questionRepeatContainer.activeQuestionContainer.questionModel;
							let repeatContainer = new SurveyRepeatContainer(
								question,
								this._state,
								groupContainer.forRespondent
							);
							let container = new SurveyQuestionContainer(question, this);
							repeatContainer.addQuestionContainer(container);

							groupContainer.repeatContainers.push(repeatContainer);
						});
					}
				});

				/*this.groupContainers.forEach(groupContainer => {
					questionRepeats.forEach(questionRepeatContainer => {
						let question = questionRepeatContainer.children[0].questionModel;
						let repeatContainer = new SurveyRepeatContainer(
							question,
							this._state,
							groupContainer.forRespondent
						);

						let container = new SurveyQuestionContainer(question, this);
						repeatContainer.addQuestionContainer(container);

						groupContainer.repeatContainers.push(repeatContainer);
					});
				}); */
			} else if (this.children.length > this._state.viewerState.groupMembers.length) {
				this._children = this._children.slice(
					this.children.length - this._state.viewerState.groupMembers.length
				);
			}

			this._state.viewerState.groupMembers.forEach((member, index) => {
				this.groupContainers[index].forRespondent = this._state.viewerState.groupMembers[index];

				this.groupContainers[index].repeatContainers.forEach(repeat => {
					repeat.forRespondent = this._state.viewerState.groupMembers[index];

					repeat.children.forEach(q => {
						q.forRespondent = this._state.viewerState.groupMembers[index];
					});
				});
			});
		}
	}
}
