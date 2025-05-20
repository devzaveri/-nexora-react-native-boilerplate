export interface ThemeColors {
  // Base
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  warning: string;
  info: string;
  success: string;

  // Background
  background: string;
  card: string;
  surface: string;
  dialog: string;
  
  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  caption: string;
  hint: string;
  
  // Border & Divider
  border: string;
  divider: string;
  
  // Interactive
  buttonText: string;
  buttonDisabled: string;
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  
  // Status
  statusBar: 'light-content' | 'dark-content';
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Components
  toast: string;
  toastText: string;
}

// Light theme colors
export const lightTheme: ThemeColors = {
  // Base
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#8B5CF6',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  success: '#10B981',

  // Background
  background: '#F9FAFB',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  dialog: '#FFFFFF',
  
  // Text
  text: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  caption: '#6B7280',
  hint: '#9CA3AF',
  
  // Border & Divider
  border: '#E5E7EB',
  divider: '#E5E7EB',
  
  // Interactive
  buttonText: '#FFFFFF',
  buttonDisabled: '#E5E7EB',
  inputBackground: '#F3F4F6',
  inputText: '#111827',
  inputPlaceholder: '#9CA3AF',
  
  // Status
  statusBar: 'dark-content',
  tabBar: '#FFFFFF',
  tabBarActive: '#3B82F6',
  tabBarInactive: '#6B7280',
  
  // Components
  toast: '#374151',
  toastText: '#FFFFFF',
};

// Dark theme colors
export const darkTheme: ThemeColors = {
  // Base
  primary: '#60A5FA',
  secondary: '#34D399',
  accent: '#A78BFA',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  success: '#34D399',

  // Background
  background: '#111827',
  card: '#1F2937',
  surface: '#1F2937',
  dialog: '#1F2937',
  
  // Text
  text: '#F9FAFB',
  textSecondary: '#E5E7EB',
  textTertiary: '#9CA3AF',
  textInverse: '#111827',
  caption: '#9CA3AF',
  hint: '#6B7280',
  
  // Border & Divider
  border: '#374151',
  divider: '#374151',
  
  // Interactive
  buttonText: '#F9FAFB',
  buttonDisabled: '#4B5563',
  inputBackground: '#374151',
  inputText: '#F9FAFB',
  inputPlaceholder: '#9CA3AF',
  
  // Status
  statusBar: 'light-content',
  tabBar: '#1F2937',
  tabBarActive: '#60A5FA',
  tabBarInactive: '#9CA3AF',
  
  // Components
  toast: '#F9FAFB',
  toastText: '#111827',
};

// You can add more theme variants here
export const customTheme: Partial<ThemeColors> = {
  // Define a custom theme with brand colors
};

// Typography interfaces and defaults
export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    huge: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export const typography: Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    huge: 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};
