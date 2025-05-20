import React from 'react';
import { TextProps as RNTextProps, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';
{{#if localization}}
import { useTranslation } from 'react-i18next';
{{/if}}

type TextVariant = 'heading' | 'subheading' | 'error' | 'success' | 'muted' | 'default';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'light' | 'normal' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface StyledTextProps {
  variant?: TextVariant;
  size: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  color?: string;
  margin?: string;
  padding?: string;
  underline: boolean;
  underlineColor?: string;
  italic: boolean;
  opacity?: number;
  letterSpacing?: string;
  lineHeight?: string | number;
  theme: any;
}

/**
 * Styled Text component with theme support
 */
const StyledText = styled.Text<StyledTextProps>`
  color: ${props => 
    props.variant === 'heading' 
      ? props.theme.colors.heading 
      : props.variant === 'subheading' 
        ? props.theme.colors.subheading 
        : props.variant === 'error' 
          ? props.theme.colors.error
          : props.variant === 'success'
            ? props.theme.colors.success
            : props.variant === 'muted'
              ? props.theme.colors.textMuted
              : props.color || props.theme.colors.text};
  font-size: ${props => 
    props.size === 'xs' 
      ? '12px' 
      : props.size === 'sm' 
        ? '14px' 
        : props.size === 'lg' 
          ? '18px' 
          : props.size === 'xl' 
            ? '20px' 
            : props.size === '2xl' 
              ? '24px' 
              : props.size === '3xl' 
                ? '30px' 
                : '16px'};
  font-weight: ${props => 
    props.weight === 'bold' 
      ? 'bold' 
      : props.weight === 'semibold' 
        ? '600' 
        : props.weight === 'light' 
          ? '300' 
          : 'normal'};
  text-align: ${props => props.align || 'left'};
  margin: ${props => props.margin || '0px'};
  padding: ${props => props.padding || '0px'};
  text-decoration: ${props => props.underline ? 'underline' : 'none'};
  text-decoration-color: ${props => props.underlineColor || props.theme.colors.text};
  font-style: ${props => props.italic ? 'italic' : 'normal'};
  opacity: ${props => props.opacity || 1};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
  line-height: ${props => props.lineHeight || 'normal'};
`;

interface TextProps extends RNTextProps {
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
  underlineColor?: string;
  italic?: boolean;
  opacity?: number;
  letterSpacing?: string;
  lineHeight?: string | number;
  style?: TextStyle;
}

/**
 * Text component with theme and localization support
 */
const Text: React.FC<TextProps> = ({ 
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
  underlineColor,
  italic = false,
  opacity,
  letterSpacing,
  lineHeight,
  style,
  ...props 
}) => {
  const theme = useTheme();
  {{#if localization}}
  const { t } = useTranslation();
  
  // If i18nKey is provided, use it for translation
  const content = i18nKey ? t(i18nKey) : children;
  {{else}}
  const content = children;
  {{/if}}

  return (
    <StyledText 
      variant={variant}
      size={size}
      weight={weight}
      align={align}
      color={color}
      margin={margin}
      padding={padding}
      underline={underline}
      underlineColor={underlineColor}
      italic={italic}
      opacity={opacity}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      theme={theme}
      style={style}
      {...props}
    >
      {content}
    </StyledText>
  );
};

export default Text;
