import React from 'react';
import { ViewProps, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';

interface StyledCardProps {
  rounded: boolean;
  padding?: string;
  margin?: string;
  elevation?: number;
  bordered: boolean;
  borderColor?: string;
  width?: string;
  maxWidth?: string;
  alignSelf?: string;
  theme: any;
}

/**
 * Styled Card component with theme support
 */
const StyledCard = styled.View<StyledCardProps>`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.rounded ? '16px' : '8px'};
  padding: ${props => props.padding || '16px'};
  margin: ${props => props.margin || '0px'};
  shadow-color: ${props => props.theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: ${props => props.elevation || 2};
  border-width: ${props => props.bordered ? '1px' : '0px'};
  border-color: ${props => props.borderColor || props.theme.colors.border};
  width: ${props => props.width || 'auto'};
  max-width: ${props => props.maxWidth || '100%'};
  align-self: ${props => props.alignSelf || 'auto'};
`;

interface CardProps extends ViewProps {
  children: React.ReactNode;
  rounded?: boolean;
  padding?: string;
  margin?: string;
  elevation?: number;
  bordered?: boolean;
  borderColor?: string;
  width?: string;
  maxWidth?: string;
  alignSelf?: string;
  style?: ViewStyle;
}

/**
 * Card component with theme support
 */
const Card: React.FC<CardProps> = ({ 
  children,
  rounded = false,
  padding,
  margin,
  elevation,
  bordered = false,
  borderColor,
  width,
  maxWidth,
  alignSelf,
  style,
  ...props 
}) => {
  const theme = useTheme();

  return (
    <StyledCard 
      rounded={rounded}
      padding={padding}
      margin={margin}
      elevation={elevation}
      bordered={bordered}
      borderColor={borderColor}
      width={width}
      maxWidth={maxWidth}
      alignSelf={alignSelf}
      theme={theme}
      style={style}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
