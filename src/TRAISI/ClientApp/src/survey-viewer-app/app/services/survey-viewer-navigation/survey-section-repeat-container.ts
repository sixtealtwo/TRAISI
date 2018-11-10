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

	public get activeSection(): SurveySectionContainer {
		return this._children[this._activeSectionIndex];
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
		if (this.activeSection.navigatePrevious()) {
			if (this._activeSectionIndex <= 0) {
				return true;
			} else {
				this._activeSectionIndex--;
				return false;
			}
		}
		return false;
	}
	public navigateNext(): boolean {
		if (this.activeSection.navigateNext()) {
			if (this._activeSectionIndex >= this._children.length - 1) {
				return true;
			} else {
				this._activeSectionIndex++;
				return false;
			}
		}
		return false;
	}

	public initialize(): Subject<void> {
		return null;
	}
}
