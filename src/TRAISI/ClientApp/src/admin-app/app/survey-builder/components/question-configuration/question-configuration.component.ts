import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChildren,
	ViewContainerRef,
	QueryList,
	ComponentFactoryResolver,
	ChangeDetectorRef,
	AfterViewInit,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ConfigurationService } from '../../../../../shared/services/configuration.service';
import { CheckboxComponent } from './checkbox-field/checkbox.component';
import { QuestionConfigurationDefinition } from '../../models/question-configuration-definition.model';
import { DateInputComponent } from './date-input-field/date-input.component';
import { DropdownListComponent } from './dropdown-list-field/dropdown-list.component';
import { MultiSelectComponent } from './multi-select-field/multi-select.component';
import { TextboxComponent } from './textbox-field/textbox.component';
import { TextAreaComponent } from './textarea-field/textarea.component';
import { NumericTextboxComponent } from './numeric-textbox-field/numeric-textbox.component';
import { SliderComponent } from './slider-field/slider.component';
import { SwitchComponent } from './switch-field/switch.component';
import { TimeInputComponent } from './time-input-field/time-input.component';
import { LocationFieldComponent } from './location-field/location.component';
import { RadioComponent } from './radio-field/radio.component';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionConfigurationValue } from '../../models/question-configuration-value.model';
import { TreeviewItem, TreeviewI18nDefault, TreeviewSelection } from 'ngx-treeview';
import { QuestionConditional } from '../../models/question-conditional.model';
import { QuestionOptionConditional } from '../../models/question-option-conditional.model';
import { QuestionConditionalsComponent } from './question-conditionals/question-conditionals.component';
import Quill from 'quill';
import { DropdownTreeviewSelectComponent } from '../../../shared/dropdown-treeview-select/dropdown-treeview-select.component';
import { DropdownTreeviewSelectI18n } from '../../../shared/dropdown-treeview-select/dropdown-treeview-select-i18n';

// override p with div tag
const Parchment = Quill.import('parchment');
let Block = Parchment.query('block');

class NewBlock extends Block {}
NewBlock.tagName = 'DIV';
Quill.register(NewBlock, true);


@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuestionConfigurationComponent implements OnInit, AfterViewInit {
	public surveyId: number;

	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;
	public editing: boolean = false;

	public newQuestion: boolean = true;

	public configurations: QuestionConfigurationDefinition[] = [];

	public configurationValues: QuestionConfigurationValue[] = [];

	public sourceQuestionConditionals: QuestionConditional[] = [];

	public sourceQuestionOptionConditionals: QuestionOptionConditional[] = [];

	public childrenComponents = [];

	public froalaQTestOptions: any;

	public fullStructure: TreeviewItem[] = [];
	public questionOptionsAfter: TreeviewItem[] = [];
	public questionsBefore: TreeviewItem[] = [];
	public thisQuestion: TreeviewItem[] = [];

	public treedropdownSingleConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public pipeValue: string;

	public conditionalsLoaded: boolean = false;
	public isSaving: boolean = false;

	public quillQuestionTextModules = {
		toolbar: [
			['bold', 'italic', 'underline'],        // toggled buttons
			[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			[{ 'color': [] }],          // dropdown with defaults from theme
			[{ 'align': [] }],
			['clean']                                         // remove formatting button
		]
	};

	@Output()
	configResult = new EventEmitter<string>();

	@ViewChild('conditionals')
	public conditionalsComponent: QuestionConditionalsComponent;

	@ViewChild('pipeTreeSelect')
	public pipeTreeSelect: DropdownTreeviewSelectComponent;

	private questionQuillEditor: any;

	@ViewChildren('dynamic', { read: ViewContainerRef })
	public configTargets: QueryList<ViewContainerRef>;

	constructor(
		private builderService: SurveyBuilderService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private cDRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.froalaQTestOptions = this.generateFroalaOptions('Question Text');
	}

	pipeDropdown(e: TreeviewSelection): string {
		let selected = (<DropdownTreeviewSelectI18n>this.pipeTreeSelect.i18n).selectedItem;
		return (selected !== undefined && selected !== null) ? selected.text : 'Select Question';
	}

	ngAfterViewInit() {
		// this.updateAdvancedParams();
		setTimeout(() => {
			this.configTargets.changes.subscribe(item => {
				this.updateAdvancedParams();
			});
		}, 2000);
	}

	questiontextEditorCreated(quillInstance: any) {
		this.questionQuillEditor = quillInstance;
	}

	updateAdvancedParams() {
		const paramComponents = this.parameterComponents();
		this.childrenComponents = [];
		if (this.configurations.length > 0) {
			this.builderService
				.getQuestionPartConfigurations(this.surveyId, this.questionBeingEdited.questionPart.id)
				.subscribe(configurationValues => {
					for (let i = 0; i < this.configTargets.toArray().length; i++) {
						let conf = this.configurations[i];
						let component = paramComponents[conf.builderType];

						if (component) {
							let target = this.configTargets.toArray()[i];
							target.clear();
							let paramComponent = this.componentFactoryResolver.resolveComponentFactory(component);

							let cmpRef: any = target.createComponent(paramComponent);

							cmpRef.instance.id = i;
							cmpRef.instance.questionConfiguration = conf;
							if (configurationValues.has(conf.name)) {
								cmpRef.instance.processPriorValue(configurationValues.get(conf.name));
							}
							this.childrenComponents.push(cmpRef);
						}
					}
				});
		}
		// this.cDRef.detectChanges();
	}

	parameterComponents() {
		let widgetComponents = {
			Checkbox: CheckboxComponent,
			Date: DateInputComponent,
			SingleSelect: DropdownListComponent,
			MultiSelect: MultiSelectComponent,
			Text: TextboxComponent,
			TextArea: TextAreaComponent,
			NumericText: NumericTextboxComponent,
			Slider: SliderComponent,
			Switch: SwitchComponent,
			Time: TimeInputComponent,
			Location: LocationFieldComponent,
			Radio: RadioComponent
		};

		return widgetComponents;
	}

	advancedConfig() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	}

	saveConfiguration() {
		this.configurationValues = [];
		this.childrenComponents.forEach(compRef => {
			this.configurationValues.push(
				new QuestionConfigurationValue(compRef.instance.questionConfiguration.name, compRef.instance.getValue())
			);
		});
		this.isSaving = true;
		this.configResult.emit('save');
	}

	public getUpdatedConditionals(): [QuestionConditional[], QuestionOptionConditional[]] {
		return this.conditionalsComponent.getUpdatedConditionals();
	}

	cancel() {
		this.configResult.emit('cancel');
	}

	delete() {
		this.configResult.emit('delete');
	}

	public pipeQuestion() {
		let pipeQSelected = (<DropdownTreeviewSelectI18n>this.pipeTreeSelect.i18n).selectedItem;
		if (pipeQSelected) {
			let currentCursorPosition = this.questionQuillEditor.getSelection();
			if (!currentCursorPosition) {
				currentCursorPosition = this.questionQuillEditor.getLength() - 1;
			}
			this.questionQuillEditor.insertText(currentCursorPosition, `{{ ${pipeQSelected.text} }}`);
		}
	}

	processConfigurations() {
		this.configurations = Object.values(this.questionType.questionConfigurations);
		if (this.questionType.typeName !== 'Survey Part') {
			this.builderService.getStandardViewPagesStructureWithQuestionsOptions(this.surveyId, 'en').subscribe(
				treelist => {
					this.fullStructure = treelist;
					this.processQuestionTree();
					this.loadPastConditionals();
					setTimeout(() => {
						if (this.pipeTreeSelect) {
							this.pipeTreeSelect.i18n.getText = e => this.pipeDropdown(e);
						}
					}, 0);
				}
			);
		}
	}

	private loadPastConditionals() {
		this.builderService.getQuestionPartConditionals(this.surveyId, this.questionBeingEdited.questionPart.id).subscribe(
			conditionals => {
				this.builderService.getQuestionPartOptionConditionals(this.surveyId, this.questionBeingEdited.questionPart.id).subscribe(
					oConditionals => {
						this.sourceQuestionConditionals = conditionals.filter(c => c.sourceQuestionId === this.questionBeingEdited.questionPart.id);
						this.sourceQuestionOptionConditionals = oConditionals.filter(c => c.sourceQuestionId === this.questionBeingEdited.questionPart.id);
						this.conditionalsLoaded = true;
					}
				);
			}
		);
	}

	private processQuestionTree() {
		this.questionsBefore = [];
		this.questionOptionsAfter = [];
		this.thisQuestion = [];
		let questionHitThisPage: boolean = false;
		this.fullStructure.forEach(treeElement => {
			let page = {
				value: treeElement.value,
				text: treeElement.text,
				checked: false,
				children: []
			};

			if (treeElement.children) {
				let { pageReturn, questionHitReturn } = this.processQuestionPageIntoTree(page, treeElement, questionHitThisPage);
				page = pageReturn;
				questionHitThisPage = questionHitReturn;
			}
			if (questionHitThisPage && page.children.length > 0) {
				this.questionOptionsAfter.push(new TreeviewItem(page));
			} else if (page.children.length > 0) {
				this.questionsBefore.push(new TreeviewItem(page));
			}
		});
	}

	private processQuestionPageIntoTree(page: any, treeElement: TreeviewItem, questionHit: boolean)
	{
		for (let element of treeElement.children) {
			if (element.value === `question-${this.questionType.typeName}-${this.questionBeingEdited.questionPart.id}`) {
				this.thisQuestion = [element];
				if (page.children.length > 0) {
					this.questionsBefore.push(new TreeviewItem(page));
					page = {
						value: treeElement.value,
						text: treeElement.text,
						checked: false,
						children: []
					};
				}
				questionHit = true;
			} else {
				if (!questionHit && element.children) {
					if (((<string>element.children[0].value).startsWith('option'))) {
						this.clearOptionsFromElement(element);
					}
				}
				let elementCopy = {
					value: element.value,
					text: element.text,
					checked: false,
					children: []
				};
				if (element.children) {
					let { pageReturn, partReturn, questionHitReturn } = this.processQuestionPartIntoTree(page, element, elementCopy, questionHit);
					page = pageReturn;
					elementCopy = partReturn;
					questionHit = questionHitReturn;
				}
				if (!((<string>element.value).startsWith('part') && elementCopy.children.length === 0)) {
					page.children.push(new TreeviewItem(elementCopy));
				}
			}
		}
		return { pageReturn: page, questionHitReturn: questionHit};
	}

	private processQuestionPartIntoTree(page: any, partSource: TreeviewItem, part, questionHit: boolean)
	{
		for (let element of partSource.children) {
			if (element.value === `question-${this.questionType.typeName}-${this.questionBeingEdited.questionPart.id}`) {
				this.thisQuestion = [element];
				if (page.children.length > 0 || part.children.length > 0) {
					if (part.children.length > 0) {
						page.children.push(part);
					}
					this.questionsBefore.push(new TreeviewItem(page));
					page = {
						value: page.value,
						text: page.text,
						checked: false,
						children: []
					};
					part = {
						value: partSource.value,
						text: partSource.text,
						checked: false,
						children: []
					};
				}
				questionHit = true;
			} else {
				if (!questionHit && element.children) {
					if (((<string>element.children[0].value).startsWith('option'))) {
						this.clearOptionsFromElement(element);
					}
				}
				part.children.push(element);
			}
		}
		return {pageReturn: page, partReturn: part, questionHitReturn: questionHit};
	}

	private clearOptionsFromElement(element: TreeviewItem) {
		if (element.children && element.children.length > 0) {
			if ((<string>element.children[0].value).startsWith('option')) {
				element.children = undefined;
			} else {
				element.children.forEach(child => {
					this.clearOptionsFromElement(child);
				});
			}
		}
	}


	generateFroalaOptions(placeHolder: string) {
		return {
			toolbarInline: false,
			charCounterCount: false,
			toolbarVisibleWithoutSelection: true,
			placeholderText: placeHolder,
			fontFamilySelection: true,
			enter: (<any>$).FroalaEditor.ENTER_BR,
			fontFamily: {
				'Source Sans Pro,sans-serif': 'Source Sans Pro',
				'Arial,Helvetica,sans-serif': 'Arial',
				'Georgia,serif': 'Georgia',
				'Impact,Charcoal,sans-serif': 'Impact',
				'Tahoma,Geneva,sans-serif': 'Tahoma',
				'Times New Roman,Times,serif': 'Times New Roman',
				'Verdana,Geneva,sans-serif': 'Verdana'
			},
			toolbarButtons: ['bold', 'italic', 'underline', 'subscript', 'superscript', 'color'],
			toolbarButtonsSM: ['bold', 'italic', 'underline', 'subscript', 'superscript', 'color']
		};
	}
}
