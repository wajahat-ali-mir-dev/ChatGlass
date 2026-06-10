import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { showError } from './utils/utils';
import {
  rawFileAtom,
  messagesAtom,
  activeTabAtom,
  fileNameAtom,
} from './stores/global';
import Dropzone from './components/Dropzone/Dropzone';
import MessageViewer from './components/MessageViewer/MessageViewer';
import Sidebar from './components/Sidebar/Sidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';
import MediaGallery from './components/MediaGallery/MediaGallery';
import * as S from './style';

import exampleChat from './assets/whatsapp-chat-parser-example.zip';

function App() {
  const messages = useAtomValue(messagesAtom);
  const setRawFile = useSetAtom(rawFileAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [fileName, setFileName] = useAtom(fileNameAtom);

  const processFile = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.addEventListener('loadend', e => {
      if (e.target) {
        setRawFile(e.target.result);
      }
    });

    if (/^application\/(?:x-)?zip(?:-compressed)?$/.test(file.type)) {
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      showError(`File type ${file.type} not supported`);
    }
  };

  const loadDemoChat = async () => {
    try {
      const response = await fetch(exampleChat);
      const blob = await response.blob();
      const file = new File([blob], 'whatsapp-chat-parser-example.zip', {
        type: 'application/zip',
      });
      processFile(file);
    } catch (err) {
      showError('Failed to load demo chat file', err as Error);
    }
  };

  const resetChat = () => {
    setRawFile(null);
    setFileName('');
    setActiveTab('chat');
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) =>
      document.documentElement.classList.toggle('ctrl-down', e.ctrlKey);

    document.addEventListener('keydown', keyHandler);
    document.addEventListener('keyup', keyHandler);

    return () => {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup', keyHandler);
    };
  }, []);

  const logoSVG = (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient
          id="logoGrad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C8.268 2 2 8.268 2 16c0 2.894.876 5.58 2.373 7.828L2.09 29.91a1 1 0 0 0 1.258 1.258l6.082-2.283A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"
        fill="url(#logoGrad)"
      />
      <path
        d="M11 13h10M11 17h7"
        stroke="white"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
      <S.GlobalStyles />
      <S.Container>
        {messages.length === 0 ? (
          <S.LandingContainer>
            <S.Hero>
              <S.LogoWrapper>{logoSVG}</S.LogoWrapper>
              <S.TitleGradient>ChatGlass</S.TitleGradient>
              <S.Subtitle>
                Analyze, visualize, and search through your WhatsApp
                conversations with ease. Premium formatting and analytics
                entirely in your browser.
              </S.Subtitle>
            </S.Hero>

            <S.ActionArea>
              <Dropzone onFileUpload={processFile} id="dropzone" />
              <S.PrivacyShield>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                100% Secure & Client-Side. Your chats never leave your device.
              </S.PrivacyShield>
              <S.DemoButton onClick={loadDemoChat}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Explore a Demo Conversation
              </S.DemoButton>
            </S.ActionArea>

            <S.LandingGrid>
              <S.LandingCard>
                <S.CardIcon>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 16V8M12 16V12M17 16v-6" />
                  </svg>
                </S.CardIcon>
                <S.CardTitle>Rich Analytics</S.CardTitle>
                <S.CardText>
                  Discover who talks the most, busiest hours of the day, weekly
                  patterns, average message sizes, and shared media files.
                </S.CardText>
              </S.LandingCard>

              <S.LandingCard>
                <S.CardIcon>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </S.CardIcon>
                <S.CardTitle>Attachment Gallery</S.CardTitle>
                <S.CardText>
                  Browse all images, play voice notes and audio clips, and view
                  videos directly in a dedicated visual grid.
                </S.CardText>
              </S.LandingCard>

              <S.LandingCard>
                <S.CardIcon>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </S.CardIcon>
                <S.CardTitle>Keyword Search</S.CardTitle>
                <S.CardText>
                  Instantly locate specific messages, filter by dates, or filter
                  by senders across thousands of messages.
                </S.CardText>
              </S.LandingCard>
            </S.LandingGrid>
          </S.LandingContainer>
        ) : (
          <>
            <S.Header>
              <S.NavbarBrand>
                {logoSVG}
                <S.BrandText>ChatGlass</S.BrandText>
                {fileName && (
                  <S.FileBadge>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {fileName}
                  </S.FileBadge>
                )}
              </S.NavbarBrand>
              <S.TabNav>
                <S.TabButton
                  $isActive={activeTab === 'chat'}
                  onClick={() => setActiveTab('chat')}
                >
                  💬 Chat Thread
                </S.TabButton>
                <S.TabButton
                  $isActive={activeTab === 'analytics'}
                  onClick={() => setActiveTab('analytics')}
                >
                  📊 Analytics
                </S.TabButton>
                <S.TabButton
                  $isActive={activeTab === 'gallery'}
                  onClick={() => setActiveTab('gallery')}
                >
                  📎 Media Gallery
                </S.TabButton>
              </S.TabNav>
              <S.ResetButton onClick={resetChat}>Upload New Chat</S.ResetButton>
            </S.Header>

            {activeTab === 'chat' && (
              <>
                <MessageViewer />
                <Sidebar />
              </>
            )}

            {activeTab === 'analytics' && <AnalyticsDashboard />}

            {activeTab === 'gallery' && <MediaGallery />}
          </>
        )}
      </S.Container>
    </>
  );
}

export default App;
