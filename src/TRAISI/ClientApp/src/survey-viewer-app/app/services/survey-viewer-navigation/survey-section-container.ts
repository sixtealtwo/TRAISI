import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
import { SurveyQuestionContainer } from './survey-question-container';
import { SurveyViewSection } from 'app/models/survey-view-section.model';

export class SurveySectionContainer extends SurveyContainer {
	private _questionContainers: Array<SurveyQuestionContainer>;

	private _sectionModel: SurveyViewSection;

	private _activeQuestionIndex: number;

	private _children: Array<SurveyViewQuestion>;

	public get containerId(): number {
		return this._sectionModel.id;
	}

	public get activeQuestion(): SurveyViewQuestion {
		return this._questionContainers[this._activeQuestionIndex].activeQuestion;
	}

	public get activeQuestionContainer(): SurveyQuestionContainer {
		return this._questionContainers[this._activeQuestionIndex];
	}

	/**
	 * Gets child containers
	 */
	public get children(): Array<SurveyViewQuestion> {
		return this._children;
	}

	/**
	 * Creates an instance of survey section container.
	 * @param section
	 */
	public constructor(section: SurveyViewSection) {
		super();
		this._questionContainers = [];
		this._sectionModel = section;
		this._children = [];
	}

	/**
	 * Adds question container
	 * @param questionContainer
	 */
	public addQuestionContainer(questionContainer: SurveyQuestionContainer): void {
		this._questionContainers.push(questionContainer);
	}

	/**
	 * Navigates previous
	 * @returns true if previous
	 */
	public navigatePrevious(): boolean {
		if (this.activeQuestionContainer.navigatePrevious()) {
			if (this._activeQuestionIndex <= 0) {
				return true;
			} else {
				this.decrementQuestion();

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
		if (this.activeQuestionContainer.navigateNext()) {
			if (this._activeQuestionIndex >= this._questionContainers.length - 1) {
				return true;
			} else {
				this.incrementQuestion();

				return false;
			}
		} else {
			return false;
		}
	}

	private incrementQuestion(): void {
		this._activeQuestionIndex++;
		this.activeQuestionContainer.initialize();
	}

	/**
	 * Increments question
	 */
	private decrementQuestion(): void {
		this._activeQuestionIndex--;
		this.activeQuestionContainer.initialize();
	}

	/**
	 * Initializes survey section container
	 * @returns initialize
	 */
	public initialize(): Subject<void> {
		this._activeQuestionIndex = 0;
		this.activeQuestionContainer.initialize();

		this._children = [];
		this._questionContainers.forEach((container) => {
			container.initialize();
			this._children = this._children.concat(container.children);
		});

		return null;
	}
}
