import { Suspense } from 'react';
import LinkifyLib from 'react-linkify';
import { useAtomValue } from 'jotai';

import Attachment from '../Attachment/Attachment';
import Poll from '../Poll/Poll';
import * as S from './style';
import { IndexedMessage } from '../../types';
import { parsePollMessage } from '../../utils/poll-parser';
import { searchQueryAtom } from '../../stores/global';

function Link(
  decoratedHref: string,
  decoratedText: string,
  key: number,
): React.ReactNode | undefined {
  return (
    <a key={key} target="_blank" rel="noopener noreferrer" href={decoratedHref}>
      {decoratedText}
    </a>
  );
}

interface IMessage {
  message: IndexedMessage;
  color: string;
  isActiveUser: boolean;
  sameAuthorAsPrevious: boolean;
}

function Message({
  message,
  color,
  isActiveUser,
  sameAuthorAsPrevious,
}: IMessage) {
  const isSystem = !message.author;
  const dateTime = message.date.toISOString().slice(0, 19).replace('T', ' ');
  const pollData = parsePollMessage(message.message ?? '');
  const searchQuery = useAtomValue(searchQueryAtom);

  // react-linkify ships as CJS; Vite may wrap it as { default: Fn } — resolve safely
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Linkify = (LinkifyLib as any).default ?? LinkifyLib;

  const highlightText = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(
      new RegExp(
        `(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`,
        'gi',
      ),
    );
    let count = 0;
    return (
      <>
        {parts.map(part => {
          count += 1;
          if (part.toLowerCase() === query.toLowerCase()) {
            return (
              <mark
                key={`match-${count}-${part}`}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0 2px',
                  borderRadius: '2px',
                }}
              >
                {part}
              </mark>
            );
          }
          return <span key={`text-${count}-${part}`}>{part}</span>;
        })}
      </>
    );
  };

  let messageComponent = (
    <Linkify componentDecorator={Link}>
      <S.Message>{highlightText(message.message ?? '', searchQuery)}</S.Message>
    </Linkify>
  );

  if (message.attachment) {
    messageComponent = (
      <Suspense fallback={`Loading ${message.attachment.fileName}...`}>
        <Attachment fileName={message.attachment.fileName} />
      </Suspense>
    );
  } else if (pollData !== null) {
    messageComponent = <Poll pollData={pollData} />;
  }

  return (
    <S.Item
      $isSystem={isSystem}
      $isActiveUser={isActiveUser}
      $sameAuthorAsPrevious={sameAuthorAsPrevious}
    >
      <S.Bubble $isSystem={isSystem} $isActiveUser={isActiveUser}>
        <S.Index $isSystem={isSystem} $isActiveUser={isActiveUser}>
          {(message.index + 1).toLocaleString('de-CH')}
        </S.Index>
        <S.Wrapper>
          {!isSystem && !sameAuthorAsPrevious && (
            <S.Author color={color}>{message.author}</S.Author>
          )}
          {messageComponent}
        </S.Wrapper>
        {!isSystem && (
          <S.Date dateTime={dateTime}>
            {new Intl.DateTimeFormat('default', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }).format(message.date)}
          </S.Date>
        )}
      </S.Bubble>
    </S.Item>
  );
}

export default Message;
