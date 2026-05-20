interface SearchItem {
  id: number;
  query: string;
  query_type: string;
}

interface Props {
  searches: SearchItem[];
  onSelect: (query: string) => void;
}

export default function RecentSearches({
  searches,
  onSelect,
}: Props) {
  if (!searches.length) return null;

  return (
    <div className="rt-recent-card">
      <h3>Recent Searches</h3>

      <div className="rt-recent-list">
        {searches.map((item) => (
          <button
            key={item.id}
            className="rt-recent-item"
            onClick={() => onSelect(item.query)}
          >
            <span>{item.query}</span>

            <small>
              {item.query_type}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}