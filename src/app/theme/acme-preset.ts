import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/**
 * Overrides Aura's palette rather than replacing the preset, so every PrimeNG
 * component inherits the project's colors with no per-component CSS.
 *
 * Deep navy with a mid-blue accent. The surface ramp is navy-tinted rather than
 * neutral grey so light and dark modes read as the same product — a neutral grey
 * ramp next to blue chrome looks like two themes bolted together.
 *
 * Both colorSchemes get the same ramp direction (0 lightest, 950 darkest).
 * PrimeNG's dark tokens reference the high indices for backgrounds, which is why
 * the ramp isn't reversed for dark.
 */
export const AcmePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef4fb',
      100: '#d6e5f6',
      200: '#aecaec',
      300: '#7fabdf',
      400: '#528dd0',
      500: '#2f6fbb',
      600: '#1f5698',
      700: '#1a467b',
      800: '#163a64',
      900: '#122e4f',
      950: '#0c1f36',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f5f7fa',
          100: '#e9eef5',
          200: '#d5dde8',
          300: '#b6c4d5',
          400: '#8aa0ba',
          500: '#63748a',
          600: '#4a5a70',
          700: '#37475c',
          800: '#233447',
          900: '#152433',
          950: '#0c1824',
        },
        primary: {
          color: '#1f5698',
          contrastColor: '#ffffff',
          hoverColor: '#1a467b',
          activeColor: '#163a64',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f5f7fa',
          100: '#e9eef5',
          200: '#d5dde8',
          300: '#b6c4d5',
          400: '#8aa0ba',
          500: '#63748a',
          600: '#4a5a70',
          700: '#37475c',
          800: '#233447',
          900: '#152433',
          950: '#0c1824',
        },
        primary: {
          // Lighter on dark so the accent carries against a navy background.
          color: '#7fabdf',
          contrastColor: '#0c1824',
          hoverColor: '#aecaec',
          activeColor: '#d6e5f6',
        },
      },
    },
  },
});
