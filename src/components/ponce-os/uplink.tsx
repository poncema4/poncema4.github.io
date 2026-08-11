// SATELLITE UPLINK — live GitHub telemetry rendered as a ground-station panel.
import { useEffect, useState } from "react";
import { fetchGitHub, timeAgo, eventVerb, type GhData } from "./github";

export function Uplink() {
  const [data, setData] = useState<GhData | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () => fetchGitHub().then((d) => { if (alive) { setData(d); setErr(false); } }).catch(() => alive && setErr(true));
    load();
    // near-realtime: refresh every 5 min + when the tab regains focus (cache TTL 4 min)
    const iv = setInterval(load, 5 * 60 * 1000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => { alive = false; clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, []);

  if (err) {
    return (
      <div className="pos-uplink pos-uplink-off">
        <span className="pos-uplink-dot off" /> UPLINK OFFLINE — orbital congestion (API rate limit). telemetry resumes shortly.
      </div>
    );
  }
  if (!data) {
    return (
      <div className="pos-uplink">
        <span className="pos-uplink-dot" /> ACQUIRING SIGNAL<span className="pos-uplink-blink">...</span>
      </div>
    );
  }

  const years = Math.floor((Date.now() - new Date(data.user.created_at).getTime()) / 31557600000);

  return (
    <div className="pos-uplink">
      <div className="pos-uplink-head">
        <span><span className="pos-uplink-dot" /> LIVE — telemetry from api.github.com</span>
        <span className="dim">{data.user.public_repos} public repos · {data.user.followers} followers · {years}y on orbit</span>
      </div>
      <div className="pos-uplink-grid">
        {data.repos.map((r) => (
          <a key={r.name} href={r.html_url} target="_blank" rel="noopener noreferrer" className="pos-uplink-repo">
            <div className="pos-uplink-repo-top">
              <span className="name">{r.name}</span>
              <span className="dim">{r.language || "—"}{r.stargazers_count > 0 ? ` · ${r.stargazers_count}*` : ""}</span>
            </div>
            <p>{r.description || "no transmission description"}</p>
            <span className="dim">last signal {timeAgo(r.pushed_at)}</span>
          </a>
        ))}
      </div>
      {data.events.length > 0 && (
        <div className="pos-uplink-feed">
          {data.events.slice(0, 6).map((e, i) => (
            <div key={i} className="pos-uplink-evt">
              <span className="dim">{timeAgo(e.created_at).padEnd(8)}</span>
              <span>{eventVerb(e.type)} {e.repo.name.replace("poncema4/", "")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
