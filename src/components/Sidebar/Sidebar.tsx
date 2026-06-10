import { useRef, useEffect, useState, startTransition } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import FilterModeSelector from '../FilterModeSelector/FilterModeSelector';
import FilterMessageLimitsForm from '../FilterMessageLimitsForm/FilterMessageLimitsForm';
import FilterMessageDatesForm from '../FilterMessageDatesForm/FilterMessageDatesForm';
import ActiveUserSelector from '../ActiveUserSelector/ActiveUserSelector';

import * as S from './style';
import {
  activeUserAtom,
  isAnonymousAtom,
  isMenuOpenAtom,
  messagesDateBoundsAtom,
  participantsAtom,
  searchQueryAtom,
  selectedParticipantsAtom,
  fileNameAtom,
  messagesAtom,
} from '../../stores/global';
import {
  datesAtom,
  globalFilterModeAtom,
  limitsAtom,
} from '../../stores/filters';
import { FilterMode } from '../../types';

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom);
  const [isAnonymous, setIsAnonymous] = useAtom(isAnonymousAtom);
  const [filterMode, setFilterMode] = useState<FilterMode>('index');
  const setGlobalFilterMode = useSetAtom(globalFilterModeAtom);
  const [limits, setLimits] = useAtom(limitsAtom);
  const setDates = useSetAtom(datesAtom);
  const messagesDateBounds = useAtomValue(messagesDateBoundsAtom);
  const participants = useAtomValue(participantsAtom);
  const [activeUser, setActiveUser] = useAtom(activeUserAtom);

  // Search & Participant filter atoms
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedParticipants, setSelectedParticipants] = useAtom(
    selectedParticipantsAtom,
  );
  const messages = useAtomValue(messagesAtom);
  const fileName = useAtomValue(fileNameAtom);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const setMessageLimits = (e: React.FormEvent<HTMLFormElement>) => {
    const entries = Object.fromEntries(new FormData(e.currentTarget));

    e.preventDefault();
    setLimits({
      low: parseInt(entries.lowerLimit as string, 10),
      high: parseInt(entries.upperLimit as string, 10),
    });
    setGlobalFilterMode('index');
  };

  const setMessagesByDate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDates({
      start: e.currentTarget.startDate.valueAsDate,
      end: e.currentTarget.endDate.valueAsDate,
    });
    setGlobalFilterMode('date');
  };

  const toggleParticipantFilter = (name: string) => {
    setSelectedParticipants(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name],
    );
  };

  // Export handlers
  const exportJSON = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(messages, null, 2),
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `chat_export_${fileName || 'chat'}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['Index', 'Date', 'Author', 'Message', 'Attachment'];
    const rows = messages.map(m => [
      m.index + 1,
      m.date.toISOString(),
      m.author || 'System',
      (m.message || '').replace(/"/g, '""'),
      m.attachment ? m.attachment.fileName : '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chat_export_${fileName || 'chat'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportMarkdown = () => {
    const header = `# Chat Log: ${fileName || 'Export'}\n\n`;
    const body = messages
      .map(m => {
        const dateStr = new Intl.DateTimeFormat('default', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(m.date);
        const author = m.author || 'System';
        let msg = '';
        if (m.message) {
          msg = m.message.replace(/\n/g, ' ');
        } else if (m.attachment) {
          msg = `[Media: ${m.attachment.fileName}]`;
        }
        return `* **[${dateStr}] ${author}**: ${msg}`;
      })
      .join('\n');

    const blob = new Blob([header + body], {
      type: 'text/markdown;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chat_export_${fileName || 'chat'}.md`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const printPDF = () => {
    window.print();
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', keyDownHandler);
    return () => document.removeEventListener('keydown', keyDownHandler);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) closeButtonRef.current?.focus();
    else openButtonRef.current?.focus();
  }, [isMenuOpen]);

  return (
    <>
      <S.MenuOpenButton
        className="menu-open-button"
        type="button"
        onClick={() => setIsMenuOpen(true)}
        ref={openButtonRef}
      >
        Open menu
      </S.MenuOpenButton>
      <S.Overlay
        type="button"
        $isActive={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        tabIndex={-1}
      />
      <S.Sidebar $isOpen={isMenuOpen}>
        <S.MenuCloseButton
          type="button"
          onClick={() => setIsMenuOpen(false)}
          ref={closeButtonRef}
        >
          Close menu
        </S.MenuCloseButton>
        <S.SidebarContainer style={{ overflowY: 'auto' }}>
          <S.SidebarChildren>
            {/* Search Input */}
            <S.Field>
              <S.Label htmlFor="search-messages">Search Messages</S.Label>
              <S.SearchInput
                id="search-messages"
                type="text"
                placeholder="Keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </S.Field>

            {/* Active Bubble User */}
            <ActiveUserSelector
              participants={participants}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />

            {/* Filter by Participants */}
            {participants.length > 0 && (
              <S.Field>
                <S.Label>Filter Senders</S.Label>
                <S.ParticipantList>
                  {participants.map(p => (
                    <S.CheckboxField key={p}>
                      <input
                        type="checkbox"
                        id={`filter-${p}`}
                        checked={selectedParticipants.includes(p)}
                        onChange={() => toggleParticipantFilter(p)}
                      />
                      <label htmlFor={`filter-${p}`}>{p}</label>
                    </S.CheckboxField>
                  ))}
                </S.ParticipantList>
              </S.Field>
            )}

            {/* Range / Date Selectors */}
            <FilterModeSelector
              filterMode={filterMode}
              setFilterMode={setFilterMode}
            />
            {filterMode === 'index' && (
              <FilterMessageLimitsForm
                limits={limits}
                setMessageLimits={setMessageLimits}
              />
            )}
            {filterMode === 'date' && (
              <FilterMessageDatesForm
                messagesDateBounds={messagesDateBounds}
                setMessagesByDate={setMessagesByDate}
              />
            )}

            {/* Anonymizer */}
            <S.Field>
              <S.Label htmlFor="is-anonymous">Anonymize users</S.Label>
              <S.ToggleCheckbox
                id="is-anonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={() =>
                  startTransition(() => setIsAnonymous(bool => !bool))
                }
              />
            </S.Field>

            {/* Export options */}
            <S.Field>
              <S.Label>Export & Printing</S.Label>
              <S.ExportGroup>
                <S.ActionButton onClick={exportJSON}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Export JSON
                </S.ActionButton>
                <S.ActionButton onClick={exportCSV}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Export CSV
                </S.ActionButton>
                <S.ActionButton onClick={exportMarkdown}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Export Markdown
                </S.ActionButton>
                <S.ActionButton onClick={printPDF}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect width="12" height="8" x="6" y="14" />
                  </svg>
                  Print PDF
                </S.ActionButton>
              </S.ExportGroup>
            </S.Field>
          </S.SidebarChildren>

          {/* Footer branding */}
          <div
            style={{
              marginTop: '2rem',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              paddingTop: '1rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}
            >
              ChatGlass v1.0.0
              <br />
              Secure Offline Visualizer
            </span>
          </div>
        </S.SidebarContainer>
      </S.Sidebar>
    </>
  );
}

export default Sidebar;
