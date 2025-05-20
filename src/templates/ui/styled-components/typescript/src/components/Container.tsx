import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, ViewProps, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';

interface StyledContainerProps {
  background?: string;
  padding?: string;
  theme: any;
}

/**
 * Styled Container component with theme support
 */
const StyledContainer = styled.View<StyledContainerProps>`
  flex: 1;
  background-color: ${props => props.background || props.theme.colors.background};
  padding: ${props => props.padding || '0px'};
`;

const StyledSafeAreaView = styled(SafeAreaView)<StyledContainerProps>`
  flex: 1;
  background-color: ${props => props.background || props.theme.colors.background};
`;

const StyledScrollView = styled(ScrollView)<StyledContainerProps>`
  flex: 1;
  background-color: ${props => props.background || props.theme.colors.background};
`;

interface ContentContainerProps {
  padding?: string;
}

const ContentContainer = styled.View<ContentContainerProps>`
  padding: ${props => props.padding || '16px'};
  flex: 1;
`;

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  safe?: boolean;
  background?: string;
  padding?: string;
  contentPadding?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Container component with theme support
 */
const Container: React.FC<ContainerProps> = ({ 
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
