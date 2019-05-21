import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TradeshowService } from '../tradeshow.service';
import { EventInfo } from '../shared/EventInfo';

@Component({
  selector: 'app-event-delete-popup',
  templateUrl: './event-delete-popup.component.html',
  styleUrls: ['./event-delete-popup.component.scss']
})
export class EventDeletePopupComponent implements OnInit {
  @Input() event: EventInfo;
  @Output() eventDeleted: EventEmitter<any> = new EventEmitter<any>();
  deleteText: string;
  isLoading: boolean;
  errorMsg: string;

  constructor(
    public activeModal: NgbActiveModal,
    private service: TradeshowService
  ) { }

  ngOnInit() {
  }

  cancelPopup() {
    this.activeModal.close("Cancel clicked");
  }

  onDelete() {
    if (this.event) {
      this.isLoading = true;
      this.service.deleteEvent(this.event.ID)
        .subscribe(result => {
          this.errorMsg = null;
          this.eventDeleted.emit();
          this.isLoading = false;
        }, error => {
          this.errorMsg = error;
          this.isLoading = false;
        });
    }
  }
}
