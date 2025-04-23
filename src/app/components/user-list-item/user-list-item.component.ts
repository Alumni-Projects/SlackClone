import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceAccount } from '@shared/interface/devspace-account';

@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Input() user!: DevspaceAccount;
  @Input() isActive: boolean = false;
  @Input() currentUserUid: string = '';
  @Output() userClicked = new EventEmitter<void>();

  handleClick() {
    this.userClicked.emit();
  }
}
