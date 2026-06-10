import styled, { css } from 'styled-components';

import {
  hideText,
  normalizeButton,
  normalizeInput,
  standardButton,
} from '../../utils/styles';
import { whatsappThemeColor } from '../../utils/colors';
import { zIndex } from '../../utils/z-index';

const buttonSize = '44px';
const selectArrowWidth = '10px';
const selectArrowHeight = '5px';
const selectPadding = '0.3rem';

const inputStyles = css`
  ${normalizeInput}

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 100%;
  height: 1.8rem;
  padding: 0 0.3rem;
  background-color: #fafafa;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);

  @media (prefers-color-scheme: dark) {
    background-color: #222;
  }
`;

const MenuOpenButton = styled.button`
  ${normalizeButton}
  ${hideText}

  position: fixed;
  width: ${buttonSize};
  height: ${buttonSize};
  left: 1rem;
  bottom: 1rem;
  border-radius: 50%;
  background-color: ${whatsappThemeColor};

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 2px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    background-color: white;
    box-shadow:
      0 -5px 0 white,
      0 5px 0 white;
  }

  @media (min-width: 700px) {
    left: 2rem;
    bottom: 2rem;
  }
`;

const MenuCloseButton = styled.button`
  ${normalizeButton}
  ${hideText}

  position: absolute;
  width: ${buttonSize};
  height: ${buttonSize};
  top: 0;
  right: 0;
  background-color: transparent;
  opacity: 0.5;
  transition: opacity 0.3s ease;

  &:hover,
  &:focus {
    opacity: 1;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 20px;
    height: 2px;
    top: 50%;
    left: 50%;
    transform-origin: 50% 50%;
    background-color: black;
  }

  &::before {
    transform: translate3d(-50%, -50%, 0) rotate(45deg);
  }

  &::after {
    transform: translate3d(-50%, -50%, 0) rotate(135deg);
  }

  @media (prefers-color-scheme: dark) {
    &::before,
    &::after {
      background-color: white;
    }
  }
`;

const Overlay = styled.button<{ $isActive: boolean }>`
  ${normalizeButton}

  display: block;
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: black;
  opacity: ${props => (props.$isActive ? 0.2 : 0)};
  transition: opacity 0.3s ease;
  z-index: ${zIndex.overlay};
  ${props =>
    !props.$isActive &&
    css`
      pointer-events: none;
    `}
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  width: 280px;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: white;
  transform: translate3d(${props => (props.$isOpen ? 0 : '-100%')}, 0, 0);
  transition: transform 0.3s ease;
  z-index: ${zIndex.sidebar};

  @media (prefers-color-scheme: dark) {
    background-color: #262d31;
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: ${buttonSize};
  left: 0;
  bottom: 0;
  right: 0;
  padding: 1rem;
  border-top: 1px solid #eee;

  @media (prefers-color-scheme: dark) {
    border-color: #444;
  }
`;

const SidebarChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ToggleCheckbox = styled.input`
  --toggle-width: 44px;
  --toggle-height: 22px;
  --toggle-padding: 2px;

  appearance: none;
  margin: 0;
  display: flex;
  padding: var(--toggle-padding);
  height: var(--toggle-height);
  width: var(--toggle-width);
  background-color: #aaa;
  border-radius: var(--toggle-height);
  cursor: pointer;

  &::before {
    content: '';

    aspect-ratio: 1;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  &:checked {
    background-color: ${whatsappThemeColor};

    &::before {
      transform: translateX(
        calc(
          (var(--toggle-width) - var(--toggle-padding) * 2) -
            (var(--toggle-height) - var(--toggle-padding) * 2)
        )
      );
    }
  }
`;

const Form = styled.form`
  > * + * {
    margin-top: 1rem;
  }
`;

const Field = styled.div`
  > * + * {
    margin-top: 0.375rem;
  }
`;

const RadioField = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;

  & + & {
    margin-top: 0.5rem;
  }
`;

const Label = styled.label`
  display: block;
  opacity: 0.8;
  width: 100%;

  &:hover {
    cursor: pointer;
  }
`;

const Fieldset = styled.fieldset`
  margin: 0;
  border: 1px solid #eee;

  @media (prefers-color-scheme: dark) {
    border-color: #444;
  }

  ${Field} + ${Field} {
    margin-top: 1rem;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}

  padding: 0 calc(${selectPadding} * 2 + ${selectArrowWidth}) 0
    ${selectPadding};
  background-image:
    linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position:
    calc(100% - ${selectPadding} - ${selectArrowWidth} / 2) 60%,
    calc(100% - ${selectPadding}) 60%;
  background-size: calc(${selectArrowWidth} / 2) ${selectArrowHeight};
  background-repeat: no-repeat;

  &:disabled {
    opacity: 0.5;
  }
`;

const Submit = styled.input`
  ${normalizeInput}
  ${standardButton}
`;

const InputDescription = styled.div`
  font-size: 80%;
  opacity: 0.6;
`;

export {
  MenuOpenButton,
  MenuCloseButton,
  Overlay,
  Sidebar,
  SidebarContainer,
  SidebarChildren,
  Form,
  Field,
  Fieldset,
  InputDescription,
  Input,
  Select,
  Submit,
  RadioField,
  Label,
  ToggleCheckbox,
};

export const SearchInput = styled.input`
  ${inputStyles}
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>');
  background-position: 8px center;
  background-repeat: no-repeat;
  padding-left: 28px !important;
`;

export const ParticipantList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  padding: 6px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (prefers-color-scheme: dark) {
    background: #1a1f22;
    border-color: rgba(255, 255, 255, 0.08);
  }
`;

export const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  input {
    cursor: pointer;
  }
`;

export const ExportGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid
    ${props => (props.$variant === 'primary' ? whatsappThemeColor : '#cbd5e1')};
  background-color: ${props =>
    props.$variant === 'primary' ? whatsappThemeColor : 'white'};
  color: ${props => (props.$variant === 'primary' ? 'white' : '#475569')};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;

  &:hover {
    background-color: ${props =>
      props.$variant === 'primary' ? '#059669' : '#f8fafc'};
    color: ${props => (props.$variant === 'primary' ? 'white' : '#0f172a')};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${props =>
      props.$variant === 'primary' ? whatsappThemeColor : '#1e293b'};
    border-color: ${props =>
      props.$variant === 'primary' ? whatsappThemeColor : '#475569'};
    color: ${props => (props.$variant === 'primary' ? 'white' : '#cbd5e1')};

    &:hover {
      background-color: ${props =>
        props.$variant === 'primary' ? '#059669' : '#334155'};
      color: white;
    }
  }
`;
