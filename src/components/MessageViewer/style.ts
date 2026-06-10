import styled from 'styled-components';

import {
  whatsappThemeColor,
  viewerBackgroundColor,
  viewerDarkBackgroundColor,
} from '../../utils/colors';
import { messageBaseStyle } from '../../utils/styles';

import bgImage from '../../img/bg.png';
import bgDarkImage from '../../img/bg-dark.png';

const Container = styled.div`
  flex-grow: 1;
  padding: 0 1rem;
  background-color: ${viewerBackgroundColor};
  background-image: url(${bgImage});
  background-attachment: fixed;

  @media (min-width: 700px) {
    padding: 0 10%;
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${viewerDarkBackgroundColor};
    background-image: url(${bgDarkImage});
  }
`;

const List = styled.ul`
  padding: 0;
  list-style: none;
`;

const P = styled.p`
  text-align: center;
`;

const Info = styled.span`
  ${messageBaseStyle}

  text-align: center;
  background-color: ${whatsappThemeColor};
  color: white;
`;

export { Container, List, P, Info };

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  margin: 1.5rem 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 41, 59, 0.9);
    border-color: rgba(255, 255, 255, 0.05);
  }
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: white;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1e293b;
    border-color: #475569;
    color: #cbd5e1;

    &:hover:not(:disabled) {
      background-color: #334155;
      color: white;
      border-color: #64748b;
    }
  }
`;

export const PaginationSelect = styled.select`
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: white;
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    background-color: #1e293b;
    border-color: #475569;
    color: #f1f5f9;
  }
`;

export const PageIndicator = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }
`;
