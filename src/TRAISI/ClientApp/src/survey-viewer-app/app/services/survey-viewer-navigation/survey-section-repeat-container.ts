import { SurveyContainer } from './survey-container';
import { Subject } from 'rxjs';
import { SurveySectionContainer } from './survey-section-container';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { SurveyViewerStateService } from '../survey-viewer-state.service';

export class SurveySectionRepeatContainer extends SurveyContainer {

	private _activeSectionIndex: number = 0;

	private _children: Array<SurveySectionContainer>;

	public containerId: number;

	public order: number;

	private _sectionModel: SurveyViewSection;

	public get sectionModel(): SurveyViewSection {
		return this._sectionModel;
	}

	public get children(): Array<SurveySectionContainer> {
		return this._children;
	}

	public get activeViewContainer(): SurveyContainer {
		console.log(this._children);
		return this._children[this._activeSectionIndex].activeViewContainer;
	}


	/**
	 *
	 * @param section
	 * @param _state
	 */
	public constructor(section: SurveyViewSection, private _state: SurveyViewerStateService) {
		super();

		this._sectionModel = section;
		this._children = [];
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
