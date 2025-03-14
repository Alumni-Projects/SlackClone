import { Component, ElementRef, ViewChild,ChangeDetectorRef } from '@angular/core';
import { DevspaceService } from '../../shared/Service/devspace.service';


@Component({
  selector: 'app-devspace-message',
  imports: [],
  templateUrl: './devspace-message.component.html',
  styleUrl: './devspace-message.component.scss'
})
export class DevspaceMessageComponent {
  @ViewChild('messageInput') messageInput!: ElementRef;
  openSmileyBar = false;
  openContactBar = false;
  
  
  constructor(public devspaceService: DevspaceService,private cdRef: ChangeDetectorRef) { }
  selectSmiley(i: number) {
    const emoji = this.devspaceService.emojis[i];
  
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus(); // Setzt den Fokus auf das contenteditable div
  
    const selection = window.getSelection();
    const range = document.createRange();
  
    // Falls die Auswahl im messageDiv nicht gültig ist, setzen wir den Range explizit auf den messageDiv
    if (!selection || selection.rangeCount === 0 || selection.anchorNode !== messageDiv) {
      // Wenn der messageDiv leer ist, setzen wir den Range an den Anfang des Divs
      if (messageDiv.childNodes.length === 0) {
        range.setStart(messageDiv, 0);
        range.setEnd(messageDiv, 0);
      } else {
        // Falls Text im Div vorhanden ist, setzen wir den Range ans Ende des Divs
        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {
      // Falls bereits eine Auswahl im Div existiert, verwenden wir diese
      range.setStart(selection.anchorNode, selection.anchorOffset);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
    }
  
    // Löschen des eventuell markierten Textes im Range
    range.deleteContents();
  
    // Emoji als Textknoten erstellen und in den Range einfügen
    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);
  
    // Den Cursor direkt hinter das eingefügte Emoji setzen
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
  
    selection?.removeAllRanges();
    selection?.addRange(range); // Den Range auf die neue Position setzen
  
    this.openSmileyBar = false;
    this.cdRef.detectChanges();
  }
  
  
  openAt(){
    const at = '@';
  
    const messageDiv = this.messageInput.nativeElement as HTMLDivElement;
    messageDiv.focus(); // Setzt den Fokus auf das contenteditable div
  
    const selection = window.getSelection();
    const range = document.createRange();
  
    // Falls die Auswahl im messageDiv nicht gültig ist, setzen wir den Range explizit auf den messageDiv
    if (!selection || selection.rangeCount === 0 || selection.anchorNode !== messageDiv) {
      // Wenn der messageDiv leer ist, setzen wir den Range an den Anfang des Divs
      if (messageDiv.childNodes.length === 0) {
        range.setStart(messageDiv, 0);
        range.setEnd(messageDiv, 0);
      } else {
        // Falls Text im Div vorhanden ist, setzen wir den Range ans Ende des Divs
        range.setStart(messageDiv, messageDiv.childNodes.length);
        range.setEnd(messageDiv, messageDiv.childNodes.length);
      }
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {
      // Falls bereits eine Auswahl im Div existiert, verwenden wir diese
      range.setStart(selection.anchorNode, selection.anchorOffset);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
    }
  
    // Löschen des eventuell markierten Textes im Range
    range.deleteContents();
  
    // Emoji als Textknoten erstellen und in den Range einfügen
    const textNode = document.createTextNode(at);
    range.insertNode(textNode);
  
    // Den Cursor direkt hinter das eingefügte at setzen
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
  
    selection?.removeAllRanges();
    selection?.addRange(range); // Den Range auf die neue Position setzen
  
    
    this.cdRef.detectChanges();

    this.openContactBar = true;
  }

  selectContact(i:number){
    this.openContactBar = false;
  }
  
  openSmiley(){
    this.openSmileyBar = !this.openSmileyBar;
  }

  closeBars(){
    this.openSmileyBar = false;
    this.openContactBar = false;
  }
}
