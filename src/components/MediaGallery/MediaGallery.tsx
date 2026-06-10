import { useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { messagesAtom } from '../../stores/global';
import Attachment from '../Attachment/Attachment';
import * as S from './style';

type FilterType = 'all' | 'image' | 'video' | 'audio';

function MediaGallery() {
  const messages = useAtomValue(messagesAtom);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter messages with attachments
  const attachmentMessages = useMemo(() => {
    return messages.filter(m => m.attachment !== undefined);
  }, [messages]);

  // Categorize attachment messages
  const filteredMessages = useMemo(() => {
    return attachmentMessages.filter(m => {
      const fileName = m.attachment?.fileName.toLowerCase() || '';
      const isImg = /\.(jpe?g|png|gif|webp|svg)$/.test(fileName);
      const isVid = /\.(mp4|webm)$/.test(fileName);
      const isAud = /\.(mp3|m4a|wav|opus)$/.test(fileName);

      if (activeFilter === 'image') return isImg;
      if (activeFilter === 'video') return isVid;
      if (activeFilter === 'audio') return isAud;
      return true; // 'all'
    });
  }, [attachmentMessages, activeFilter]);

  const counts = useMemo(() => {
    let images = 0;
    let videos = 0;
    let audios = 0;

    attachmentMessages.forEach(m => {
      const fileName = m.attachment?.fileName.toLowerCase() || '';
      if (/\.(jpe?g|png|gif|webp|svg)$/.test(fileName)) images += 1;
      else if (/\.(mp4|webm)$/.test(fileName)) videos += 1;
      else if (/\.(mp3|m4a|wav|opus)$/.test(fileName)) audios += 1;
    });

    return {
      all: attachmentMessages.length,
      image: images,
      video: videos,
      audio: audios,
    };
  }, [attachmentMessages]);

  return (
    <S.GalleryContainer>
      <S.Title>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#10b981' }}
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          <rect width="8" height="6" x="6" y="9" rx="1" />
          <path d="M18 12h.01" />
          <path d="M15 15h.01" />
        </svg>
        Media Attachment Gallery
      </S.Title>

      <S.FilterBar>
        <S.FilterButton
          $isActive={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All ({counts.all})
        </S.FilterButton>
        <S.FilterButton
          $isActive={activeFilter === 'image'}
          onClick={() => setActiveFilter('image')}
        >
          Images ({counts.image})
        </S.FilterButton>
        <S.FilterButton
          $isActive={activeFilter === 'video'}
          onClick={() => setActiveFilter('video')}
        >
          Videos ({counts.video})
        </S.FilterButton>
        <S.FilterButton
          $isActive={activeFilter === 'audio'}
          onClick={() => setActiveFilter('audio')}
        >
          Audio ({counts.audio})
        </S.FilterButton>
      </S.FilterBar>

      {filteredMessages.length === 0 ? (
        <S.EmptyGallery>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.4 }}
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <h3>No media items found</h3>
          <p>
            This filter or conversation doesn&apos;t contain any matching media
            attachments.
          </p>
        </S.EmptyGallery>
      ) : (
        <S.Grid>
          {filteredMessages.map(m => {
            const fileName = m.attachment?.fileName || 'unnamed-file';
            return (
              <S.MediaCard key={m.index}>
                <S.MediaWrapper>
                  <Attachment fileName={fileName} />
                </S.MediaWrapper>
                <S.MediaMeta>
                  <S.FileName title={fileName}>{fileName}</S.FileName>
                  <S.CardFooter>
                    <S.Sender>{m.author || 'System'}</S.Sender>
                    <span>
                      {new Intl.DateTimeFormat('default', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(m.date)}
                    </span>
                  </S.CardFooter>
                </S.MediaMeta>
              </S.MediaCard>
            );
          })}
        </S.Grid>
      )}
    </S.GalleryContainer>
  );
}

export default MediaGallery;
