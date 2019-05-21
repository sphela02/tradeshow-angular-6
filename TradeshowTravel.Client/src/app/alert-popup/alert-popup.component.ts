import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() secondaryText: string = "CANCEL";
  @Input() primaryText: string = "OK";
  @Output() primaryClicked: EventEmitter<any> = new EventEmitter();
  @Output() secondaryClicked: EventEmitter<any> = new EventEmitter();

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  onSecondary() {
    this.secondaryClicked.emit();
    this.activeModal.close();
  }

  onPrimary() {
    this.primaryClicked.emit();
    this.activeModal.close();
  }
}
