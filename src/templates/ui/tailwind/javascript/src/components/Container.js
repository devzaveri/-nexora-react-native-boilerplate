import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../config/theme';

/**
 * Container component with Tailwind and theme support
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {boolean} props.scroll - Whether to make content scrollable
 * @param {boolean} props.safe - Whether to use SafeAreaView
 * @param {string} props.bgColor - Custom background color (tailwind classes)
 * @param {string} props.padding - Custom padding (tailwind classes)
 * @param {string} props.contentPadding - Custom content padding (tailwind classes)
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.contentStyle - Additional styles for the content
 * @returns {JSX.Element}
 */
const Container = ({ 
  children,
  scroll = false,
  safe = true,
  bgColor,
  padding,
  contentPadding = 'p-4',
  style,
  contentStyle,
  ...props 
}) => {
  const tailwind = useTailwind();
  const theme = useTheme();
  
  // Determine status bar style based on theme
  const barStyle = theme.dark ? 'light-content' : 'dark-content';
  
  // Determine container styles based on props
  const getContainerStyles = () => {
    let styles = 'flex-1';
    
    // Background color
    if (bgColor) {
      styles += ` ${bgColor}`;
    } else {
      styles += theme.dark ? ' bg-gray-900' : ' bg-gray-50';
    }
    
    // Padding
    if (padding) {
      styles += ` ${padding}`;
    }
    
    return styles;
  };
  
  // Determine content styles
  const getContentStyles = () => {
    let styles = 'flex-1';
    
    if (contentPadding) {
      styles += ` ${contentPadding}`;
    }
    
    return styles;
  };
  
  // Render content with or without padding
  const renderContent = () => {
    if (contentPadding || contentStyle) {
      return (
        <View style={[tailwind(getContentStyles()), contentStyle]}>
          {children}
        </View>
      );
    }
    return children;
  };
  
  // Render with scroll capability if needed
  const renderScrollable = () => {
    if (scroll) {
      return (
        <ScrollView 
          style={tailwind('flex-1')}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {renderContent()}
        </ScrollView>
      );
    }
    
    return renderContent();
  };
  
  // Use SafeAreaView if requested
  if (safe) {
    return (
      <SafeAreaView style={tailwind(getContainerStyles())}>
        <StatusBar barStyle={barStyle} backgroundColor={theme.dark ? '#1a202c' : '#f9fafb'} />
        <View 
          style={[tailwind(getContainerStyles()), style]}
          {...props}
        >
          {renderScrollable()}
        </View>
      </SafeAreaView>
    );
  }
  
  // Regular container without SafeAreaView
  return (
    <View 
      style={[tailwind(getContainerStyles()), style]}
      {...props}
    >
      <StatusBar barStyle={barStyle} backgroundColor={theme.dark ? '#1a202c' : '#f9fafb'} />
      {renderScrollable()}
    </View>
  );
};

export default Container;
