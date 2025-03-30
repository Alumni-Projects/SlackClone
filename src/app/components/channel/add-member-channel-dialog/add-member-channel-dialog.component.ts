import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-member-channel-dialog',
  imports: [],
  templateUrl: './add-member-channel-dialog.component.html',
  styleUrl: './add-member-channel-dialog.component.scss'
})
export class AddMemberChannelDialogComponent {
  constructor(public dialog: MatDialog) { }

}
