import styled, { css } from 'styled-components';

import { whatsappThemeColor } from '../../utils/colors';
import { screenReaderOnly } from '../../utils/styles';

const labelHighlight = css`
  background-color: rgba(16, 185, 129, 0.04);
  border-color: ${whatsappThemeColor};
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);

  @media (prefers-color-scheme: dark) {
    background-color: rgba(16, 185, 129, 0.02);
  }
`;

const Label = styled.label<{ $isHighlighted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 3rem 2rem;
  border: 2px dashed #cbd5e1;
  cursor: pointer;
  background-color: white;
  transition: all 0.25s ease;
  text-align: center;
  gap: 1rem;
  ${props => props.$isHighlighted && labelHighlight}

  &:hover {
    border-color: ${whatsappThemeColor};
    background-color: rgba(16, 185, 129, 0.01);
  }

  @media (prefers-color-scheme: dark) {
    border-color: #334155;
    background-color: #1e293b;

    &:hover {
      background-color: rgba(16, 185, 129, 0.01);
      border-color: ${whatsappThemeColor};
    }
  }
`;

const P = styled.div`
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

const Extension = styled.span`
  font-family: monospace;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  display: inline-block;
  padding: 2px 6px;
  font-weight: 600;
  color: #0f172a;

  @media (prefers-color-scheme: dark) {
    background-color: #0f172a;
    border-color: #1e293b;
    color: #cbd5e1;
  }
`;

const Input = styled.input`
  ${screenReaderOnly}

  &:focus + ${Label} {
    ${labelHighlight}
  }
`;

const UploadIcon = styled.div`
  color: #10b981;
  margin-bottom: 0.5rem;
  transition: transform 0.2s ease;

  ${Label}:hover & {
    transform: translateY(-4px);
  }
`;

export { Label, P, Extension, Input, UploadIcon };
