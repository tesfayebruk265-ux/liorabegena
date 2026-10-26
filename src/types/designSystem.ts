/**
 * Liora Begena School Design System - Type Definitions
 * Phase 0 Design Foundation
 */

export interface ColorToken {
  name: string;
  token: string;
  value: string;
  usage: string;
  category: 'primary' | 'secondary' | 'background' | 'text' | 'semantic' | 'cultural';
}

export interface TypographyToken {
  name: string;
  tag: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: string;
  usage: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  pixels: number;
  tailwindClass: string;
  usage: string;
}

export interface GridToken {
  device: 'Mobile' | 'Tablet' | 'Desktop' | 'Wide Desktop';
  breakpoint: string;
  columns: number;
  gutter: string;
  gutterPx: number;
  pageMargin: string;
  marginPx: number;
  maxContainerWidth: string;
  usage: string;
}

export interface ContainerToken {
  name: string;
  maxWidth: string;
  pixels: number;
  padding: string;
  usage: string;
}

export interface RadiusToken {
  name: string;
  value: string;
  usage: string;
}

export interface ShadowToken {
  name: string;
  value: string;
  usage: string;
}

export interface BreakpointToken {
  name: string;
  value: string;
  usage: string;
}

export interface RoleToken {
  name: string;
  description: string;
  primaryDashboard: string;
}

