export type ThemeId = 'cocina' | 'claro' | 'oscuro' | 'sonic' | 'gatos';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  description: string;
  /** Ícono del logo en la barra lateral */
  icon: string;
  /** Usa la paleta de gráficas para fondo oscuro */
  dark: boolean;
  /** Colores para la vista previa: fondo, tarjeta, acento, barra lateral */
  preview: [string, string, string, string];
}

export const THEMES: ThemeDef[] = [
  {
    id: 'cocina',
    name: 'Cocina',
    description: 'El original: naranjas cálidos de cocina',
    icon: 'skillet',
    dark: false,
    preview: ['#f6f4f1', '#fffefc', '#ea580c', '#fffefc'],
  },
  {
    id: 'claro',
    name: 'Tonos blancos',
    description: 'Blanco limpio y grises suaves, mínimo y luminoso',
    icon: 'light_mode',
    dark: false,
    preview: ['#ffffff', '#fafafa', '#5f6b7a', '#ffffff'],
  },
  {
    id: 'oscuro',
    name: 'Tonos oscuros',
    description: 'Fondo oscuro que descansa la vista de noche',
    icon: 'dark_mode',
    dark: true,
    preview: ['#0f0f0e', '#1a1a19', '#f59e0b', '#141413'],
  },
  {
    id: 'sonic',
    name: 'Sonic',
    description: 'Azul veloz, anillos dorados y líneas de velocidad',
    icon: 'bolt',
    dark: false,
    preview: ['#e6f0ff', '#ffffff', '#ffc400', '#0b3fbf'],
  },
  {
    id: 'gatos',
    name: 'Gatos',
    description: 'Pasteles suaves con huellitas de gato',
    icon: 'pets',
    dark: false,
    preview: ['#fff6f0', '#fffdfb', '#e07a9a', '#fde9e1'],
  },
];

export const DEFAULT_THEME: ThemeId = 'cocina';
