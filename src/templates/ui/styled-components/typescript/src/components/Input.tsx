import React, { useState } from 'react';
import { View, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../config/theme';
{{#if localization}}
import { useTranslation } from 'react-i18next';
{{/if}}
import Text from './Text';

type InputSize = 'small' | 'medium' | 'large';

interface StyledInputProps {
  size: InputSize;
  error: boolean;
  focused: boolean;
  width?: string;
  margin?: string;
  theme: any;
}

/**
 * Styled TextInput component with theme support
 */
const StyledInput = styled.TextInput<StyledInputProps>`
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.size === 'small' ? '8px 12px' : props.size === 'large' ? '16px 20px' : '12px 16px'};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => 
    props.error 
      ? props.theme.colors.error 
      : props.focused 
        ? props.theme.colors.primary 
        : props.theme.colors.border};
  font-size: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '18px' : '16px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0px'};
`;

interface InputContainerProps {
  width?: string;
  margin?: string;
}

const InputContainer = styled.View<InputContainerProps>`
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0px'};
`;

const LabelContainer = styled.View`
  margin-bottom: 6px;
`;

const ErrorContainer = styled.View`
  margin-top: 4px;
`;

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  size?: InputSize;
  width?: string;
  margin?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  style?: ViewStyle;
}

/**
 * Input component with theme and localization support
 */
const Input: React.FC<InputProps> = ({ 
  label,
  placeholder,
  value,
  onChangeText,
  size = 'medium',
  width,
  margin,
  error,
  secureTextEntry,
  keyboardType,
  style,
  ...props 
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  
  {{#if localization}}
  const { t } = useTranslation();
  const translatedLabel = label ? t(label) : '';
  const translatedPlaceholder = placeholder ? t(placeholder) : '';
  const translatedError = error ? t(error) : '';
  {{else}}
  const translatedLabel = label || '';
  const translatedPlaceholder = placeholder || '';
  const translatedError = error || '';
  {{/if}}

  return (
    <InputContainer width={width} margin={margin}>
      {label && (
        <LabelContainer>
          <Text 
            size="sm" 
            weight="semibold"
            color={theme.colors.text}
          >
            {translatedLabel}
          </Text>
        </LabelContainer>
      )}
      
      <StyledInput 
        placeholder={translatedPlaceholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        size={size}
        error={!!error}
        focused={focused}
        theme={theme}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={style as TextStyle}
        {...props}
      />
      
      {error && (
        <ErrorContainer>
          <Text 
            size="xs" 
            color={theme.colors.error}
          >
            {translatedError}
          </Text>
        </ErrorContainer>
      )}
    </InputContainer>
  );
};

export default Input;
