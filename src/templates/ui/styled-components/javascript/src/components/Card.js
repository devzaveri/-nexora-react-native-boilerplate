import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';

/**
 * Styled Card component with theme support
 */
const StyledCard = styled.View`
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

/**
 * Card component with theme support
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.rounded - Whether to use more rounded corners
 * @param {string} props.padding - CSS padding value
 * @param {string} props.margin - CSS margin value
 * @param {number} props.elevation - Android elevation (shadow depth)
 * @param {boolean} props.bordered - Whether to show a border
 * @param {string} props.borderColor - Border color
 * @param {string} props.width - Card width
 * @param {string} props.maxWidth - Card maximum width
 * @param {string} props.alignSelf - Align self CSS property
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element}
 */
const Card = ({ 
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
