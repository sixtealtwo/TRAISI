import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { SurveyQuestion } from 'traisi-question-sdk';
import { Subject } from 'rxjs';
import { SurveyViewerStateService } from '../survey-viewer-state.service';

export class SurveyQuestionContainer extends SurveyContainer {
	private _questionModel: SurveyViewQuestion;

	private _activeQuestionInstanceIndex: number = 0;

	private _questionInstances: Array<SurveyViewQuestion>;

	public get containerId(): number {
		return this._questionModel.id;
	}

	/**
	 * Gets child containers
	 */
	public get children(): Array<SurveyViewQuestion> {
		return this._questionInstances;
	}

	/**
	 * Gets active question
	 */
	public get activeQuestion(): SurveyViewQuestion {
		if (this._activeQuestionInstanceIndex >= this._questionInstances.length) {
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

		console.log(this._questionModel);
		if (this._questionModel.repeatChildren !== undefined) {
			console.log('numbe rrepeat children');


			console.log(this._questionModel.repeatChildren.length);
		}
		this._activeQuestionInstanceIndex = 0;

		return null;
	}

	public navigatePrevious(): boolean {
		return true;
	}
	public navigateNext(): boolean {
		return true;
	}
}
