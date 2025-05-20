import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';
/* {{#if localization}} */
import { useTranslation } from 'react-i18next';
/* {{/if}} */

/**
 * Styled Button component with theme support
 */
const StyledButton = styled.TouchableOpacity`
  background-color: ${props => props.variant === 'primary' 
    ? props.theme.colors.primary 
    : props.variant === 'secondary' 
      ? props.theme.colors.secondary 
      : props.variant === 'outline' 
        ? 'transparent' 
        : props.theme.colors.primary};
  padding: ${props => props.size === 'small' ? '8px 16px' : props.size === 'large' ? '16px 24px' : '12px 20px'};
  border-radius: ${props => props.rounded ? '50px' : '8px'};
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-width: ${props => props.variant === 'outline' ? '1px' : '0px'};
  border-color: ${props => props.variant === 'outline' ? props.theme.colors.primary : 'transparent'};
  margin: ${props => props.margin || '0px'};
`;

const ButtonText = styled.Text`
  color: ${props => props.variant === 'outline' 
    ? props.theme.colors.primary 
    : props.variant === 'primary' || props.variant === 'secondary' 
      ? props.theme.colors.buttonText 
      : props.theme.colors.text};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  font-size: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '18px' : '16px'};
  text-align: center;
`;

/**
 * Button component with theme and localization support
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Function to call on press
 * @param {string} props.variant - Button style variant (primary, secondary, outline)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.rounded - Whether to use rounded corners
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.bold - Whether to use bold text
 * @param {string} props.margin - CSS margin value
 * @param {Object} props.style - Additional styles
 * @param {Object} props.textStyle - Additional text styles
 * @returns {JSX.Element}
 */
const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  rounded = false, 
  disabled = false, 
  bold = true,
  margin,
  style,
  textStyle,
  ...props 
}) => {
  const theme = useTheme();
  /* {{#if localization}} */
  const { t } = useTranslation();
  const buttonText = title ? t(title) : '';
  /* {{else}} */
  // const buttonText = title || '';
  /* {{/if}} */

  return (
    <StyledButton 
      onPress={onPress} 
      variant={variant} 
      size={size} 
      rounded={rounded} 
      disabled={disabled}
      margin={margin}
      theme={theme}
      style={style}
      {...props}
    >
      <ButtonText 
        variant={variant} 
        size={size} 
        bold={bold}
        theme={theme}
        style={textStyle}
      >
        {buttonText}
      </ButtonText>
    </StyledButton>
  );
};

export default Button;
