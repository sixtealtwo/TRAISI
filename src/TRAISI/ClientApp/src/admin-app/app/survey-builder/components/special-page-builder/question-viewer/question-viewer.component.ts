import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QuestionPartView } from '../../../models/question-part-view.model';
import { Utilities } from '../../../../../../shared/services/utilities';

@Component({
  selector: 'app-question-viewer',
  templateUrl: './question-viewer.component.html',
  styleUrls: ['./question-viewer.component.scss']
})
export class QuestionViewerComponent implements OnInit {

	@Input()
	public allPages: QuestionPartView;
	@Input()
	public previewMode: any;
	@Input() public pageThemeInfo: any;
	@Output()	public pageThemeInfoChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
	}

	householdHeaderBackgroundColourChange(newColour: string): void  {
		this.pageThemeInfo.householdHeaderColour = newColour;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}

	questionViewerNavButtonColourChange(newColour: string): void  {
		this.pageThemeInfo.questionViewerNavButtonColour = newColour;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}

	getBestBorderColor() {
		if (this.pageThemeInfo.pageBackgroundColour) {
			let borderColor = Utilities.whiteOrBlackText(this.pageThemeInfo.pageBackgroundColour);
			if (borderColor === 'rgb(255,255,255)') {
				return 'rgb(200,200,200)';
			} else {
				return borderColor;
			}
		} else {
			return 'rgb(0,0,0)';
		}
	}

	getBestPageBodyTextColor() {
		if (this.pageThemeInfo.pageBackgroundColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.pageBackgroundColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}

	getBestHouseholdHeaderTextColor() {
		if (this.pageThemeInfo.householdHeaderColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.householdHeaderColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}

	useDarkButtons() {
		return this.getBestPageBodyTextColor() !== 'rgb(0,0,0)';
	}

	getBestNavigationTextColor() {
		if (this.pageThemeInfo.questionViewerNavButtonColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.questionViewerNavButtonColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}



	getPageIcon(page: QuestionPartView) {
		return page.icon;
	}

}
