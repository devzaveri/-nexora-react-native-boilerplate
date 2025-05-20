import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../config/theme';
{{#if localization}}
import { useTranslation } from 'react-i18next';
{{/if}}

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  disabled?: boolean;
  bold?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Button component with Tailwind and theme support
 */
const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  rounded = false, 
  disabled = false, 
  bold = true,
  style,
  textStyle,
  ...props 
}) => {
  const tailwind = useTailwind();
  const theme = useTheme();
  {{#if localization}}
  const { t } = useTranslation();
  const buttonText = title ? t(title) : '';
  {{else}}
  const buttonText = title || '';
  {{/if}}

  // Determine button styles based on props
  const getButtonStyles = (): string => {
    let styles = 'items-center justify-center';
    
    // Size styles
    if (size === 'small') {
      styles += ' py-2 px-4';
    } else if (size === 'large') {
      styles += ' py-4 px-6';
    } else {
      styles += ' py-3 px-5';
    }
    
    // Rounded styles
    if (rounded) {
      styles += ' rounded-full';
    } else {
      styles += ' rounded-lg';
    }
    
    // Variant styles
    if (variant === 'primary') {
      styles += theme.dark 
        ? ' bg-blue-600 active:bg-blue-700' 
        : ' bg-blue-500 active:bg-blue-600';
    } else if (variant === 'secondary') {
      styles += theme.dark 
        ? ' bg-gray-600 active:bg-gray-700' 
        : ' bg-gray-500 active:bg-gray-600';
    } else if (variant === 'outline') {
      styles += theme.dark 
        ? ' bg-transparent border border-blue-600' 
        : ' bg-transparent border border-blue-500';
    }
    
    // Disabled styles
    if (disabled) {
      styles += ' opacity-60';
    }
    
    return styles;
  };
  
  // Determine text styles based on props
  const getTextStyles = (): string => {
    let styles = 'text-center';
    
    // Size styles
    if (size === 'small') {
      styles += ' text-sm';
    } else if (size === 'large') {
      styles += ' text-lg';
    } else {
      styles += ' text-base';
    }
    
    // Weight styles
    if (bold) {
      styles += ' font-bold';
    }
    
    // Variant styles
    if (variant === 'outline') {
      styles += theme.dark ? ' text-blue-600' : ' text-blue-500';
    } else {
      styles += ' text-white';
    }
    
    return styles;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[tailwind(getButtonStyles()), style]}
      {...props}
    >
      <Text style={[tailwind(getTextStyles()), textStyle]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
