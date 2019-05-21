import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventField } from '../shared/EventInfo';
import { InputType, Role } from '../shared/Enums';
import { CommonService } from '../common.service';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { TradeshowService } from '../tradeshow.service';

@Component({
  selector: 'app-event-field-popup',
  templateUrl: './event-field-popup.component.html',
  styleUrls: ['./event-field-popup.component.scss']
})
export class EventFieldPopupComponent implements OnInit {
  @Input() eventID: number;
  @Input() fieldToEdit: EventField;
  @Output() saveClicked: EventEmitter<EventField> = new EventEmitter<EventField>();
  @ViewChild("requiredDropdown") private requiredDropdown: DropDownListComponent;
  @ViewChild("inputDropdown") private inputDropdown: DropDownListComponent;
  @ViewChild("option") private option: ElementRef;
  field: EventField;
  InputType: typeof InputType = InputType;
  requiredOptions: Array<{ text: string, value: boolean }>;
  inputOptions: Array<{ text: string, value: InputType }>;
  optionList: Array<string>;
  errorMsg: string;
  choiceErrMsg: string;
  isLoading: boolean;

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService
  ) {
    // Required Options Dropdown
    this.requiredOptions = [
      { text: "", value: null },
      { text: "Required", value: true },
      { text: "Optional", value: false }
    ];
    // Input Type Options Dropdown
    this.inputOptions = [];
    CommonService.enumToArray(InputType).forEach(i => {
      let value: InputType = i as InputType;
      let text: string = CommonService.getInputTypeString(i as InputType);
      this.inputOptions.push({ text: text, value: value });
    });
   }

  ngOnInit() {

    if (!this.fieldToEdit || this.eventID < 1) {
      this.activeModal.close();
      return;
    }
    // Assign model field
    this.field = Object.assign({}, this.fieldToEdit);
        
    // Assign model option list
    if (this.field.Options) {
      this.optionList = this.field.Options.split('|');
    } else {
      this.optionList = [];
    }

    
  }

  get showOption(): boolean {
    return this.field.Input == InputType.Select || this.field.Input == InputType.MultiSelect;
  }

  addOption() {
    if (!this.option.nativeElement.value) {
      this.choiceErrMsg = "Choice required";
      return;
    }
    let name = this.option.nativeElement.value.toLowerCase();
    if (name.indexOf('|') >= 0) {
      this.choiceErrMsg = "Invalid character(s): |"
      return;
    }
    if (this.optionList.find(h => {
      return name == h.toLowerCase();
    })) {
      this.option.nativeElement.value = "";
      this.choiceErrMsg = null;
      return;
    }
    this.optionList.push(this.option.nativeElement.value);
    this.option.nativeElement.value = null;
    this.choiceErrMsg = null;
  }
  removeOption(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.optionList.length) {
      this.optionList.splice(index, 1);
    }
  }

  cancelPopup() {
    this.activeModal.close();
  }

  get isValid(): boolean {
    if (!this.field.Label) {
      return false;
    }
    if (this.field.Required == null) {
      return false;
    }
    if (this.field.Input == InputType.Unknown) {
      return false;
    }
    if (this.field.Input == InputType.Select ||
      this.field.Input == InputType.MultiSelect) {
        if (this.optionList.length == 0) {
          return false;
        }
    }
    return true;
  }

  onSubmit(form: any) {
    if (!this.isValid) {
      return;
    }
    // Set Options
    this.field.Options = this.optionList.join('|');
    
    // Save the field
    this.isLoading = true;
    this.service.saveEventField(this.eventID, this.field)
      .subscribe(result => {
        this.errorMsg = null;
        this.saveClicked.emit(result);
        this.isLoading = false;
        this.activeModal.close();
      }, error => { 
        this.errorMsg = error;
        this.isLoading = false;
      });

  }
}
