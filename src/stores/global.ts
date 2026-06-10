import { atom } from 'jotai';
import { unwrap } from 'jotai/utils';

import {
  extractFile,
  extractStartEndDatesFromMessages,
  messagesFromFile,
  participantsFromMessages,
} from '../utils/utils';

const isMenuOpenAtom = atom(false);
const activeUserAtom = atom('');
const isAnonymousAtom = atom(false);
const rawFileAtom = atom<FileReader['result']>(null);
const fileNameAtom = atom<string>('');

const extractedFileAtom = unwrap(
  atom(async get => {
    const rawFile = get(rawFileAtom);
    return extractFile(rawFile);
  }),
  prev => prev ?? null,
);

const messagesAtom = unwrap(
  atom(async get => {
    const file = get(extractedFileAtom);
    return messagesFromFile(file, get(isAnonymousAtom));
  }),
  prev => prev ?? [],
);

const participantsAtom = atom(get =>
  participantsFromMessages(get(messagesAtom)),
);

const messagesDateBoundsAtom = atom(get =>
  extractStartEndDatesFromMessages(get(messagesAtom)),
);

// New UI & Dashboard States
const activeTabAtom = atom<'chat' | 'analytics' | 'gallery'>('chat');
const searchQueryAtom = atom<string>('');
const selectedParticipantsAtom = atom<string[]>([]);
const mediaFilterAtom = atom<'all' | 'image' | 'video' | 'audio'>('all');
const pageAtom = atom<number>(1);

export {
  isMenuOpenAtom,
  activeUserAtom,
  isAnonymousAtom,
  rawFileAtom,
  fileNameAtom,
  messagesAtom,
  participantsAtom,
  extractedFileAtom,
  messagesDateBoundsAtom,
  activeTabAtom,
  searchQueryAtom,
  selectedParticipantsAtom,
  mediaFilterAtom,
  pageAtom,
};
