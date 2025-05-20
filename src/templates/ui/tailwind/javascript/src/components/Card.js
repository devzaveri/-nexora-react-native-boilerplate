import React from 'react';
import { View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../config/theme';

/**
 * Card component with Tailwind and theme support
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.rounded - Whether to use more rounded corners
 * @param {boolean} props.shadow - Whether to show shadow
 * @param {boolean} props.bordered - Whether to show a border
 * @param {string} props.padding - Custom padding (tailwind classes)
 * @param {string} props.margin - Custom margin (tailwind classes)
 * @param {string} props.width - Custom width (tailwind classes)
 * @param {string} props.bgColor - Custom background color (tailwind classes)
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element}
 */
const Card = ({ 
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
  const getCardStyles = () => {
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
