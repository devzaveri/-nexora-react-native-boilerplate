import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../config/theme';
{{#if localization}}
import { useTranslation } from 'react-i18next';
{{/if}}

type TextVariant = 'heading' | 'subheading' | 'error' | 'success' | 'muted' | 'default';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'light' | 'normal' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

interface CustomTextProps extends TextProps {
  children?: React.ReactNode;
  i18nKey?: string;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  color?: string;
  margin?: string;
  padding?: string;
  underline?: boolean;
  italic?: boolean;
  style?: TextStyle;
}

/**
 * Text component with Tailwind and theme support
 */
const Text: React.FC<CustomTextProps> = ({ 
  children,
  i18nKey,
  variant,
  size = 'md',
  weight,
  align,
  color,
  margin,
  padding,
  underline = false,
  italic = false,
  style,
  ...props 
}) => {
  const tailwind = useTailwind();
  const theme = useTheme();
  {{#if localization}}
  const { t } = useTranslation();
  
  // If i18nKey is provided, use it for translation
  const content = i18nKey ? t(i18nKey) : children;
  {{else}}
  const content = children;
  {{/if}}

  // Determine text styles based on props
  const getTextStyles = (): string => {
    let styles = '';
    
    // Size styles
    if (size === 'xs') {
      styles += ' text-xs';
    } else if (size === 'sm') {
      styles += ' text-sm';
    } else if (size === 'md') {
      styles += ' text-base';
    } else if (size === 'lg') {
      styles += ' text-lg';
    } else if (size === 'xl') {
      styles += ' text-xl';
    } else if (size === '2xl') {
      styles += ' text-2xl';
    } else if (size === '3xl') {
      styles += ' text-3xl';
    }
    
    // Weight styles
    if (weight === 'light') {
      styles += ' font-light';
    } else if (weight === 'normal') {
      styles += ' font-normal';
    } else if (weight === 'semibold') {
      styles += ' font-semibold';
    } else if (weight === 'bold') {
      styles += ' font-bold';
    }
    
    // Alignment styles
    if (align === 'left') {
      styles += ' text-left';
    } else if (align === 'center') {
      styles += ' text-center';
    } else if (align === 'right') {
      styles += ' text-right';
    }
    
    // Variant styles
    if (variant === 'heading') {
      styles += theme.dark ? ' text-white font-bold' : ' text-gray-900 font-bold';
    } else if (variant === 'subheading') {
      styles += theme.dark ? ' text-gray-300 font-semibold' : ' text-gray-700 font-semibold';
    } else if (variant === 'error') {
      styles += ' text-red-500';
    } else if (variant === 'success') {
      styles += ' text-green-500';
    } else if (variant === 'muted') {
      styles += theme.dark ? ' text-gray-400' : ' text-gray-500';
    } else {
      styles += theme.dark ? ' text-gray-100' : ' text-gray-800';
    }
    
    // Custom color (overrides variant)
    if (color) {
      styles += ` ${color}`;
    }
    
    // Margin and padding
    if (margin) {
      styles += ` ${margin}`;
    }
    
    if (padding) {
      styles += ` ${padding}`;
    }
    
    // Text decoration
    if (underline) {
      styles += ' underline';
    }
    
    // Font style
    if (italic) {
      styles += ' italic';
    }
    
    return styles;
  };

  return (
    <RNText 
      style={[tailwind(getTextStyles()), style]}
      {...props}
    >
      {content}
    </RNText>
  );
};

export default Text;
