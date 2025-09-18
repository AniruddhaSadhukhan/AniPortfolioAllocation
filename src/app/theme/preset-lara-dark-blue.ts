import { definePreset } from "@primeng/themes";
import Lara from "@primeng/themes/lara";

// Emulate former Lara Dark Blue look by biasing primary to blue palette.
// You can fine tune further (surface, focusRing, etc.) later.
const LaraDarkBlue = definePreset(Lara, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{blue.500}",
          inverseColor: "{surface.0}",
          hoverColor: "{blue.600}",
          activeColor: "{blue.700}",
        },
      },
      dark: {
        primary: {
          color: "{blue.400}",
          inverseColor: "{surface.900}",
          hoverColor: "{blue.300}",
          activeColor: "{blue.200}",
        },
        surface: {
          0: "#ffffff",
          50: "{slate.50}",
          100: "{slate.100}",
          200: "{slate.200}",
          300: "{slate.300}",
          400: "{slate.400}",
          500: "{slate.500}",
          600: "{slate.600}",
          700: "{slate.700}",
          800: "{slate.800}",
          900: "{slate.900}",
          950: "{slate.950}",
        },
      },
    },
  },
});

export default LaraDarkBlue;
