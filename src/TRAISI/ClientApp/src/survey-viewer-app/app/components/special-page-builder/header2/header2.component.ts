import { Component, OnInit, Input} from '@angular/core';



@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss']
})
export class Header2Component implements OnInit {

	public imageSource1: string;
	public imageSource2: string;

	private pageHTMLJson: any;

	@Input() public pageHTML: string;
	@Input() public pageThemeInfo: any;

  constructor(	) {	}

  public ngOnInit(): void {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
			this.imageSource1 = pageData.image1;
			this.imageSource2 = pageData.image2;
		} catch (e) {
			this.pageHTMLJson = {};
			this.imageSource1 = undefined;
			this.imageSource2 = undefined;
		}
		if (!('headerColour' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerColour = 'rgb(240,239,240)';
		}
		if (!('headerMaxHeightScale1' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerMaxHeightScale1 = 1.0;
		}
		if (!('headerMaxHeightScale2' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerMaxHeightScale2 = 1.0;
		}
		if (!('headerBackgroundHeight' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerBackgroundHeight = 66;
		}
	}
}
