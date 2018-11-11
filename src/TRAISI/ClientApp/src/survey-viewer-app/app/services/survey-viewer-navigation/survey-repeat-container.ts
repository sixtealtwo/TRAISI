import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { SurveyQuestionContainer } from './survey-question-container';
import { QuestionContainerComponent } from '../../components/question-container/question-container.component';

export class SurveyRepeatContainer extends SurveyContainer {
	public containerId: number;


	private _children: Array<SurveyQuestionContainer> = [];

	private _activeQuestionIndex: number;

	public activeQuestion: SurveyViewQuestion;

	public get activeQuestionContainer(): SurveyQuestionContainer {
		return this._children[this._activeQuestionIndex];
	}

	public get children(): Array<SurveyQuestionContainer> {
		return this._children;
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activeQuestionIndex];
	}



	/**
	 * Creates an instance of survey group container.
	 * @param _state
	 */
	constructor(private _questionModel: SurveyViewQuestion, private _state: SurveyViewerStateService) {
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
		// this.children.push(this._questionModel);
		if (this._questionModel.isHidden !== undefined && this._questionModel.isHidden) {
			console.log('hidden in here ');
			return true;
		}

		if (this._state.viewerState.questionMap[this._questionModel.questionId].repeatChildren !== undefined) {
			this._children = [];

			let repeatCount =
				this._state.viewerState.questionMap[this._questionModel.questionId].repeatChildren[
					this._state.viewerState.activeRespondent.id
				].length + 1;

			for (let i = 0; i < repeatCount; i++) {
				let repeatModel: SurveyViewQuestion = Object.assign({}, this._questionModel);
				repeatModel.repeatNumber = i;
				let container = new SurveyQuestionContainer(repeatModel);

				this._children.push(container);
			}

			this._activeQuestionIndex = 0;
		}

		return false;
	}
}
