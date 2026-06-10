import { useState, useRef, useEffect } from 'react';

import * as S from './style';

const preventDefaults = (e: React.DragEvent<HTMLFormElement>) => {
  e.preventDefault();
  e.stopPropagation();
};

interface IDropzone {
  id: string;
  onFileUpload: (e: File) => void;
}

function Dropzone({ id, onFileUpload }: IDropzone) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragEnterOverHandler = (e: React.DragEvent<HTMLFormElement>) => {
    preventDefaults(e);
    setIsHighlighted(true);
  };

  const onDragLeaveHandler = (e: React.DragEvent<HTMLFormElement>) => {
    preventDefaults(e);
    setIsHighlighted(false);
  };

  const onDropHandler = (e: React.DragEvent<HTMLFormElement>) => {
    preventDefaults(e);
    setIsHighlighted(false);
    onFileUpload(e.dataTransfer.files[0]);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files[0]);
    }
  };

  useEffect(() => {
    // setTimeout to steal the focus from MenuOpenButton (only on first render)
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  return (
    <form
      onDragEnter={onDragEnterOverHandler}
      onDragOver={onDragEnterOverHandler}
      onDragLeave={onDragLeaveHandler}
      onDrop={onDropHandler}
    >
      <S.Input
        id={id}
        type="file"
        accept="text/plain, application/zip"
        ref={inputRef}
        onChange={onChangeHandler}
      />
      <S.Label htmlFor={id} $isHighlighted={isHighlighted}>
        <S.UploadIcon>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </S.UploadIcon>
        <S.P>
          <strong>Click to upload</strong> or drag & drop your WhatsApp chat
          file here
          <br />
          <span
            style={{
              fontSize: '0.85rem',
              opacity: 0.8,
              display: 'block',
              marginTop: '0.5rem',
            }}
          >
            Supported formats: <S.Extension>txt</S.Extension> or{' '}
            <S.Extension>zip</S.Extension> (containing chat media)
          </span>
        </S.P>
      </S.Label>
    </form>
  );
}

export default Dropzone;
