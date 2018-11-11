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

	public canNavigateNext(): boolean {
		let val = this.activeRepeatContainer.canNavigateNext();
		if (this._activeRepeatIndex < this._children.length - 1 || val) {
			return true;
		} else {
			return false;
		}
	}
	public canNavigatePrevious(): boolean {
		let val = this.activeRepeatContainer.canNavigatePrevious();
		if (this._activeRepeatIndex > 0 || val) {
			return true;
		} else {
			return false;
		}
	}

	public navigateNext(): boolean {
		if (this.activeRepeatContainer.navigateNext()) {
			if (this._activeRepeatIndex >= this._children.length - 1) {
				return true;
			} else {
				this._activeRepeatIndex++;
				let init = this.activeRepeatContainer.initialize();
				if (init) {
					console.log(' init true ');
					return this.navigateNext();
				}
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
				let init = this.activeRepeatContainer.initialize();
				if (init) {
					return this.navigatePrevious();
				}
				return false;
			}
		}

		return false;
	}

	public get repeatContainers(): Array<SurveyRepeatContainer> {
		return this._children;
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
	constructor(private _state: SurveyViewerStateService) {
		super();
		this._children = [];
	}

	/**
	 * Initializes survey group container
	 * @returns initialize
	 */
	public initialize(): Subject<void> | boolean {
		// this._activeRepeatIndex = 0;
		let init = this.activeRepeatContainer.initialize();
		if (init) {
			return this.navigateNext();
		}
		return false;
	}
}
