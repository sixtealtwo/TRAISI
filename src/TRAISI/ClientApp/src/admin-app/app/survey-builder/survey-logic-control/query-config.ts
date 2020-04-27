import { QueryBuilderConfig, QueryBuilderClassNames } from 'angular2-query-builder';
export const defaultConfig: QueryBuilderConfig = {
    fields: {
      age: {name: 'Age', type: 'number'},
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          {name: 'Male', value: 'm'},
          {name: 'Female', value: 'f'}
        ]
      }
    }
  }

  export const classNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  }