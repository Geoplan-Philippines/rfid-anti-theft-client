import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Instrument-Panel preset. Overrides Aura so nothing reads as the stock theme:
 * - primary becomes our cerulean (500 = #007db5), mapped to the deep step for
 *   white-on-fill contrast (>= 4.5:1);
 * - surfaces become the cool-neutral ramp from DESIGN.md (borders = hairline,
 *   text = ink);
 * - form controls get the 4px (sm) radius and a 2px cerulean focus ring;
 * - dark mode is disabled (light only) at the provider level.
 */
export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e2f9ff',
      100: '#c8eeff',
      200: '#9cdbfd',
      300: '#68c3f2',
      400: '#22a2d8',
      500: '#007db5',
      600: '#00649b',
      700: '#00568a',
      800: '#004471',
      900: '#003154',
      950: '#001e39',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    formField: {
      borderRadius: '{border.radius.sm}',
      focusRing: {
        width: '2px',
        style: 'solid',
        color: '{primary.color}',
        offset: '2px',
        shadow: 'none',
      },
    },
    content: {
      borderRadius: '{border.radius.md}',
    },
    overlay: {
      modal: {
        borderRadius: '{border.radius.lg}',
      },
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
        surface: {
          0: 'oklch(1 0 0)',
          50: 'oklch(0.985 0.005 233)',
          100: 'oklch(0.97 0.006 233)',
          200: 'oklch(0.922 0.006 233)',
          300: 'oklch(0.86 0.008 233)',
          400: 'oklch(0.78 0.01 233)',
          500: 'oklch(0.62 0.012 240)',
          600: 'oklch(0.50 0.015 245)',
          700: 'oklch(0.41 0.015 245)',
          800: 'oklch(0.30 0.018 245)',
          900: 'oklch(0.255 0.015 245)',
          950: 'oklch(0.205 0.02 245)',
        },
      },
    },
  },
});
