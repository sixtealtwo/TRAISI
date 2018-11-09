import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { SurveyQuestionContainer } from './survey-question-container';

export class SurveyRepeatContainer extends SurveyContainer {
	public containerId: number;

	private _children: Array<SurveyQuestionContainer> = [];

	private _activeQuestionIndex: number;

	public activeQuestion: SurveyViewQuestion;

	public get children(): Array<SurveyQuestionContainer> {
		return this._children;
	}

	public get activeViewContainer(): SurveyContainer {
		console.log(this._children);
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
		return true;
	}
	public navigateNext(): boolean {
		return true;
	}

	public initialize(): Subject<void> {
		// this._children = [];
		// this.children.push(this._questionModel);
		return null;
	}
}
