import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
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
    gap: 1.5rem;
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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;

export const StatCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }
`;

export const StatIcon = styled.div<{ $bg: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$bg};
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Outfit', sans-serif;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const ChartCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  color: #1e293b;
  font-weight: 600;

  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem 0;
`;

export const TableCard = styled(ChartCard)`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Th = styled.th`
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
    border-bottom-color: #334155;
  }
`;

export const Td = styled.td`
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
    border-bottom-color: #1e293b;
  }
`;

export const ParticipantRow = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8fafc;
  }
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: #1e293b;
    }
  }
`;

export const Badge = styled.span<{ $color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  margin-right: 8px;
`;

export const SubTabNav = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
  width: fit-content;
  margin-top: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.04);

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.04);
  }
`;

export const SubTabButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: none;
  background-color: ${props => (props.$isActive ? 'white' : 'transparent')};
  color: ${props => (props.$isActive ? '#10b981' : '#64748b')};
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  &:hover {
    color: ${props => (props.$isActive ? '#10b981' : '#1e293b')};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${props => (props.$isActive ? '#334155' : 'transparent')};
    color: ${props => (props.$isActive ? '#34d399' : '#94a3b8')};

    &:hover {
      color: ${props => (props.$isActive ? '#34d399' : '#cbd5e1')};
    }
  }
`;

export const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

export const ArchetypeContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }
`;

export const ArchetypeCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

export const Avatar = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  font-family: 'Outfit', sans-serif;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ProfileName = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const ArchetypeBadge = styled.span`
  font-size: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 700;
  width: fit-content;

  @media (prefers-color-scheme: dark) {
    background: rgba(52, 211, 153, 0.1);
    color: #34d399;
  }
`;

export const ArchetypeDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }
`;

export const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

export const MetricLabel = styled.span`
  color: #64748b;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const MetricValue = styled.span`
  color: #0f172a;
  font-weight: 700;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const PredictionGauge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  gap: 1rem;
`;

export const GaugeValue = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
  font-family: 'Outfit', sans-serif;
  text-align: center;
`;

export const PredictionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  text-align: center;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const DossierSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
  width: fit-content;

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SelectorLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }
`;

export const StyledSelect = styled.select`
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  border: 1.5px solid #cbd5e1;
  background-color: white;
  color: #1e293b;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;

  &:hover {
    border-color: #10b981;
  }

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #0f172a;
    border-color: #334155;
    color: #f8fafc;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");

    &:hover {
      border-color: #34d399;
    }

    &:focus {
      border-color: #34d399;
      box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15);
    }
  }
`;

export const DossierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const DossierMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
`;

export const DossierTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  font-family: 'Outfit', sans-serif;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const BadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const ChronotypeBadge = styled.span`
  font-size: 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  padding: 3px 10px;
  border-radius: 9999px;
  font-weight: 700;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (prefers-color-scheme: dark) {
    background: rgba(129, 140, 248, 0.1);
    color: #818cf8;
  }
`;

export const SentimentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const SentimentTextRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const SentimentVal = styled.span<{ $polarity: number }>`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => {
    if (props.$polarity > 20) return '#10b981';
    if (props.$polarity < -20) return '#f43f5e';
    return '#64748b';
  }};
  font-family: 'Outfit', sans-serif;
`;

export const SentimentSlider = styled.div`
  position: relative;
  height: 8px;
  background: linear-gradient(90deg, #f43f5e 0%, #e2e8f0 50%, #10b981 100%);
  border-radius: 4px;
  margin: 1.25rem 0;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(90deg, #f43f5e 0%, #334155 50%, #34d399 100%);
  }
`;

export const SentimentSliderThumb = styled.div<{ $val: number }>`
  position: absolute;
  top: 50%;
  left: ${props => `calc(${50 + props.$val / 2}%)`};
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background: white;
  border: 3px solid #1e293b;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: left 0.3s cubic-bezier(0.1, 0.8, 0.3, 1);

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
    border-color: #cbd5e1;
  }
`;

export const SentimentLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin-top: -4px;
`;

export const EmotionalBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmotionBarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const EmotionBarInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const EmotionBarLabel = styled.span`
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }
`;

export const EmotionBarValue = styled.span`
  color: #1e293b;
  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const EmotionBarTrack = styled.div`
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
  }
`;

export const EmotionBarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${props => `${props.$pct}%`};
  background-color: ${props => props.$color};
  border-radius: 4px;
  transition: width 0.4s ease-out;
`;

export const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1rem;
`;

export const HabitCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
    border-color: rgba(255, 255, 255, 0.02);
  }
`;

export const HabitValue = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  font-family: 'Outfit', sans-serif;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const HabitLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const RapportGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const RapportCard = styled.div<{ $border: string }>`
  background: #f8fafc;
  border-radius: 14px;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.$border};
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
  }
`;

export const RapportValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const RapportLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const RapportDetail = styled.span`
  font-size: 0.8rem;
  color: #475569;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }
`;

export const PersonaCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.04);
  }
`;

export const PersonaTitle = styled.h4`
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Outfit', sans-serif;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

export const PersonaDesc = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.6;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }
`;

export const QuirksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-top: 0.5rem;
`;

export const QuirkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.02);

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
    border-color: rgba(255, 255, 255, 0.02);
  }
`;

export const QuirkIcon = styled.div<{ $bg: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

export const QuirkMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const QuirkLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const QuirkVal = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;

  @media (prefers-color-scheme: dark) {
    color: #f8fafc;
  }
`;

/* ── Trends & Network Tab Components ── */

export const EngagementRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
    border-color: rgba(255, 255, 255, 0.03);
  }
`;

export const EngagementRank = styled.span<{ $color: string }>`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${props => props.$color};
  font-family: 'Outfit', sans-serif;
  min-width: 2.5rem;
  text-align: center;
`;

export const TierBadge = styled.span<{ $color: string }>`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${props => props.$color};
  background: ${props => `${props.$color}1a`};
  border: 1px solid ${props => `${props.$color}44`};
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
`;

export const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
`;

export const EmojiCard = styled.div<{ $rank: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: ${props => props.$rank === 0 ? 'rgba(245,158,11,0.08)' : '#f8fafc'};
  border: 1px solid ${props => props.$rank === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(0,0,0,0.03)'};
  border-radius: 14px;
  gap: 0.25rem;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => props.$rank === 0 ? 'rgba(245,158,11,0.1)' : '#0f172a'};
    border-color: ${props => props.$rank === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.03)'};
  }
`;

export const EmojiGlyph = styled.span`
  font-size: 1.75rem;
  line-height: 1;
`;

export const EmojiCount = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  font-family: 'Outfit', sans-serif;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const GhostPeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.03);

  @media (prefers-color-scheme: dark) {
    background: #0f172a;
    border-color: rgba(255, 255, 255, 0.03);
  }
`;

export const GhostRank = styled.span`
  font-size: 1.1rem;
  font-weight: 900;
  color: #94a3b8;
  font-family: 'Outfit', sans-serif;
  min-width: 2rem;
  text-align: center;
`;

export const LengthBar = styled.div`
  display: flex;
  width: 100%;
  height: 18px;
  border-radius: 9px;
  overflow: hidden;
  gap: 1px;
`;

export const LengthSegment = styled.div<{ $pct: number; $color: string }>`
  width: ${props => `${props.$pct}%`};
  height: 100%;
  background-color: ${props => props.$color};
  transition: width 0.5s ease-out;

  &:first-child {
    border-radius: 9px 0 0 9px;
  }
  &:last-child {
    border-radius: 0 9px 9px 0;
  }
`;
