import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMessageDate'
})
export class FormatMessageDatePipe implements PipeTransform {
  transform(value: string | Date, mode: 'dayLabel' | 'time' = 'dayLabel'): string {
    const date = new Date(value);
    const now = new Date();

    if (mode === 'time') {
      return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    const isToday =
      date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Heute';
    } else if (isYesterday) {
      return 'Gestern';
    } else {
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
  }
}
