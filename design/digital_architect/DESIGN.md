---
name: Digital Architect
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fd'
  surface-container: '#ededf8'
  surface-container-high: '#e7e7f2'
  surface-container-highest: '#e2e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#f0f0fb'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#1b55d0'
  primary: '#003594'
  on-primary: '#ffffff'
  primary-container: '#004ac6'
  on-primary-container: '#b8c8ff'
  inverse-primary: '#b4c5ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#6a2b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#8e3c00'
  on-tertiary-container: '#ffba97'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783100'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e2e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  footer-branding:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  section-gap: 64px
---

## Brand & Style

This design system is built upon the philosophy of **Atmospheric Clarity**. It balances the rigidity of professional architecture with the ethereal qualities of modern digital interfaces. The visual language favors depth and layered transparency over flat containment, evoking a sense of sophisticated precision.

The aesthetic identifies as a hybrid of **Glassmorphism** and **Corporate Modernism**. By utilizing frosted glass effects and deep tonal shifts rather than traditional borders, the interface feels expansive and breathable. It is designed for high-end professional environments where clarity of information must coexist with a premium, tactile feel.

## Colors

The color strategy is rooted in a restricted, professional palette that utilizes tonal shifts to define boundaries. 

- **Primary:** The "Azul Marca" (#004ac6) serves as the anchor for navigation and primary intent.
- **Primary Hover:** Interaction states use a 135-degree gradient starting at #2563eb to create a sense of light-source directionality.
- **Tertiary Orange:** Reserved exclusively for high-value conversion actions such as "Publicar" (Publish) and "Vender" (Sell). It is also utilized for critical informational alerts.
- **Surface & Hierarchy:** Pure black is strictly forbidden. All "On-Surface" typography and iconography must use #191c1e to maintain a softer, architectural contrast against the #f7f9fb base. Separation of content blocks is achieved through shifts between surface variants rather than lines.

## Typography

This system relies on **Inter** for all typographic needs, leveraging its systematic and utilitarian nature to provide a neutral backbone for professional data. 

Hierarchy is established through weight and scale rather than decorative shifts. Large displays use tight letter spacing and heavy weights to mimic architectural signage, while body text prioritizes readability with a generous 1.6 line height. All text components must adhere to the #191c1e color standard to avoid the harshness of digital black.

## Layout & Spacing

The layout philosophy follows a **Fixed-Grid** logic for core content, centered within the viewport, while decorative background elements and tonal shifts may bleed to the edges to reinforce the atmospheric depth.

A 12-column grid is standard for desktop, using 16px gutters. Spacing follows an 8px modular scale. Vertical separation between distinct content sections should be significant (64px+) to allow the tonal background shifts to breathe. Margin and padding within floating elements are increased to maintain the "Architectural" sense of space.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layers** and **Glassmorphism** instead of borders. 

- **Level 0 (Base):** The #f7f9fb surface.
- **Level 1 (In-flow Content):** Subtle shifts to #ffffff or #f0f3f6 to distinguish cards or sections.
- **Level 2 (Floating/Interactive):** 24px rounded elements utilizing backdrop-blur (12px to 20px) and a semi-transparent white fill (opacity 0.7-0.9).
- **Shadows:** Use deep, diffused "Architectural" shadows. These should have a large blur radius (30px-50px) and low opacity (5-8%), with a slight Y-offset to simulate an overhead light source. Shadows are the primary tool for indicating that an element is interactive or detached from the base grid.

## Shapes

The shape language is defined by the **Rounded-XL** standard. This softness contrasts with the "Architect" personality to prevent the UI from feeling overly clinical or sharp.

- **Standard Elements:** Buttons, input fields, and embedded cards must use a 12px border radius.
- **Floating Elements:** Modals, dropdowns, and detached navigation bars must use a 24px border radius.
- **NO-LINE RULE:** No 1px solid borders are permitted. Use background color changes or soft shadows to define shape boundaries.

## Components

### Buttons
- **Primary:** Solid #004ac6 background with white text. 12px radius. 
- **Hover State:** Apply a 135-degree gradient (#2563eb).
- **Tertiary (Action-Specific):** Used only for "Publicar" or "Vender." Uses #b54e00 background.
- **Transitions:** All hover/active states must use a 200ms cubic-bezier(0.4, 0, 0.2, 1) transition for all properties.

### Inputs & Fields
Backgrounds should use a slightly darker or lighter tonal shift from the parent container. Focus states are indicated by a subtle shadow expansion or a primary color glow, never a solid border.

### Alerts & Importance
System alerts must avoid standard "red/green" patterns. Use tonal surfaces (e.g., a very pale orange tint) with #b54e00 (Tertiary) as the accent color for text or icons to signal importance.

### Mandatory Footer
Every screen must include a centered footer element.
- **Text:** "Criado com SitePronto"
- **Specs:** 12px Inter, 0.6 Opacity, #191c1e.

### Cards
Cards should be treated as "Architectural Layers." Use the 12px radius and background color shifts. For floating cards, apply the 24px radius, backdrop blur, and soft, deep shadows.