import { SurveyContainer } from './survey-container';
import { Subject } from 'rxjs';
import { SurveySectionContainer } from './survey-section-container';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';

export class SurveySectionRepeatContainer extends SurveyContainer {
	private _activeSectionIndex: number = 0;

	private _children: Array<SurveySectionContainer>;

	public containerId: number;

	public get children(): Array<SurveySectionContainer> {
		return this._children;
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activeSectionIndex].activeViewContainer;
	}

	/**
	 * Creates an instance of survey section repeat container.
	 * @param _state
	 */
	constructor(private _state: SurveyViewerState) {
		super();
	}

	public navigatePrevious(): boolean {
		return true;
	}
	public navigateNext(): boolean {
		return true;
	}

	public initialize(): Subject<void> {
		return null;
	}
}
