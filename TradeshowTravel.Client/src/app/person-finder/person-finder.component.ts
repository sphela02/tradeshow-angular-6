import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { TradeshowService } from '../tradeshow.service';
import { UserInfo } from '../shared/UserInfo';
import { Observable } from 'rxjs/Observable';
import { UserProfile } from '../shared/UserProfile';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { ControlValueAccessor, NG_VALUE_ACCESSOR  } from '@angular/forms';

@Component({
  selector: 'app-person-finder',
  templateUrl: './person-finder.component.html',
  styleUrls: ['./person-finder.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonFinderComponent),
      multi: true
    }
  ]
})
export class PersonFinderComponent implements ControlValueAccessor {
  @Input() usePrimitive: boolean = true;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter();
  private innerValue: any;
  public view: Observable<any>;
  
  private onChangeCallback = (_) => {};
  private onTouchedCallback = () => {};

  constructor(private service: TradeshowService) {
  }

  get value(): any {
    return this.innerValue;
  }
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;

      if (this.usePrimitive) {
        this.view = this.service.getUsersByUsername(v);
      } else if (v) {
        this.view = new Observable(observer => {
          let user : Array<UserInfo> = [ v ];
          observer.next(user);
          observer.complete();
        });
      }

      this.onChangeCallback(v);
      this.valueChange.emit(v);
    }
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.value = value;
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  public comboValueChange(value: any): void {
    this.value = value;
  }

  onBlur() {
    this.onTouchedCallback();
  }

  handleFilter(value) {
    this.view = this.service.getUsersByName(value);
  }
}
