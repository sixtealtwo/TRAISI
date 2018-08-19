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
	AfterViewInit
} from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';
import { AuthService } from '../../../services/auth.service';
import { ConfigurationService } from '../../../services/configuration.service';
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

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit, AfterViewInit {
	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;
	public editing: boolean = false;

	public newQuestion: boolean = true;

	public configurations: QuestionConfigurationDefinition[] =  [];
	public childrenComponents = [];

	public froalaQTestOptions: any;

	@Output()
	configResult = new EventEmitter<string>();

	@ViewChildren('dynamic', { read: ViewContainerRef })
	public configTargets: QueryList<ViewContainerRef>;

	constructor(
		private authService: AuthService,
		private configurationService: ConfigurationService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private cDRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.froalaQTestOptions = this.generateFroalaOptions('Question Text');
	}

	ngAfterViewInit() {
		this.updateAdvancedParams();
		this.configTargets.changes.subscribe(item => {
			this.updateAdvancedParams();
		});
	}

	updateAdvancedParams() {
		const paramComponents = this.parameterComponents();
		for (let i = 0; i < this.configTargets.toArray().length; i++) {
			let conf = this.configurations[i];
			let component = paramComponents[conf.builderType];

			if (component) {
				let target = this.configTargets.toArray()[i];
				let paramComponent = this.componentFactoryResolver.resolveComponentFactory(
					component
				);

				let cmpRef: any = target.createComponent(paramComponent);

				cmpRef.instance.id = i;
				cmpRef.instance.questionConfiguration = conf;
				this.childrenComponents.push(cmpRef);
			}
		}
		this.cDRef.detectChanges();
	}

	parameterComponents() {
		let widgetComponents = {
			'Checkbox': CheckboxComponent,
			'Date': DateInputComponent,
			'SingleSelect': DropdownListComponent,
			'MultiSelect': MultiSelectComponent,
			'Text': TextboxComponent,
			'TextArea': TextAreaComponent,
			'NumericText': NumericTextboxComponent,
			'Slider': SliderComponent,
			'Switch': SwitchComponent,
			'Time': TimeInputComponent,
			'Location': LocationFieldComponent,
			'Radio': RadioComponent
		};

		return widgetComponents;
	}

	advancedConfig() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	}

	saveConfiguration() {
		this.configResult.emit('save');
	}

	cancel() {
		this.configResult.emit('cancel');
	}

	delete() {
		this.configResult.emit('delete');
	}

	processConfigurations() {
		this.configurations = Object.values(this.questionType.questionConfigurations);
	}

	generateFroalaOptions(placeHolder: string) {
		return {
			toolbarInline: false,
			charCounterCount: false,
			toolbarVisibleWithoutSelection: true,
			placeholderText: placeHolder,
			fontFamilySelection: true,
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
