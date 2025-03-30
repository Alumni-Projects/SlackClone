import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-member-channel-dialog',
  imports: [],
  templateUrl: './member-channel-dialog.component.html',
  styleUrl: './member-channel-dialog.component.scss'
})
export class MemberChannelDialogComponent {
constructor(public dialog: MatDialog) { }
}
