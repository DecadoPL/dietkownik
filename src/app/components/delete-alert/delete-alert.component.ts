import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.css']
})
export class DeleteAlertComponent {
  @Input() message!: string;
  @Output() deleteCancel = new EventEmitter<void>();
  @Output() deleteConfirm = new EventEmitter<void>();

  onDeleteCancel(){
    this.deleteCancel.emit();
  }

  onDeleteConfirm(){
    this.deleteConfirm.emit();
  }

}
