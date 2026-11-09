export function StateBlock({ title, children, tone = 'default', actions }) {
  return (
    <div className={`state-block${tone === 'error' ? ' state-block--error' : ''}`} role={tone === 'error' ? 'alert' : undefined}>
      {title ? <p className="state-block__title">{title}</p> : null}
      <p className="state-block__text">{children}</p>
      {actions ? <div className="state-block__actions">{actions}</div> : null}
    </div>
  );
}
