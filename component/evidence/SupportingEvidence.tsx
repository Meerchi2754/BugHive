"use client";
import { useRef, useState } from "react";
import { FiLink, FiExternalLink, FiPlus, FiX } from "react-icons/fi";
import { addEvidences } from "@/app/actions/evidence/addEvidence";
import { toast } from "react-toastify";

const MAX_LINKS = 5;

interface SupportingEvidenceProps {
  prTableId: string;
  initialLinks: string[];
}

/** Safely extract hostname from a URL for display */
function getDisplayUrl(raw: string): string {
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return raw;
  }
}

/** Ensure URL has a protocol prefix */
function toBrowserUrl(raw: string): string {
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
}

export function SupportingEvidence({
  prTableId,
  initialLinks,
}: SupportingEvidenceProps) {
  const [links, setLinks] = useState<string[]>(initialLinks);
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const count = links.length;
  const atMax = count >= MAX_LINKS;

  const openForm = () => {
    setShowForm(true);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeForm = () => {
    setShowForm(false);
    setInputValue("");
  };

  const handleAdd = async () => {
    // Bug fix: validate input is not empty before submitting
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error("Please enter a valid URL.");
      return;
    }
    if (atMax) {
      toast.error(`Maximum of ${MAX_LINKS} supporting links reached.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await addEvidences(trimmed, prTableId);
      // Bug fix: setSubmit(!submit) was non-deterministic — just reset cleanly
      setLinks((prev) => [...prev, trimmed]);
      closeForm();
      toast.success("Evidence added.");
    } catch {
      // Bug fix: corrected typo "Evindence Adding failed."
      toast.error("Failed to add evidence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#F3F4F6]">
            Supporting Evidence
          </h2>
          <p className="text-xs text-[#8B949E] mt-0.5">
            Demos, documentation, discussions, or deployment links.
          </p>
        </div>
        <span className="font-mono text-xs text-[#8B949E]">
          {count} / {MAX_LINKS}
        </span>
      </div>

      {/* Links list */}
      <div className="border border-[#24282D] rounded-[10px] overflow-hidden">
        {count > 0 ? (
          <ul>
            {links.map((link, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-[#24282D] last:border-0 bg-[#0D1013] hover:bg-[#111519] transition-colors duration-150 group"
              >
                <FiLink className="w-3.5 h-3.5 text-[#8B949E] shrink-0" />
                <span
                  className="flex-1 text-xs text-[#8B949E] group-hover:text-[#F3F4F6] transition-colors duration-150 truncate"
                  title={link}
                >
                  {getDisplayUrl(link)}
                </span>
                <a
                  href={toBrowserUrl(link)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#60A5FA] hover:text-blue-300 transition-colors duration-150 shrink-0 opacity-0 group-hover:opacity-100"
                >
                  Open
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center bg-[#0D1013]">
            <FiLink className="w-7 h-7 text-[#24282D] mx-auto mb-2" />
            <p className="text-sm text-[#8B949E]">
              No supporting evidence added yet.
            </p>
            <p className="text-xs text-[#8B949E]/60 mt-1 max-w-xs mx-auto">
              Add demos, documentation, discussions, or deployment links to
              strengthen this contribution record.
            </p>
          </div>
        )}
      </div>

      {/* Inline add form */}
      {showForm && !atMax && (
        <div className="border border-[#24282D] rounded-[10px] bg-[#0D1013] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#F3F4F6]">
              Add Supporting Evidence
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="text-[#8B949E] hover:text-[#F3F4F6] transition-colors cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#8B949E]">URL</label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") closeForm();
              }}
              placeholder="https://..."
              className="w-full bg-[#111519] border border-[#24282D] focus:border-[#00D084]/50 focus:ring-1 focus:ring-[#00D084]/20 rounded-[8px] px-3 py-2 text-sm text-[#F3F4F6] placeholder:text-[#8B949E]/60 outline-none transition-all duration-150 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-3 py-1.5 text-xs text-[#8B949E] hover:text-[#F3F4F6] transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isSubmitting || !inputValue.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/25 hover:bg-[#00D084]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
            >
              {isSubmitting ? "Adding…" : "Add Evidence"}
            </button>
          </div>
        </div>
      )}

      {/* Add button or max reached message */}
      {!showForm && (
        atMax ? (
          <p className="text-xs text-[#8B949E] text-center py-2">
            Maximum of {MAX_LINKS} supporting links reached.
          </p>
        ) : (
          <button
            type="button"
            onClick={openForm}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] border border-dashed border-[#24282D] text-xs font-medium text-[#8B949E] hover:border-[#00D084]/40 hover:text-[#00D084] transition-colors duration-150 cursor-pointer"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Add Supporting Evidence
          </button>
        )
      )}
    </div>
  );
}

export function SupportingEvidenceSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-[#24282D] rounded" />
          <div className="h-3 w-56 bg-[#24282D] rounded" />
        </div>
        <div className="h-3 w-8 bg-[#24282D] rounded" />
      </div>
      <div className="border border-[#24282D] rounded-[10px] overflow-hidden">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-[#24282D] last:border-0 bg-[#0D1013]"
          >
            <div className="h-3.5 w-3.5 bg-[#24282D] rounded" />
            <div className="h-3 flex-1 bg-[#24282D] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
