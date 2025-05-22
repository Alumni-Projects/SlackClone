import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreakpointsService } from '@shared/services/breakpoints-service/breakpoints.service';
import { DevspaceService } from '@shared/services/devspace-service/devspace.service';


@Component({
  selector: 'app-workspace-open-close',
  imports: [CommonModule],
  templateUrl: './workspace-open-close.component.html',
  styleUrl: './workspace-open-close.component.scss'
})
export class WorkspaceOpenCloseComponent {
  openMenu: boolean = false

  constructor(public devspaceService: DevspaceService, public breakpoints: BreakpointsService) {
  }

  openCLoseMenu() {
    this.openMenu = !this.openMenu;
    this.devspaceService.openDevspace = !this.devspaceService.openDevspace;    
  }

}
