import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
import { MediaImage } from '../../components/MediaImage';
import { SearchField } from '../../components/SearchField';

// The hero is static: the contract has no hero payload, so its copy is the
// approved UIMap copy and its image is the bundled travel placeholder.
const HERO_IMAGE = {
  url: '/placeholders/photo.svg',
  alt: 'A blue mountain range above calm water, one of the landscapes Vacasky visits',
};

export function HomeHero() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const submit = (value) => {
    const keyword = value.trim();
    navigate(keyword ? `/tours?q=${encodeURIComponent(keyword)}` : '/tours');
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__media">
            <MediaImage image={HERO_IMAGE} eager />
            <div className="hero__scrim" aria-hidden="true" />
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">Create unforgettable</p>
              <h1 className="hero__title" id="hero-title">
                <span className="hero__title-line">Memories</span>{' '}
                <span className="hero__title-small">with our</span>{' '}
                <span className="hero__title-line">Vacasky</span>
              </h1>
              <p className="hero__sub">
                Small-group tours across Indonesia, led by guides who live there.
              </p>
            </div>
          </div>

          <div className="hero__note">
            <SendOutlined className="hero__note-icon" aria-hidden="true" />
            <p>
              Let us take you on a journey of discovery, adventure, and relaxation. Book now or
              contact us for more information.
            </p>
          </div>
        </div>

        <div className="hero__search">
          <SearchField
            id="hero-search"
            label="Search tours"
            placeholder="Where do you want to go?"
            value={term}
            onChange={setTerm}
            onSubmit={submit}
          />
        </div>
      </div>
    </section>
  );
}
