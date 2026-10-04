import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/**
 * Overrides Aura's palette rather than replacing the preset wholesale, so every
 * PrimeNG component inherits the project's colors without per-component CSS.
 *
 * Two deliberate choices:
 *  - Primary is a deep wayfinding green, not the default blue. It reads as
 *    signage rather than SaaS, and holds up on the washed-out monitors that
 *    intranets actually get viewed on.
 *  - Surfaces are blue-grey, not neutral. Against a green accent that keeps the
 *    whole thing from going monotone.
 */
export const AcmePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#ecf8f2',
      100: '#d1efe1',
      200: '#a5dfc6',
      300: '#70c9a5',
      400: '#3fad84',
      500: '#1a8c66',
      600: '#0b6e4f',
      700: '#0a5840',
      800: '#0b4634',
      900: '#0a3a2c',
      950: '#04211a',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d9dde4',
          300: '#bcc3ce',
          400: '#8d97a6',
          500: '#697484',
          600: '#4e5866',
          700: '#3a4350',
          800: '#28303a',
          900: '#171d25',
          950: '#0d1117',
        },
        primary: {
          color: '#0b6e4f',
          contrastColor: '#ffffff',
          hoverColor: '#0a5840',
          activeColor: '#0b4634',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d9dde4',
          300: '#bcc3ce',
          400: '#8d97a6',
          500: '#697484',
          600: '#4e5866',
          700: '#3a4350',
          800: '#28303a',
          900: '#171d25',
          950: '#0d1117',
        },
        primary: {
          color: '#3fad84',
          contrastColor: '#0d1117',
          hoverColor: '#70c9a5',
          activeColor: '#a5dfc6',
        },
      },
    },
  },
});
