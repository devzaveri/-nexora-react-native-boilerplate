import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../config/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  rounded?: boolean;
  shadow?: boolean;
  bordered?: boolean;
  padding?: string;
  margin?: string;
  width?: string;
  bgColor?: string;
  style?: ViewStyle;
}

/**
 * Card component with Tailwind and theme support
 */
const Card: React.FC<CardProps> = ({ 
  children,
  rounded = false,
  shadow = true,
  bordered = false,
  padding = 'p-4',
  margin = 'm-0',
  width = 'w-full',
  bgColor,
  style,
  ...props 
}) => {
  const tailwind = useTailwind();
  const theme = useTheme();

  // Determine card styles based on props
  const getCardStyles = (): string => {
    let styles = `${padding} ${margin} ${width}`;
    
    // Background color
    if (bgColor) {
      styles += ` ${bgColor}`;
    } else {
      styles += theme.dark ? ' bg-gray-800' : ' bg-white';
    }
    
    // Rounded styles
    if (rounded) {
      styles += ' rounded-xl';
    } else {
      styles += ' rounded-lg';
    }
    
    // Shadow styles
    if (shadow) {
      styles += theme.dark ? ' shadow-lg shadow-gray-900' : ' shadow-md';
    }
    
    // Border styles
    if (bordered) {
      styles += theme.dark ? ' border border-gray-700' : ' border border-gray-200';
    }
    
    return styles;
  };

  return (
    <View 
      style={[tailwind(getCardStyles()), style]}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
