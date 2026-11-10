import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export function SearchField({
  id = 'tour-search',
  label = 'Search tours',
  placeholder = 'Search tours or destinations',
  value,
  onChange,
  onSubmit,
  autoFocus = false,
}) {
  return (
    <form
      className="search-field"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value ?? '');
      }}
    >
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        allowClear
        autoFocus={autoFocus}
        prefix={<SearchOutlined className="search-field__icon" />}
        placeholder={placeholder}
        value={value}
        maxLength={100}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        className="search-field__button"
        type="primary"
        shape="round"
        size="large"
        htmlType="submit"
      >
        Search
      </Button>
    </form>
  );
}
