import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaImage } from '../../components/MediaImage';
import { SearchField } from '../../components/SearchField';

export function HomeHero({ hero }) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const submit = (value) => {
    const keyword = value.trim();
    navigate(keyword ? `/tours?q=${encodeURIComponent(keyword)}` : '/tours');
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__frame">
          <div className="hero__media">
            <MediaImage image={hero?.image} eager />
          </div>
          <div className="hero__scrim" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow hero__eyebrow">Tours across Indonesia</p>
            <h1 className="hero__title" id="hero-title">
              {hero?.heading}
            </h1>
            {hero?.subheading ? <p className="hero__sub">{hero.subheading}</p> : null}
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
