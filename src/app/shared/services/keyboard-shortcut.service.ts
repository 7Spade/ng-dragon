import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, filter, map, Observable } from 'rxjs';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutService {
  private document = inject(DOCUMENT);

  register(shortcut: KeyboardShortcut): Observable<KeyboardEvent> {
    return fromEvent<KeyboardEvent>(this.document, 'keydown').pipe(
      filter((event) => this.matchesShortcut(event, shortcut)),
      map((event) => {
        event.preventDefault();
        return event;
      })
    );
  }

  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
    const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
    const shiftMatch = shortcut.shift ? event.shiftKey : true;
    const altMatch = shortcut.alt ? event.altKey : true;
    const metaMatch = shortcut.meta ? event.metaKey : true;

    return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
  }
}
