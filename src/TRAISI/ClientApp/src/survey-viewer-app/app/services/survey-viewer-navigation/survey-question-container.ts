import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { SurveyQuestion } from 'traisi-question-sdk';
import { Subject } from 'rxjs';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { QuestionContainerComponent } from '../../components/question-container/question-container.component';

export class SurveyQuestionContainer extends SurveyContainer {
	private _questionInstance: QuestionContainerComponent;

	private _questionModel: SurveyViewQuestion;

	private _activeQuestionInstanceIndex: number = 0;

	private _questionInstances: Array<SurveyViewQuestion>;

	public get containerId(): number {
		return 0;
	}

	public get questionModel(): SurveyViewQuestion {
		return this._questionModel;
	}

	public get questionInstances(): Array<SurveyViewQuestion> {
		return this._questionInstances;
	}

	public get questionInstance(): QuestionContainerComponent {
		return this._questionInstance;
	}

	public set questionInstance(value: QuestionContainerComponent) {
		this._questionInstance = value;
	}

	/**
	 * Gets active question
	 */
	public get activeQuestion(): SurveyViewQuestion {
		if (this._activeQuestionInstanceIndex > this._questionInstances.length) {
			return undefined;
		}

		return this._questionInstances[this._activeQuestionInstanceIndex];
	}

	/**
	 * Creates an instance of survey question container.
	 * @param question
	 * @param _state
	 */
	constructor(question: SurveyViewQuestion) {
		super();

		this._questionModel = question;

		this._questionInstances = [];
		this._activeQuestionInstanceIndex = 0;
	}

	/**
	 * Initializes container
	 */
	public initialize(): Subject<void> {
		this._questionInstances = [];
		this._questionInstances.push(this._questionModel);

		if (this._questionModel.repeatChildren !== undefined) {
		}
		this._activeQuestionInstanceIndex = 0;

		return null;
	}

	public canNavigateNext(): boolean {
		return false;
	}
	public canNavigatePrevious(): boolean {
		return false;
	}


	/**
	 * Navigates previous
	 * @returns true if previous
	 */
	public navigatePrevious(): boolean {
		if (this._questionInstance === undefined) {
			return true;
		} else if (this._questionInstance.surveyQuestionInstance.navigateInternalPrevious()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Navigates next
	 * @returns true if next
	 */
	public navigateNext(): boolean {
		if (this._questionInstance === undefined) {
			return true;
		} else if (this._questionInstance.surveyQuestionInstance.navigateInternalNext()) {
			return true;
		} else {
			return false;
		}
	}
}
