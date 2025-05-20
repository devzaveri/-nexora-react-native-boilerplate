import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';

/**
 * Styled Container component with theme support
 */
const StyledContainer = styled.View`
  flex: 1;
  background-color: ${props => props.background || props.theme.colors.background};
  padding: ${props => props.padding || '0px'};
`;

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.background || props.theme.colors.background};
`;

const StyledScrollView = styled(ScrollView)`
  flex: 1;
  background-color: ${props => props.background || props.theme.colors.background};
`;

const ContentContainer = styled.View`
  padding: ${props => props.padding || '16px'};
  flex: 1;
`;

/**
 * Container component with theme support
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {boolean} props.scroll - Whether to make content scrollable
 * @param {boolean} props.safe - Whether to use SafeAreaView
 * @param {string} props.background - Background color
 * @param {string} props.padding - CSS padding value for the container
 * @param {string} props.contentPadding - CSS padding value for the content
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.contentStyle - Additional styles for the content
 * @returns {JSX.Element}
 */
const Container = ({ 
  children,
  scroll = false,
  safe = true,
  background,
  padding,
  contentPadding,
  style,
  contentStyle,
  ...props 
}) => {
  const theme = useTheme();
  
  // Determine status bar style based on theme
  const barStyle = theme.dark ? 'light-content' : 'dark-content';
  
  // Render content with or without padding
  const renderContent = () => {
    if (contentPadding !== undefined || contentStyle) {
      return (
        <ContentContainer padding={contentPadding} style={contentStyle}>
          {children}
        </ContentContainer>
      );
    }
    return children;
  };
  
  // Render with scroll capability if needed
  const renderScrollable = () => {
    if (scroll) {
      return (
        <StyledScrollView 
          background={background}
          theme={theme}
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {renderContent()}
        </StyledScrollView>
      );
    }
    
    return renderContent();
  };
  
  // Use SafeAreaView if requested
  if (safe) {
    return (
      <StyledSafeAreaView background={background} theme={theme}>
        <StatusBar barStyle={barStyle} backgroundColor={background || theme.colors.background} />
        <StyledContainer 
          background={background}
          padding={padding}
          theme={theme}
          style={style}
          {...props}
        >
          {renderScrollable()}
        </StyledContainer>
      </StyledSafeAreaView>
    );
  }
  
  // Regular container without SafeAreaView
  return (
    <StyledContainer 
      background={background}
      padding={padding}
      theme={theme}
      style={style}
      {...props}
    >
      <StatusBar barStyle={barStyle} backgroundColor={background || theme.colors.background} />
      {renderScrollable()}
    </StyledContainer>
  );
};

export default Container;
