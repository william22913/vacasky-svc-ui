import { InputNumber, Select } from 'antd';
import { SORT_OPTIONS } from '../features/tours/listingParams';

function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function FilterFields({
  idPrefix,
  filters,
  value,
  onChange,
  onCommitRange,
  rangeError,
}) {
  const destinations = (filters?.destinations || []).map((item) => ({
    value: item.slug,
    label: item.name,
  }));
  const categories = (filters?.categories || []).map((item) => ({
    value: item.slug,
    label: item.name,
  }));

  return (
    <div className="filter-bar__grid">
      <div className="filter-field">
        <label className="filter-field__label" htmlFor={`${idPrefix}-destination`}>
          Destination
        </label>
        <Select
          id={`${idPrefix}-destination`}
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Any destination"
          value={value.destination ?? undefined}
          onChange={(next) => onChange({ destination: next ?? null })}
          options={destinations}
        />
      </div>

      <div className="filter-field">
        <label className="filter-field__label" htmlFor={`${idPrefix}-category`}>
          Category
        </label>
        <Select
          id={`${idPrefix}-category`}
          allowClear
          placeholder="Any category"
          value={value.category ?? undefined}
          onChange={(next) => onChange({ category: next ?? null })}
          options={categories}
        />
      </div>

      <div className="filter-field filter-field--range">
        <span className="filter-field__label">Price (IDR)</span>
        <div className="range">
          <InputNumber
            aria-label="Minimum price in rupiah"
            min={0}
            precision={0}
            controls={false}
            placeholder="Min"
            value={value.priceMin ?? null}
            onChange={(next) => onChange({ priceMin: numberOrNull(next) })}
            onBlur={() => onCommitRange('price')}
            onPressEnter={() => onCommitRange('price')}
          />
          <span className="range__sep">to</span>
          <InputNumber
            aria-label="Maximum price in rupiah"
            min={0}
            precision={0}
            controls={false}
            placeholder="Max"
            value={value.priceMax ?? null}
            onChange={(next) => onChange({ priceMax: numberOrNull(next) })}
            onBlur={() => onCommitRange('price')}
            onPressEnter={() => onCommitRange('price')}
          />
        </div>
        {rangeError === 'price' ? (
          <p className="filter-bar__error" role="alert">
            Minimum price must be lower than maximum price.
          </p>
        ) : null}
      </div>

      <div className="filter-field filter-field--range">
        <span className="filter-field__label">Duration (days)</span>
        <div className="range">
          <InputNumber
            aria-label="Minimum duration in days"
            min={1}
            max={60}
            precision={0}
            controls={false}
            placeholder="Min"
            value={value.durationMin ?? null}
            onChange={(next) => onChange({ durationMin: numberOrNull(next) })}
            onBlur={() => onCommitRange('duration')}
            onPressEnter={() => onCommitRange('duration')}
          />
          <span className="range__sep">to</span>
          <InputNumber
            aria-label="Maximum duration in days"
            min={1}
            max={60}
            precision={0}
            controls={false}
            placeholder="Max"
            value={value.durationMax ?? null}
            onChange={(next) => onChange({ durationMax: numberOrNull(next) })}
            onBlur={() => onCommitRange('duration')}
            onPressEnter={() => onCommitRange('duration')}
          />
        </div>
        {rangeError === 'duration' ? (
          <p className="filter-bar__error" role="alert">
            Minimum duration must be lower than maximum duration.
          </p>
        ) : null}
      </div>

      <div className="filter-field">
        <label className="filter-field__label" htmlFor={`${idPrefix}-sort`}>
          Sort by
        </label>
        <Select
          id={`${idPrefix}-sort`}
          value={value.sort}
          onChange={(next) => onChange({ sort: next })}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  );
}
