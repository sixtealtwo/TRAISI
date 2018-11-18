import { SurveyContainer } from './survey-container';
import { Subject } from 'rxjs';
import { SurveySectionContainer } from './survey-section-container';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { SurveyRepeatContainer } from './survey-repeat-container';
import { SurveyQuestionContainer } from './survey-question-container';

export class SurveySectionRepeatContainer extends SurveyContainer {
	private _activeSectionIndex: number = 0;

	private _children: Array<SurveySectionContainer>;

	public containerId: number;

	public order: number;

	private _sectionModel: SurveyViewSection;

	private _isRepeatHidden: boolean = false;

	public get isRepeatHidden(): boolean {
		return this._isRepeatHidden;
	}

	public set isRepeatHidden(val: boolean) {
		this._isRepeatHidden = val;
	}

	public get sectionModel(): SurveyViewSection {
		return this._sectionModel;
	}

	public get children(): Array<SurveySectionContainer> {
		return this._children;
	}

	public get activeViewContainer(): SurveyContainer {
		return this._children[this._activeSectionIndex].activeViewContainer;
	}

	public get activeSection(): SurveySectionContainer {
		return this._children[this._activeSectionIndex];
	}

	public get isComplete(): boolean {
		let complete = true;

		this.children.forEach(sectionContainer => {
			if(!sectionContainer.isComplete)
			{
				complete = false;
			}
		});
		return complete;
	}

	/**
	 * Creates from section model
	 * @param sectionModel
	 * @param state
	 * @returns from section model
	 */
	public static CreateFromSectionModel(
		sectionModel: SurveyViewSection,
		state: SurveyViewerStateService
	): SurveySectionRepeatContainer {
		let sectionRepeatContainer = new SurveySectionRepeatContainer(sectionModel, state);
		sectionRepeatContainer.order = sectionModel.order;
		sectionRepeatContainer.containerId = sectionModel.id;

		let sectionContainer = new SurveySectionContainer(sectionModel, state);
		sectionContainer.initialize();

		sectionRepeatContainer.children.push(sectionContainer);

		return sectionRepeatContainer;
	}

	/**
	 * Creates question container
	 * @param questionModel
	 */
	public createQuestionContainer(questionModel: SurveyViewQuestion, member: SurveyViewGroupMember): void {
		for (let sectionContainer of this.children) {
			sectionContainer.groupContainers.forEach(groupContainer => {
				let repeatContainer = new SurveyRepeatContainer(questionModel, this._state, member);

				let container = new SurveyQuestionContainer(questionModel, sectionContainer);
				repeatContainer.addQuestionContainer(container);

				groupContainer.repeatContainers.push(repeatContainer);
			});
		}
		this.children[0].initialize();
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

	public iterateNext(): boolean {
		return this.activeSection.iterateNext();
	}

	public iteratePrevious(): boolean {
		return this.activeSection.iteratePrevious();
	}

	public canNavigateNext(): boolean {
		let val = this.activeSection.canNavigateNext();
		if (this._activeSectionIndex < this._children.length - 1 || val) {
			return true;
		} else {
			return false;
		}
	}
	public canNavigatePrevious(): boolean {
		let val = this.activeSection.canNavigatePrevious();
		if (this._activeSectionIndex > 0 || val) {
			return true;
		} else {
			return false;
		}
	}

	public navigatePrevious(): boolean {
		if (this.activeSection.navigatePrevious()) {
			if (this._activeSectionIndex <= 0) {
				// this.activeSection.updateGroup();
				return true;
			} else {
				this._activeSectionIndex--;
				// this.activeSection.updateGroup();
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
				this.activeSection.updateGroup();
				this._activeSectionIndex++;
				return false;
			}
		}

		return false;
	}

	public initialize(): Subject<void> {
		this._activeSectionIndex = 0;
		this.activeSection.initialize();
		return null;
	}
}
