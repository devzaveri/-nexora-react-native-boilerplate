import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, ViewProps, ViewStyle } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../config/theme';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  safe?: boolean;
  bgColor?: string;
  padding?: string;
  contentPadding?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Container component with Tailwind and theme support
 */
const Container: React.FC<ContainerProps> = ({ 
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
  const getContainerStyles = (): string => {
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
  const getContentStyles = (): string => {
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
