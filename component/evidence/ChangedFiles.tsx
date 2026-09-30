"use client";
import { VscFile, VscFileCode } from "react-icons/vsc";

interface ChangedFilesProps {
  files: string[];
  count: number;
}

/** Guess language badge from extension */
function getLangLabel(file: string): string | null {
  const ext = file.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "TS",
    tsx: "TSX",
    js: "JS",
    jsx: "JSX",
    py: "PY",
    go: "GO",
    rs: "RS",
    md: "MD",
    json: "JSON",
    css: "CSS",
    scss: "SCSS",
    html: "HTML",
    yml: "YML",
    yaml: "YAML",
    sql: "SQL",
    sh: "SH",
    env: "ENV",
    toml: "TOML",
  };
  return ext ? (map[ext] ?? null) : null;
}

function getLangColor(label: string | null): string {
  if (!label) return "text-[#8B949E] bg-[#1A1E23]";
  const colors: Record<string, string> = {
    TS: "text-blue-400 bg-blue-400/10",
    TSX: "text-blue-300 bg-blue-300/10",
    JS: "text-yellow-400 bg-yellow-400/10",
    JSX: "text-yellow-300 bg-yellow-300/10",
    PY: "text-green-400 bg-green-400/10",
    GO: "text-cyan-400 bg-cyan-400/10",
    RS: "text-orange-400 bg-orange-400/10",
    MD: "text-gray-400 bg-gray-400/10",
    CSS: "text-pink-400 bg-pink-400/10",
    SCSS: "text-pink-300 bg-pink-300/10",
    JSON: "text-amber-400 bg-amber-400/10",
  };
  return colors[label] ?? "text-[#8B949E] bg-[#1A1E23]";
}

export function ChangedFiles({ files, count }: ChangedFilesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#F3F4F6]">
          Changed Files
        </h2>
        <span className="text-xs text-[#8B949E] font-mono">
          {count} {count === 1 ? "file" : "files"}
        </span>
      </div>

      <div className="border border-[#24282D] rounded-[10px] overflow-hidden">
        {files.length > 0 ? (
          <ul>
            {files.map((file, i) => {
              const lang = getLangLabel(file);
              const langColor = getLangColor(lang);
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-[#24282D] last:border-0 bg-[#0D1013] hover:bg-[#111519] transition-colors duration-150 group"
                >
                  {/* Language badge */}
                  {lang ? (
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${langColor}`}
                    >
                      {lang}
                    </span>
                  ) : (
                    <VscFile className="w-4 h-4 text-[#8B949E] shrink-0" />
                  )}

                  {/* File path */}
                  <span className="font-mono text-xs text-[#8B949E] group-hover:text-[#F3F4F6] transition-colors duration-150 truncate flex-1">
                    {file}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center bg-[#0D1013]">
            <VscFileCode className="w-8 h-8 text-[#24282D] mx-auto mb-2" />
            <p className="text-sm text-[#8B949E]">No files recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChangedFilesSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-[#24282D] rounded" />
        <div className="h-3 w-12 bg-[#24282D] rounded" />
      </div>
      <div className="border border-[#24282D] rounded-[10px] overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-[#24282D] last:border-0 bg-[#0D1013]"
          >
            <div className="h-4 w-8 bg-[#24282D] rounded" />
            <div className="h-3 flex-1 bg-[#24282D] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
