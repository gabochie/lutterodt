"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle2, XCircle, AlertTriangle, Globe, ExternalLink, FileText } from "lucide-react";

interface Candidate {
  name: string;
  snippet: string;
  url: string;
  source: string;
  estimatedCategory: string;
  estimatedCountry: string;
}

const quickSearches = [
  "Lutterodt",
  "Lutteroth",
  "Lutterodt CEO",
  "Lutterodt professor",
  "Lutterodt engineer",
  "Lutterodt doctor",
  "Lutterodt lawyer",
];

const categoryOptions = [
  { value: "", label: "Any" },
  { value: "academia", label: "Academia" },
  { value: "healthcare", label: "Healthcare" },
  { value: "law", label: "Law" },
  { value: "business", label: "Business" },
  { value: "engineering", label: "Engineering" },
  { value: "creative", label: "Creative" },
  { value: "service", label: "Service" },
];

const countryOptions = [
  { value: "", label: "Any" },
  { value: "Ghana", label: "Ghana" },
  { value: "United Kingdom", label: "UK" },
  { value: "United States", label: "USA" },
  { value: "Germany", label: "Germany" },
  { value: "Canada", label: "Canada" },
  { value: "Denmark", label: "Denmark" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Estonia", label: "Estonia" },
];

interface ImportResult {
  name: string;
  status: "imported" | "duplicate" | "error";
  detail: string;
}

export default function WebFinderPage() {
  const [query, setQuery] = useState("Lutterodt");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [showLetters, setShowLetters] = useState(false);

  const toggleSelected = (idx: number) => {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setSelected(next);
  };

  const filteredResults = results.filter((r) => {
    if (categoryFilter && r.estimatedCategory !== categoryFilter) return false;
    if (countryFilter && r.estimatedCountry !== countryFilter) return false;
    return true;
  });

  async function doSearch(q?: string) {
    const searchQuery = q || query;
    if (searchQuery.length < 2) return;
    setLoading(true);
    setError("");
    setSearched(false);
    setResults([]);
    setSelected(new Set());
    setImportResults([]);
    setShowLetters(false);
    try {
      const r = await fetch("/api/outreach/web-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await r.json();
      if (r.ok) {
        setResults(data.results || []);
        setSource(data.source || "");
        setSearched(true);
      } else {
        setError(data.error || "Search failed");
      }
    } catch {
      setError("Network error — cannot reach search service");
    }
    setLoading(false);
  }

  async function importSelected() {
    if (selected.size === 0) return;
    setImporting(true);
    setImportResults([]);
    const resultsList: ImportResult[] = [];
    const indices = Array.from(selected).sort((a, b) => a - b);

    for (const idx of indices) {
      const candidate = filteredResults[idx];
      if (!candidate) continue;
      try {
        const r = await fetch("/api/outreach/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: candidate.name,
            category: candidate.estimatedCategory,
            country: candidate.estimatedCountry,
            achievement: candidate.snippet.slice(0, 500),
            notes: `Found via ${candidate.source}: ${candidate.url}`,
          }),
        });
        const data = await r.json();
        if (r.status === 201) {
          resultsList.push({ name: candidate.name, status: "imported", detail: "Added to database" });
        } else if (r.status === 409) {
          resultsList.push({ name: candidate.name, status: "duplicate", detail: data.message || "Already exists" });
        } else {
          resultsList.push({ name: candidate.name, status: "error", detail: data.error || `HTTP ${r.status}` });
        }
      } catch {
        resultsList.push({ name: candidate.name, status: "error", detail: "Network error" });
      }
    }

    setImportResults(resultsList);
    setImporting(false);
    setShowLetters(true);
  }

  const imported = importResults.filter((r) => r.status === "imported");
  const duplicates = importResults.filter((r) => r.status === "duplicate");
  const errors = importResults.filter((r) => r.status === "error");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Web Finder</h1>
        <p className="text-fg/50 text-[14px] mt-1">Search the web for Lutterodts and import them into the directory</p>
      </div>

      <div className="bg-surface border border-line p-6 mb-6">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1">
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Search query</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim"
              placeholder="e.g. Lutterodt engineer Ghana"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim">
              {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Country</label>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim">
              {countryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button onClick={() => doSearch()} disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {quickSearches.map((qs) => (
            <button key={qs} onClick={() => { setQuery(qs); doSearch(qs); }}
              className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1.5 border border-line text-fg/50 hover:border-gold-dim hover:text-gold-dim transition-colors">
              {qs}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gold-dim" />
          <span className="ml-3 text-fg/50 text-[13px]">Searching the web...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[13px] text-red-700">
          {error}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-16 text-fg/50">
          <Globe className="w-10 h-10 mx-auto mb-3 text-fg/20" />
          <p className="text-[15px]">No Lutterodts found for &ldquo;{query}&rdquo;</p>
          <p className="text-[13px] mt-1">Try a different search term or use the quick-search buttons above.</p>
        </div>
      )}

      {searched && filteredResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-fg/50">
                {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                {results.length !== filteredResults.length && ` (${results.length} total, filtered)`}
                {source && <span className="ml-2 font-mono text-[10px] tracking-widest uppercase text-gold-dim">via {source}</span>}
              </span>
            </div>
            <button
              onClick={importSelected}
              disabled={selected.size === 0 || importing}
              className="btn-gold text-[12px] px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1.5" /> Importing...</>
              ) : (
                <>Import Selected ({selected.size})</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3 mb-8">
            {filteredResults.map((candidate, idx) => {
              const isSelected = selected.has(idx);
              const result = importResults.find((r) => r.name === candidate.name);
              return (
                <div
                  key={idx}
                  className={`bg-surface border transition-colors ${
                    isSelected ? "border-gold-dim" : "border-line hover:border-charcoal/20"
                  } ${result ? (result.status === "imported" ? "border-forest/40 bg-forest/[0.02]" : result.status === "duplicate" ? "border-amber/40" : "border-red/40") : ""}`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelected(idx)}
                          disabled={importing || !!result}
                          className="mt-1 shrink-0 accent-gold-dim"
                        />
                        <div className="min-w-0">
                          <h3 className="text-[15px] font-medium text-heading truncate">{candidate.name}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {candidate.estimatedCategory && candidate.estimatedCategory !== "uncategorized" && (
                              <span className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-charcoal/5 text-fg/50 border border-charcoal/10">
                                {candidate.estimatedCategory}
                              </span>
                            )}
                            {candidate.estimatedCountry && (
                              <span className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-gold-dim/5 text-gold-dim border border-gold-dim/15">
                                {candidate.estimatedCountry}
                              </span>
                            )}
                          </div>
                          <p className="text-[12.5px] text-fg/60 mt-2 line-clamp-3 leading-relaxed">{candidate.snippet}</p>
                          <a href={candidate.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-gold-dim hover:text-gold-light mt-2">
                            <ExternalLink className="w-3 h-3" />
                            {new URL(candidate.url).hostname}
                          </a>
                        </div>
                      </div>
                      {result && (
                        <div className="shrink-0 mt-1">
                          {result.status === "imported" && <CheckCircle2 className="w-5 h-5 text-success-text" />}
                          {result.status === "duplicate" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                          {result.status === "error" && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {importResults.length > 0 && (
        <div className="bg-surface border border-line p-5 mb-6">
          <h3 className="font-display text-[16px] text-heading mb-3">Import Summary</h3>
          <div className="flex items-center gap-4 text-[13px] mb-4">
            <span className="text-success-text">{imported.length} imported</span>
            <span className="text-amber-600">{duplicates.length} duplicates skipped</span>
            <span className="text-red-600">{errors.length} errors</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-auto text-[12px] text-fg/60">
            {importResults.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                {r.status === "imported" ? <CheckCircle2 className="w-3 h-3 text-success-text" /> : r.status === "duplicate" ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                <span>{r.name}</span>
                <span className="text-fg/40">— {r.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLetters && imported.length > 0 && (
        <div className="mb-8">
          <FileText className="w-5 h-5 text-gold-dim inline mr-2" />
          <span className="text-[14px]">
            {imported.length} profile{imported.length !== 1 ? "s" : ""} added.{imported.length > 5 ? " Go to /outreach/queue to generate letters in bulk." : ""}
          </span>
          <span className="text-[14px] ml-2">
            <a href="/outreach/discover" className="text-gold-dim hover:text-gold-light underline">Discover page</a>
            {" "}or{" "}
            <a href="/outreach/queue" className="text-gold-dim hover:text-gold-light underline">Letter Queue</a>
          </span>
        </div>
      )}
    </div>
  );
}
