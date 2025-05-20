import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';
/* {{#if localization}} */
import { useTranslation } from 'react-i18next';
/* {{/if}} */

/**
 * Styled Text component with theme support
 */
const StyledText = styled.Text`
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

/**
 * Text component with theme and localization support
 * 
 * @param {Object} props - Component props
 * @param {string} props.children - Text content
 * @param {string} props.i18nKey - i18n translation key
 * @param {string} props.variant - Text style variant (heading, subheading, error, success, muted)
 * @param {string} props.size - Text size (xs, sm, md, lg, xl, 2xl, 3xl)
 * @param {string} props.weight - Font weight (light, normal, semibold, bold)
 * @param {string} props.align - Text alignment (left, center, right)
 * @param {string} props.color - Text color (overrides variant)
 * @param {string} props.margin - CSS margin value
 * @param {string} props.padding - CSS padding value
 * @param {boolean} props.underline - Whether to underline text
 * @param {string} props.underlineColor - Color of underline
 * @param {boolean} props.italic - Whether to use italic style
 * @param {number} props.opacity - Text opacity
 * @param {string} props.letterSpacing - Letter spacing
 * @param {string|number} props.lineHeight - Line height
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element}
 */
const Text = ({ 
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
  /* {{#if localization}} */
  const { t } = useTranslation();
  
  // If i18nKey is provided, use it for translation
  const content = i18nKey ? t(i18nKey) : children;
  /* {{else}} */
  // const content = children;
  /* {{/if}} */

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
