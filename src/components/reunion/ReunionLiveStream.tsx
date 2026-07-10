"use client";

import { useEffect, useState } from "react";
import { Tag } from "@/components/shared/Tag";

export function ReunionLiveStream() {
  const [videoId, setVideoId] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editId, setEditId] = useState("");
  const [editLive, setEditLive] = useState(false);

  useEffect(() => {
    fetch("/api/reunion/settings")
      .then(r => r.json())
      .then(d => {
        setVideoId(d.livestream_id || "");
        setIsLive(d.livestream_live || false);
        setEditId(d.livestream_id || "");
        setEditLive(d.livestream_live || false);
      })
      .catch(() => {});
    fetch("/api/login/check")
      .then(r => r.json())
      .then(d => setIsAdmin(d.authenticated))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/reunion/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ livestream_id: editId, livestream_live: editLive }),
    });
    if (res.ok) {
      setVideoId(editId);
      setIsLive(editLive);
    }
  };

  if (!videoId && !isAdmin) return null;

  return (
    <section className="py-[108px] bg-burgundy-ink">
      <div className="container-main">
        <Tag onDark className="justify-center flex">Livestream</Tag>
        <h2 className="text-ivory text-[clamp(28px,3.2vw,40px)] text-center mt-[18px] mb-2">
          {videoId ? "Watch live from Copenhagen" : "Livestream"}
        </h2>
        {isLive && videoId && (
          <p className="text-gold-light text-[13px] font-mono text-center tracking-wider mb-6 uppercase flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE now
          </p>
        )}
        {videoId ? (
          <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <p className="text-ivory/50 text-center text-[15px] mt-4">
No stream scheduled yet — check back during the reunion.
          </p>
        )}
        {isAdmin && (
          <div className="max-w-md mx-auto mt-8 p-5 bg-ivory-dim/10 rounded-lg border border-ivory/10">
            <label className="block text-[12px] text-ivory/60 font-mono tracking-wider mb-2">
              YouTube Live Video ID
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={editId}
                onChange={e => setEditId(e.target.value)}
                placeholder="e.g. dQw4w9WgXcQ"
                className="flex-1 bg-ivory/10 border border-ivory/20 px-3 py-2 text-[14px] text-ivory outline-none focus:border-gold-light"
              />
            </div>
            <label className="flex items-center gap-3 text-ivory/70 text-[14px] mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={editLive}
                onChange={e => setEditLive(e.target.checked)}
                className="accent-gold-light"
              />
              Mark as live now
            </label>
            <button onClick={handleSave} className="btn-gold text-[12px] w-full">
              Save Settings
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
