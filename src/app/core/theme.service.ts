import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'intranet.theme';

/**
 * Toggles the `dark` class on <html>, which is what both the CSS custom
 * properties in styles.css and PrimeNG's `darkModeSelector` key off. One class,
 * two systems — keep the selector in app.config.ts matching this.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.initialMode());

  /** True when the user has chosen explicitly, rather than inheriting the OS setting. */
  private explicit = this.read() !== null;

  constructor() {
    effect(() => {
      const mode = this.mode();
      const root = document.documentElement;

      root.classList.toggle('dark', mode === 'dark');
      // Tells the browser which palette to use for scrollbars, form controls,
      // and autofill, which CSS variables can't reach.
      root.style.colorScheme = mode;

      if (this.explicit) {
        this.write(mode);
      }
    });

    // Follow the OS while the user hasn't expressed a preference of their own.
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (!this.explicit) {
          this.mode.set(event.matches ? 'dark' : 'light');
        }
      });
  }

  toggle(): void {
    this.explicit = true;
    this.mode.update((mode) => (mode === 'dark' ? 'light' : 'dark'));
  }

  private initialMode(): ThemeMode {
    const saved = this.read();
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /** Storage throws in private browsing on some browsers, so never let it break boot. */
  private read(): ThemeMode | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }

  private write(mode: ThemeMode): void {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Preference just won't persist. Not worth surfacing.
    }
  }
}
