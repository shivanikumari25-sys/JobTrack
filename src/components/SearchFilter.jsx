
import { Search, Filter } from "lucide-react";

const statuses = ["All", "Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"];

export default function SearchFilter({
  search,
  setSearch,
  status,
  setStatus
}) {
  return (
    <div className="filter-panel">
      <div className="search-box">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or job title..."
          aria-label="Search jobs"
        />
      </div>

      <div className="select-box">
        <Filter size={17} />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All statuses" : item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
