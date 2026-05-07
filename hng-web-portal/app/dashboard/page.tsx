"use client";
import profileApiAdapter from "@/lib/profileApiAdapter";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterBy, setFilterBy] = useState<"age" | "name" | "country" | "">("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = { page, limit: 10 };
      if (debouncedSearch) params.q = debouncedSearch;

      const endpoint = debouncedSearch ? "/profiles/search" : "/profiles";
      const response = await profileApiAdapter.get(endpoint, { params });

      setData(response.data.data);
      setTotalPages(response.data.total_pages ?? 1);
    } catch (err) {
      setError("Failed to load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 on new search
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await profileApiAdapter.delete(`/profiles/${id}`);
      setData((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete profile.");
    }
  };

  const filteredData = filterBy
    ? [...data].sort((a, b) => {
        if (filterBy === "age") return (a.age ?? 0) - (b.age ?? 0);
        if (filterBy === "name") return a.name.localeCompare(b.name);
        if (filterBy === "country")
          return (a.country_name ?? "").localeCompare(b.country_name ?? "");
        return 0;
      })
    : data;

  return (
    <div className="bg-neutral-primary-soft shadow-xs rounded-base border w-full">
      {/* Toolbar */}
      <div className="p-4 grid grid-cols-2 space-x-4 w-full">
        <div>
          <label htmlFor="input-group-1" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-body"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="input-group-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full max-w-96 ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
              placeholder="Search profiles..."
            />
          </div>
        </div>

        <div className="w-full flex items-center">
          <p className="text-sm text-body font-medium">Filter By</p>
          <ul className="p-2 text-sm text-body font-medium flex">
            {(["age", "name", "country"] as const).map((f) => (
              <li key={f}>
                <button
                  onClick={() => setFilterBy(filterBy === f ? "" : f)}
                  className={`inline-flex items-center w-full p-2 rounded capitalize hover:bg-neutral-secondary-medium hover:text-heading ${
                    filterBy === f
                      ? "bg-neutral-secondary-medium text-heading font-semibold"
                      : ""
                  }`}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* States */}
      {error && <div className="px-4 pb-4 text-sm text-red-500">{error}</div>}

      {loading ? (
        <div className="px-6 py-12 text-center text-sm text-body">
          Loading profiles...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-body">
          No profiles found.
        </div>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-t border-default-medium">
            <tr>
              {[
                "ID",
                "Name",
                "Gender",
                "Gender Prob",
                "Age",
                "Age Group",
                "Country ID",
                "Country",
                "Country Prob",
                "Created At",
                "Action",
              ].map((col) => (
                <th key={col} scope="col" className="px-6 py-3 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((profile) => (
              <tr
                key={profile.id}
                className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                >
                  {profile.id}
                </th>
                <td className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                  {profile.name}
                </td>
                <td className="px-6 py-4">{profile.gender}</td>
                <td className="px-6 py-4">{profile.gender_probability}</td>
                <td className="px-6 py-4">{profile.age}</td>
                <td className="px-6 py-4">{profile.age_group}</td>
                <td className="px-6 py-4">{profile.country_id}</td>
                <td className="px-6 py-4">{profile.country_name}</td>
                <td className="px-6 py-4">{profile.country_probability}</td>
                <td className="px-6 py-4">{profile.created_at}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="font-medium text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 text-sm text-body">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded border border-default-medium disabled:opacity-40 hover:bg-neutral-secondary-medium"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-default-medium disabled:opacity-40 hover:bg-neutral-secondary-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
