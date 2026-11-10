export function CategoryTag({ children }) {
  if (!children) return null;
  return <span className="tag">{children}</span>;
}
