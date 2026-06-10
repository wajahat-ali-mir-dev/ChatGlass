import React, { useMemo, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import Message from '../Message/Message';
import * as S from './style';
import {
  activeUserAtom,
  messagesAtom,
  participantsAtom,
  searchQueryAtom,
  selectedParticipantsAtom,
  pageAtom,
} from '../../stores/global';

import { authorColors } from '../../utils/colors';
import {
  datesAtom,
  globalFilterModeAtom,
  limitsAtom,
} from '../../stores/filters';
import { filterMessagesByDate, getISODateString } from '../../utils/utils';

function MessageViewer() {
  const limits = useAtomValue(limitsAtom);
  const [activeUser, setActiveUser] = useAtom(activeUserAtom);
  const participants = useAtomValue(participantsAtom);
  const messages = useAtomValue(messagesAtom);
  const filterMode = useAtomValue(globalFilterModeAtom);
  const { start: startDate, end: endDate } = useAtomValue(datesAtom);

  // Search & Filter Atoms
  const searchQuery = useAtomValue(searchQueryAtom);
  const selectedParticipants = useAtomValue(selectedParticipantsAtom);
  const [page, setPage] = useAtom(pageAtom);

  const endDatePlusOne = useMemo(() => {
    const d = new Date(endDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [endDate]);

  const colorMap: Record<string, string> = useMemo(
    () =>
      participants.reduce(
        (obj, participant, i) => ({
          ...obj,
          [participant]: authorColors[i % authorColors.length],
        }),
        {},
      ),
    [participants],
  );

  // 1. Baseline range filtering (Index limit or Date limit)
  const baseFilteredMessages = useMemo(() => {
    return filterMode === 'index'
      ? messages.slice(limits.low - 1, limits.high)
      : filterMessagesByDate(messages, startDate, endDatePlusOne);
  }, [messages, filterMode, limits, startDate, endDatePlusOne]);

  // 2. Extra filtering (Keyword search & Participant filters)
  const fullyFilteredMessages = useMemo(() => {
    return baseFilteredMessages.filter(m => {
      // Senders Checklist
      if (selectedParticipants.length > 0 && m.author) {
        if (!selectedParticipants.includes(m.author)) return false;
      }
      // Keyword search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const msgContent = (m.message || '').toLowerCase();
        const authorName = (m.author || '').toLowerCase();
        if (!msgContent.includes(query) && !authorName.includes(query))
          return false;
      }
      return true;
    });
  }, [baseFilteredMessages, selectedParticipants, searchQuery]);

  // 3. Paginate
  const pageSize = 500;
  const maxPage = Math.max(
    1,
    Math.ceil(fullyFilteredMessages.length / pageSize),
  );

  useEffect(() => {
    if (page > maxPage) {
      setPage(1);
    }
  }, [fullyFilteredMessages.length, maxPage, page, setPage]);

  const renderedMessages = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return fullyFilteredMessages.slice(startIndex, startIndex + pageSize);
  }, [fullyFilteredMessages, page, pageSize]);

  const isLimited = baseFilteredMessages.length !== messages.length;
  const isSearchOrFilterActive =
    searchQuery.trim() !== '' || selectedParticipants.length > 0;

  useEffect(() => {
    setActiveUser(participants[0] || '');
  }, [setActiveUser, participants]);

  const paginationControls = maxPage > 1 && (
    <S.PaginationWrapper>
      <S.PaginationButton
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Prev
      </S.PaginationButton>

      <S.PageIndicator>
        Page {page} of {maxPage} (
        {fullyFilteredMessages.length.toLocaleString()} messages)
      </S.PageIndicator>

      <S.PaginationButton
        disabled={page === maxPage}
        onClick={() => setPage(p => Math.min(maxPage, p + 1))}
      >
        Next
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </S.PaginationButton>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Jump:</span>
        <S.PaginationSelect
          value={page}
          onChange={e => setPage(parseInt(e.target.value, 10))}
        >
          {Array.from({ length: maxPage }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              Page {index + 1}
            </option>
          ))}
        </S.PaginationSelect>
      </div>
    </S.PaginationWrapper>
  );

  return (
    <S.Container>
      {messages.length > 0 && (
        <S.P>
          <S.Info>
            {isSearchOrFilterActive && (
              <span>
                Found {fullyFilteredMessages.length} matching messages (Page{' '}
                {page} of {maxPage})
              </span>
            )}
            {!isSearchOrFilterActive && isLimited && filterMode === 'index' && (
              <span>
                Showing messages {limits.low} to{' '}
                {Math.min(limits.high, messages.length)} (
                {renderedMessages.length} out of {messages.length})
              </span>
            )}
            {!isSearchOrFilterActive && isLimited && filterMode === 'date' && (
              <span>
                Showing messages from {getISODateString(startDate)} to{' '}
                {getISODateString(endDate)}
              </span>
            )}
            {!isSearchOrFilterActive && !isLimited && (
              <span>Showing all {messages.length} messages</span>
            )}
          </S.Info>
        </S.P>
      )}

      {paginationControls}

      <S.List>
        {renderedMessages.map((message, i, arr) => {
          const prevMessage = arr[i - 1];

          return (
            <Message
              key={message.index}
              message={message}
              color={colorMap[message.author || '']}
              isActiveUser={activeUser === message.author}
              sameAuthorAsPrevious={
                prevMessage && prevMessage.author === message.author
              }
            />
          );
        })}
      </S.List>

      {paginationControls}
    </S.Container>
  );
}

export default React.memo(MessageViewer);
