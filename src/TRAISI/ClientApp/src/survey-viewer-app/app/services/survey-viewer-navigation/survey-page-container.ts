import { SurveyContainer } from './survey-container';
import { Subject } from 'rxjs';
import { SurveySectionRepeatContainer } from './survey-section-repeat-container';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../survey-viewer-state.service';

export class SurveyPageContainer extends SurveyContainer {
	private _pageModel: SurveyViewPage;

	private _activePageIndex: number;

	public get containerId(): number {
		return this._pageModel.id;
	}

	private _children: Array<SurveySectionRepeatContainer>;

	public get children(): Array<SurveySectionRepeatContainer> {
		return this._children;
	}

	public set children(children: Array<SurveySectionRepeatContainer>) {
		this._children = children;
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activePageIndex].activeViewContainer;
	}

	public get activeRepeatContainer(): SurveySectionRepeatContainer {
		return this._children[this._activePageIndex];
	}

	public get isComplete(): boolean {
		let complete = true;

		this.children.forEach(repeatContainer => {
			if (complete) {
				complete = repeatContainer.isComplete;
			}
		});
		return complete;
	}

	public iterateNext(): boolean {
		let val = this.activeRepeatContainer.iterateNext();

		return val;
	}

	public iteratePrevious(): boolean {
		return this.activeRepeatContainer.iteratePrevious();
	}

	/**
	 * Updates valid index
	 * @returns valid index
	 */
	public updateValidIndex(): void {
		return;
	}

	/**
	 * Creates an instance of survey page container.
	 * @param model
	 * @param _state
	 */
	public constructor(model: SurveyViewPage, private _state: SurveyViewerStateService) {
		super();
		this._pageModel = model;
		this._children = [];
		this._activePageIndex = 0;
	}

	public canNavigateNext(): boolean {
		let val = this.activeRepeatContainer.canNavigateNext();
		if (this._activePageIndex < this._children.length - 1 || val) {
			return true;
		} else {
			return false;
		}
	}
	public canNavigatePrevious(): boolean {
		let val = this.activeRepeatContainer.canNavigatePrevious();
		if (this._activePageIndex > 0 || val) {
			return true;
		} else {
			return false;
		}
	}

	public navigatePrevious(): boolean {
		if (this.activeRepeatContainer.navigatePrevious()) {
			if (this._activePageIndex <= 0) {
				return true;
			} else {
				this._activePageIndex--;
				this._state.viewerState.activeSectionRepeatContainer = this.activeRepeatContainer;
				this.activeRepeatContainer.initialize();
				return false;
			}
		}
		return false;
	}
	public navigateNext(): boolean {
		if (this.activeRepeatContainer.navigateNext()) {
			if (this._activePageIndex >= this._children.length - 1) {
				return true;
			} else {
				this._activePageIndex++;
				this._state.viewerState.activeSectionRepeatContainer = this.activeRepeatContainer;
				this.activeRepeatContainer.initialize();
				return false;
			}
		}
		return false;
	}
	public initialize(): Subject<void> {
		this._activePageIndex = 0;

		this.activeRepeatContainer.initialize();

		this._state.viewerState.activeSectionRepeatContainer = this.activeRepeatContainer;

		return;
	}
}
