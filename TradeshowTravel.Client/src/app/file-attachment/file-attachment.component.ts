import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TradeshowService } from '../tradeshow.service';
import { Attachment } from '../shared/Attachment';


@Component({
  selector: 'file-attachment-component',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss']
})

export class FileAttachmentComponent {
  private _eventId: number;

  attachmentList: Attachment[];

  @Output() selectedAttachmentsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() errorMsg: EventEmitter<string> = new EventEmitter<string>();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();;

  constructor(
    private service: TradeshowService,
  ) {
    this.attachmentList = [];
  }

  @Input()
  set eventId(eventId: number) {
    this._eventId = eventId;
  }
  get eventId(): number {
    return this._eventId;
  }

  onFileSelected(event) {
    this.errorMsg.emit(null);
    this.isLoading.emit(true);

    if (event.target.files && event.target.files[0]) {
      var file: File = <File>event.target.files[0];

      // prevent extreamly large files from being sent to the server and taking a long long time
      // anything smaller than this can be attempted and error returned by the server
      if (file.size > 25000000) {
        this.errorMsg.emit("Attachment is too large.");
        this.isLoading.emit(false);
        return;
      }

      for (var i = 0; i < this.attachmentList.length; i++) {
        if (this.attachmentList[i].File.name == file.name && this.attachmentList[i].File.size == file.size) {
          this.errorMsg.emit("Attachment already added.");
          return;
        }
      }

      var fd = new FormData();
      fd.append('file', file, file.name);

      this.service.uploadAttachment(this.eventId, fd)
        .subscribe(resp => {
          var attachmentedItem: Attachment = { Path: "", File: null };
          attachmentedItem.Path = resp;
          attachmentedItem.File = file;

          this.attachmentList.push(attachmentedItem);
          this.selectedAttachmentsChange.emit(this.getAttachmentPaths());

          this.isLoading.emit(false);
        }, error => {
          this.errorMsg.emit(error);
          this.isLoading.emit(false);
        });
    }
  }

  onRemoveAttachment(index) {
    this.attachmentList.splice(index, 1);
    this.selectedAttachmentsChange.emit(this.getAttachmentPaths());
  }

  private getAttachmentPaths() {
    return this.attachmentList.map(function (i) { return i.Path });
  }
}
