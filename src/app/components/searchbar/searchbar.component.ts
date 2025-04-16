import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconSize } from '@shared/Enums/iconSize';
import { Color } from '@shared/Enums/color';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  imports: [ReactiveFormsModule, MatIconModule, CommonModule]
})
export class SearchbarComponent {
  @Input() variant: 'desktop' | 'mobile' = 'desktop';
  searchControl = new FormControl('');
  placeholder = 'Suchen...';

  IconSize = IconSize;
  Color = Color;
}
