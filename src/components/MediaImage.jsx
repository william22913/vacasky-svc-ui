import { useState } from 'react';

export function MediaImage({ image, className, eager = false }) {
  const [failed, setFailed] = useState(false);
  const src = !failed && image?.url ? image.url : '/placeholders/photo.svg';
  const alt = image?.alt || '';

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
