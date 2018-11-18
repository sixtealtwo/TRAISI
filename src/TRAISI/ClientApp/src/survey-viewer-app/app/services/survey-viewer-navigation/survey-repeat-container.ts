import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { SurveyQuestionContainer } from './survey-question-container';
import { QuestionContainerComponent } from '../../components/question-container/question-container.component';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { LEAVE_SELECTOR } from '../../../../../node_modules/@angular/animations/browser/src/util';

export class SurveyRepeatContainer extends SurveyContainer {
	public containerId: number;

	private _children: Array<SurveyQuestionContainer> = [];

	private _activeQuestionIndex: number;

	// public activeQuestion: SurveyViewQuestion;

	public get activeQuestionContainer(): SurveyQuestionContainer {
		return this._children[this._activeQuestionIndex];
	}

	public get children(): Array<SurveyQuestionContainer> {
		return this._children;
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activeQuestionIndex];
	}

	public get isComplete(): boolean {
		let complete = true;

		this.children.forEach(questionContainer => {
			if (!questionContainer.isComplete) {
				complete = false;
			}
		});
		return complete;
	}

	public get forRespondent(): SurveyViewGroupMember {
		return this._member;
	}

	public set forRespondent(member: SurveyViewGroupMember) {
		this._member = member;
	}

	/**
	 * Creates an instance of survey group container.
	 * @param _state
	 */
	constructor(
		private _questionModel: SurveyViewQuestion,
		private _state: SurveyViewerStateService,
		private _member?: SurveyViewGroupMember
	) {
		super();
		this._children = [];
		this._activeQuestionIndex = 0;
	}

	/**
	 * Adds question container
	 * @param questionContainer
	 */
	public addQuestionContainer(questionContainer: SurveyQuestionContainer): void {
		this._children.push(questionContainer);
	}
	public isHidden(): boolean {
		if (this._member === undefined) {
			if (this._questionModel.isHidden !== undefined && this._questionModel.isHidden) {
				return true;
			}
		} else {
			if (this._questionModel.isRespondentHidden !== undefined) {
				return this._questionModel.isRespondentHidden[this._member.id];
			} else {
				return false;
			}
		}

		return false;
	}

	public canNavigateNext(): boolean {
		if (this.isHidden()) {
			return false;
		}
		let val = this.activeQuestionContainer.canNavigateNext();
		if (this._activeQuestionIndex < this._children.length - 1 || val) {
			// console.log('return true');
			return true;
		} else {
			// console.log('return false');
			return false;
		}
	}

	public iterateNext(): boolean {
		if (this.isHidden()) {
			return true;
		} else {
			return false;
		}
	}

	public iteratePrevious(): boolean {
		if (this.isHidden()) {
			return true;
		} else {
			return false;
		}
	}

	public canNavigatePrevious(): boolean {
		let val = this.activeQuestionContainer.canNavigatePrevious();
		if (this._activeQuestionIndex > 0 || val) {
			return true;
		} else {
			return false;
		}
	}

	public navigatePrevious(): boolean {
		if (this.activeQuestionContainer.navigatePrevious()) {
			if (this._activeQuestionIndex <= 0) {
				return true;
			} else {
				this._activeQuestionIndex--;
				return false;
			}
		}
		return false;
	}
	public navigateNext(): boolean {
		if (this.activeQuestionContainer.navigateNext()) {
			if (this._activeQuestionIndex >= this._children.length - 1) {
				return true;
			} else {
				this._activeQuestionIndex++;

				return false;
			}
		}
		return false;
	}

	public initialize(): Subject<void> | boolean {
		// this._children = [];
		// this.children.push(this._questionModel);`


		if (this._state.viewerState.questionMap[this._questionModel.questionId].repeatChildren !== undefined) {
			this._children = [];

			let repeatCount =
				this._state.viewerState.questionMap[this._questionModel.questionId].repeatChildren[
					this._state.viewerState.activeRespondent.id
				].length + 1;

			for (let i = 0; i < repeatCount; i++) {
				let repeatModel: SurveyViewQuestion = this._questionModel;
				repeatModel.repeatNumber = i;
				let container = new SurveyQuestionContainer(
					repeatModel,
					null,
					this._member !== undefined ? null : this._member
				);

				container.initialize();
				this._children.push(container);
			}

			this._activeQuestionIndex = 0;
		} else {
			for (let q of this.children) {
				q.initialize();
			}
		}

		return false;
	}
}
