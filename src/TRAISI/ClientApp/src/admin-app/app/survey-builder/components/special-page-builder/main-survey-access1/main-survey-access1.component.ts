import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-main-survey-access1',
  templateUrl: './main-survey-access1.component.html',
	styleUrls: ['./main-survey-access1.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MainSurveyAccess1Component implements OnInit {

	public quillVideoModules = {
		blotFormatter: { },
		toolbar: [
			['video']                         // link and image, video
		]
	};
	public quillModules = {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],
	
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
			[{ 'direction': 'rtl' }],                         // text direction
	
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
	
			[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
			[{ 'font': [] }],
			[{ 'size': [] }],
			[{ 'align': [] }],
	
			['clean'],                                         // remove formatting button
	
			['link']                         // link and image, video
		]
	};

	public quillMinimalModules = {
		toolbar: []
	}

	public videoHTML: string;
	public introTextHTML: string;
	public accessCodeHTML: string;
	public beginSurveyHTML: string;

	private pageHTMLJson: any;
	@Input() public pageHTML: string;
	@Output() public pageHTMLChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
			this.videoHTML = pageData.video;
			this.introTextHTML = pageData.introText;
			this.accessCodeHTML = pageData.accessCode;
			this.beginSurveyHTML = pageData.beginSurvey;
		} catch (e) {
			this.pageHTMLJson = {};
			this.videoHTML = '';
			this.introTextHTML = '';
			this.accessCodeHTML = 'Enter Access Code';
			this.beginSurveyHTML = 'Begin Survey';
		}
  }

	updateVideoContent(contentInfo: any) {
		this.pageHTMLJson.video = this.videoHTML;
		this.updatePageHTML();
	}

	updateContent(contentInfo: any) {
		this.pageHTMLJson.introText = this.introTextHTML;
		this.updatePageHTML();
	}

	updateAccessCodeContent(contentInfo: any) {
		this.pageHTMLJson.accessCode = this.accessCodeHTML;
		this.updatePageHTML();
	}

	updateBeginSurveyContent(contentInfo: any) {
		this.pageHTMLJson.beginSurvey = this.beginSurveyHTML;
		this.updatePageHTML();
	}

	private updatePageHTML() {
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}
}
