import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss']
})
export class Header1Component implements OnInit {

	public quillModules = {
		blotFormatter: { },
		toolbar: [
			['image']                         // link and image, video
		]
	};

	@Input() public pageHTML: string;
	@Output() public pageHTMLChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

	updateContent(contentInfo: any) {
		console.log(contentInfo);
		this.pageHTMLChange.emit(this.pageHTML);
	}
}
