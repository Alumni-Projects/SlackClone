import { Component } from '@angular/core';
import { MatDialog, MatDialogContent} from '@angular/material/dialog';
@Component({
  selector: 'app-devspace-dialog',
  imports: [MatDialogContent],
  templateUrl: './devspace-dialog.component.html',
  styleUrl: './devspace-dialog.component.scss'
})
export class DevspaceDialogComponent {

  constructor(private dialog: MatDialog) { }



}
