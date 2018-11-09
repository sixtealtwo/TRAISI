import { SurveyContainer } from './survey-container';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { SurveyViewSection } from '../../models/survey-view-section.model';
import { SurveySectionContainer } from './survey-section-container';
import { SurveyQuestionContainer } from './survey-question-container';
import { SurveyRepeatContainer } from './survey-repeat-container';

export class SurveyGroupContainer extends SurveyContainer {
	public containerId: number;

	private _children: Array<SurveyRepeatContainer>;

	private _activeRepeatIndex: number = 0;

	public get children(): Array<SurveyRepeatContainer> {
		return this._children;
	}

	public navigateNext(): boolean {
		if (this.activeRepeatContainer.navigateNext()) {
			if (this._activeRepeatIndex >= this._children.length - 1) {
				return true;
			} else {
				this._activeRepeatIndex++;
				this.activeRepeatContainer.initialize();
				return false;
			}
		}

		return false;
	}
	public navigatePrevious(): boolean {
		if (this.activeRepeatContainer.navigatePrevious()) {
			if (this._activeRepeatIndex <= 0) {
				return true;
			} else {
				this._activeRepeatIndex--;
				this.activeRepeatContainer.initialize();
				return false;
			}
		}

		return false;
	}

	public get repeatContainers(): Array<SurveyRepeatContainer> {
		return this._children;
	}

	public get activeQuestion(): SurveyViewQuestion {
		return this._questionModel;
	}

	public get activeRepeatContainer(): SurveyRepeatContainer {
		return this._children[this._activeRepeatIndex];
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activeRepeatIndex].activeViewContainer;
	}

	/**
	 * Creates an instance of survey group container.
	 * @param _state
	 * @param _questionModel
	 */
	constructor(private _state: SurveyViewerStateService, private _questionModel: SurveyViewQuestion) {
		super();
		this._children = [];
	}

	/**
	 * Initializes survey group container
	 * @returns initialize
	 */
	public initialize(): Subject<void> {
		this._activeRepeatIndex = 0;
		this.activeRepeatContainer.initialize();
		return null;
	}
}
