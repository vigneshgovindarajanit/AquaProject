---
name: Luminous Ecological Portal
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd8e5'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ecf9'
  surface-container-high: '#ebe6f4'
  surface-container-highest: '#e5e0ee'
  on-surface: '#1c1a24'
  on-surface-variant: '#484555'
  inverse-surface: '#312f39'
  inverse-on-surface: '#f4eefc'
  outline: '#787587'
  outline-variant: '#c9c4d8'
  surface-tint: '#5c3de4'
  primary: '#4a25d3'
  on-primary: '#ffffff'
  primary-container: '#6346eb'
  on-primary-container: '#e6dfff'
  inverse-primary: '#c8bfff'
  secondary: '#3f4ec8'
  on-secondary: '#ffffff'
  secondary-container: '#5968e2'
  on-secondary-container: '#fffbff'
  tertiary: '#813800'
  on-tertiary: '#ffffff'
  tertiary-container: '#a64a00'
  on-tertiary-container: '#ffdccb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5deff'
  primary-fixed-dim: '#c8bfff'
  on-primary-fixed: '#190064'
  on-primary-fixed-variant: '#4318cc'
  secondary-fixed: '#dfe0ff'
  secondary-fixed-dim: '#bcc2ff'
  on-secondary-fixed: '#000a64'
  on-secondary-fixed-variant: '#2636b2'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#fdf8ff'
  on-background: '#1c1a24'
  surface-variant: '#e5e0ee'
  status-success: '#28a745'
  status-info: '#007bff'
  status-warning: '#fd7e14'
  status-danger: '#dc3545'
  surface-muted: '#f8f9fa'
  surface-accent: '#f0edff'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.04em
  tabular-nums:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system evolves from a traditional corporate aesthetic into a **Modern Tech-Forward** identity. It leverages high-contrast white surfaces and a vibrant purple primary to signal innovation, while maintaining its core mission of environmental insight. The aesthetic balances scientific precision with a cutting-edge software feel.

The interface utilizes a "Luminous Digital" style:
- **Cleanliness:** Pure white surfaces and high-contrast typography ensure maximum readability for complex ecological data.
- **Vibrancy:** The use of a tech-forward purple provides a distinct visual signature that differentiates the tool from traditional, earthy environmental platforms.
- **Tech-Forward:** Borrowing from modern SaaS patterns—including soft shadows and rounded geometry—to make professional data management feel fluid and intuitive.
- **Tone:** Optimistic, precise, and visionary.

## Colors

The palette transitions from organic earth tones to a high-energy, digital-first spectrum.

- **Primary:** A vibrant Purple (#6346eb) serves as the primary driver for interaction, focus states, and branding. It represents the "intelligence" layer atop the environmental data.
- **Secondary:** A deeper Indigo-blue provides support for interactive elements like "Assign" actions or secondary navigation highlights, ensuring visual variety without clashing with the primary purple.
- **Neutral:** The system relies on pure whites (#FFFFFF) and very light cool grays (#F8F9FA) for surfaces to maintain a sense of airy, modern space.
- **Semantic Accents:** Status colors (Green, Blue, Orange, Red) are retained for ecological health indicators but are adjusted to a higher saturation to match the intensity of the new purple primary.

## Typography

The Manrope typeface remains the foundation, chosen for its geometric balance and technical clarity.

- **Scale:** High contrast is maintained between large, bold display titles and functional body text.
- **Technical Readability:** For environmental metrics and sensor readings, use the `tabular-nums` setting to ensure data aligns perfectly in dashboards and tables.
- **Visual Weight:** Use Semibold (600) for sub-headers and labels to maintain a crisp look against the white background.

## Layout & Spacing

The layout utilizes a **12-column fixed-width grid** (max 1440px) on desktop to provide a centered, organized workspace, transitioning to a fluid layout for mobile devices.

- **Spacing Rhythm:** Adhere to an 8px spatial grid. Content containers use 24px (md) padding as a standard to ensure data has room to breathe.
- **Sidebar:** A fixed-width navigation sidebar (260px) anchors the application, utilizing a clean, light surface with subtle vertical dividers.
- **Grid density:** Use the `sm` (12px) spacing unit for grouping related inputs or metadata within cards to keep information dense but legible.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and **Tonal Layers**, moving away from flat borders to a more soft, dimensional aesthetic.

- **Base Layer:** The application background is a light, neutral gray (#F0F2F5).
- **Surface Layer:** KPI cards and data containers use pure white (#FFFFFF) with a very soft, multi-layered shadow (0px 4px 20px rgba(0, 0, 0, 0.05)).
- **Interactive State:** Buttons and active cards gain a more pronounced shadow on hover to simulate physical lift.
- **Depth Hierarchy:** Use subtle background blurs (10-15px) for modal backdrops to maintain context while focusing the user's attention.

## Shapes

The shape language is **Rounded** (0.5rem / 8px base radius), creating a friendly, modern interface that softens the "cold" nature of scientific data.

- **Primary Components:** Buttons, search fields, and tags use the 8px base radius.
- **Large Containers:** Dashboard cards and data tables use `rounded-lg` (1rem / 16px) to define major layout areas.
- **Pill Accents:** Use "full" rounding (9999px) for status badges (e.g., "Active", "Warning") and secondary buttons to differentiate them from primary structural elements.

## Components

### Buttons
- **Primary:** Solid Vibrant Purple (#6346eb) with white text. High contrast and highly visible.
- **Secondary:** Outlined Purple or solid Indigo for alternative actions like "Export" or "Cancel."
- **Action Group:** Segmented controls for switching between map views and data views.

### Data & KPI Cards
- **Header:** Features a small, colored icon representing the metric type (e.g., a purple "faculty" icon or a blue "water" icon).
- **Progress Bars:** Use a subtle, light-purple track with a high-saturation purple fill for "Workload" or "Resource Usage" metrics.

### Navigation Sidebar
- **Active State:** The active menu item uses a solid purple background with white text and an 8px corner radius, ensuring the user's location is unmistakable.
- **Logo Area:** High-contrast placement of the portal name in Manrope Bold.

### Form Inputs
- **Style:** Light gray background (#F8F9FA) with no border in the rest state, gaining a 2px purple border and a soft glow when focused.
- **Placeholders:** Muted cool-gray text to maintain the clean aesthetic.

### Status Badges
- **Design:** Solid color backgrounds (Success Green, Danger Red) with white text, utilizing a pill shape for maximum distinctness from other UI elements.