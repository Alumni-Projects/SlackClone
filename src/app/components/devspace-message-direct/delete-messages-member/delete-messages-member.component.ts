import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';
import { FirestoreService } from '@shared/services/firestore-service/firestore.service';

@Component({
  selector: 'app-delete-messages-member',
  imports: [],
  templateUrl: './delete-messages-member.component.html',
  styleUrl: './delete-messages-member.component.scss'
})
export class DeleteMessagesMemberComponent {

  constructor(public dialog: MatDialog,
    public devspaceService: DevspaceService,
    public firestore: FirestoreService,
    public breakpoints: BreakpointsService) { }
  close() {
    this.dialog.closeAll();
  }

  deleteMemberDm() {    
    const dmId = this.devspaceService.contactDmId!;    
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.dmAccounts = this.devspaceService.dmAccounts.filter(account => account.dmId !== dmId);
    this.firestore.deleteUserDm(dmId);       
    this.close();
    if (this.breakpoints.breankpointMain) {
      this.devspaceService.openDevspace = true;
    }
  }
}
