import React, { useRef } from 'react';
import { Button } from '@chakra-ui/react';

type UploadButtonProps = {
  onChange(files: FileList | null): void;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, 'onChange' | 'onClick'>;

const UploadButton = ({ multiple, onChange, children, ...rest }: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    onChange(files);
  };

  const onClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Button {...rest} onClick={onClick}>
      {children}
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        multiple={multiple}
        onChange={onUpload}
      />
    </Button>
  );
};

export default UploadButton;
