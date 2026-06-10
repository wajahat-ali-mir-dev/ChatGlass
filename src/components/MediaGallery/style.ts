import styled from 'styled-components';
import { whatsappThemeColor } from '../../utils/colors';

export const GalleryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

export const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid
    ${props => (props.$isActive ? whatsappThemeColor : '#cbd5e1')};
  background-color: ${props =>
    props.$isActive ? whatsappThemeColor : 'transparent'};
  color: ${props => (props.$isActive ? 'white' : '#64748b')};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props =>
      props.$isActive ? whatsappThemeColor : '#f1f5f9'};
    color: ${props => (props.$isActive ? 'white' : '#1e293b')};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${props =>
      props.$isActive ? whatsappThemeColor : '#475569'};
    color: ${props => (props.$isActive ? 'white' : '#94a3b8')};

    &:hover {
      background-color: ${props =>
        props.$isActive ? whatsappThemeColor : '#1e293b'};
      color: ${props => (props.$isActive ? 'white' : '#e2e8f0')};
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const MediaCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }
`;

export const MediaWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
  }

  audio {
    width: 90%;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #0f172a;
  }
`;

export const MediaMeta = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
  justify-content: space-between;
`;

export const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  word-break: break-all;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.5rem;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
    border-top-color: #334155;
  }
`;

export const Sender = styled.span`
  font-weight: 600;
  color: ${whatsappThemeColor};
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyGallery = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;
