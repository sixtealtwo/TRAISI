import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class Header1Component implements OnInit {

	private baseUrl: string = '';
	public imageSource: string;

	private pageHTMLJson: any;

	@Input() public pageHTML: string;
	@Input() public pageThemeInfo: any;

  constructor() {

	}

  public ngOnInit(): void {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
			this.imageSource = pageData.image;
		} catch (e) {
			this.pageHTMLJson = {};
			this.imageSource = undefined;
		}
		if (!('headerColour' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerColour = 'rgb(240,239,240)';
		}
		if (!('headerMaxHeightScale' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerMaxHeightScale = 1.0;
		}
		if (!('headerBackgroundHeight' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerBackgroundHeight = 66;
		}

	}

}
