import styled, { createGlobalStyle } from 'styled-components';

import { whatsappThemeColor } from './utils/colors';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;

  @media (prefers-color-scheme: dark) {
    background-color: #0f172a;
    color: #f1f5f9;
  }
`;

const Header = styled.header`
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;

  @media (prefers-color-scheme: dark) {
    background: rgba(15, 23, 42, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  > *:first-child {
    flex: 1 1 auto;
  }

  @media (max-width: 699px) {
    flex-direction: column;
    padding: 1rem;

    > * + * {
      margin-top: 0.75rem;
    }
  }

  @media (min-width: 700px) {
    > * + * {
      margin-left: 1.5rem;
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-sizing: border-box;
    scroll-behavior: smooth;
    
    @media (prefers-color-scheme: dark) {
      color-scheme: dark;
    }
  }

  body {
    margin: 0;
    background-color: #f8fafc;
    color: #1e293b;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #0f172a;
      color: #cbd5e1;
    }
    ::-webkit-scrollbar-thumb {
      background: #334155;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
  }

  a {
    text-decoration: none;
    color: ${whatsappThemeColor};
    transition: color 0.2s ease;
    
    &:hover {
      color: #059669;
    }
  }

  img,
  video,
  audio {
    max-width: 100%;
    border-radius: 8px;
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  @media print {
    video, audio, ${Header}, .menu-open-button {
      display: none !important;
    }
  }
`;

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  gap: 3rem;
  min-height: calc(100vh - 80px);
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    gap: 2rem;
  }
`;

const Hero = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const TitleGradient = styled.h1`
  font-size: 3.5rem;
  margin: 0;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;

  @media (max-width: 600px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0;
  line-height: 1.6;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

const LogoWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ActionArea = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DemoButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
  }
`;

const PrivacyShield = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: rgba(16, 185, 129, 0.05);
  border: 1px dashed rgba(16, 185, 129, 0.2);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #047857;
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }

  @media (prefers-color-scheme: dark) {
    color: #34d399;
    background-color: rgba(16, 185, 129, 0.03);
    border-color: rgba(16, 185, 129, 0.15);
  }
`;

const LandingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const LandingCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(16, 185, 129, 0.2);
  }

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.02);
  }
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
`;

const CardText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

const NavbarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BrandText = styled.span`
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TabNav = styled.div`
  display: flex;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 9999px;
  gap: 4px;

  @media (prefers-color-scheme: dark) {
    background-color: #1e293b;
  }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: none;
  background-color: ${props => (props.$isActive ? 'white' : 'transparent')};
  color: ${props => (props.$isActive ? '#0f172a' : '#64748b')};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => (props.$isActive ? '#0f172a' : '#1e293b')};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${props => (props.$isActive ? '#334155' : 'transparent')};
    color: ${props => (props.$isActive ? 'white' : '#94a3b8')};

    &:hover {
      color: ${props => (props.$isActive ? 'white' : '#cbd5e1')};
    }
  }
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: white;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1e293b;
    border-color: #475569;
    color: #cbd5e1;

    &:hover {
      background-color: #334155;
      color: white;
      border-color: #64748b;
    }
  }
`;

const FileBadge = styled.div`
  font-size: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (prefers-color-scheme: dark) {
    background: rgba(16, 185, 129, 0.05);
    color: #34d399;
  }
`;

export {
  GlobalStyles,
  Container,
  Header,
  LandingContainer,
  Hero,
  TitleGradient,
  Subtitle,
  LogoWrapper,
  ActionArea,
  DemoButton,
  PrivacyShield,
  LandingGrid,
  LandingCard,
  CardIcon,
  CardTitle,
  CardText,
  NavbarBrand,
  BrandText,
  TabNav,
  TabButton,
  ResetButton,
  FileBadge,
};
