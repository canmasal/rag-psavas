// Güvenli, bağımlılıksız basit Markdown işleyici (başlık, paragraf, liste, kalın, italik, bağlantı)
import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("**")) nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("[")) {
      const m = /\[([^\]]+)\]\(([^)]+)\)/.exec(token)!;
      const href = /^(https?:\/\/|\/|mailto:|tel:)/.test(m[2]) ? m[2] : "#";
      nodes.push(
        <a key={key} href={href} className="text-accent underline underline-offset-4">
          {m[1]}
        </a>,
      );
    } else nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out: ReactNode[] = [];
  blocks.forEach((block, bi) => {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (!lines.length) return;
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push(
        <ul key={bi}>
          {lines.map((l, li) => (
            <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""), `${bi}-${li}`)}</li>
          ))}
        </ul>,
      );
      return;
    }
    if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      out.push(
        <ol key={bi}>
          {lines.map((l, li) => (
            <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${bi}-${li}`)}</li>
          ))}
        </ol>,
      );
      return;
    }
    const first = lines[0];
    const h = /^(#{1,3})\s+(.*)$/.exec(first);
    if (h) {
      const level = h[1].length;
      const content = inline(h[2], `${bi}-h`);
      out.push(level === 1 ? <h2 key={`${bi}h`}>{content}</h2> : level === 2 ? <h2 key={`${bi}h`}>{content}</h2> : <h3 key={`${bi}h`}>{content}</h3>);
      if (lines.length > 1) {
        const rest = lines.slice(1);
        if (rest.every((l) => /^\s*[-*]\s+/.test(l))) {
          out.push(
            <ul key={`${bi}l`}>
              {rest.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""), `${bi}-r${li}`)}</li>
              ))}
            </ul>,
          );
        } else out.push(<p key={`${bi}p`}>{inline(rest.join(" "), `${bi}-p`)}</p>);
      }
      return;
    }
    out.push(<p key={bi}>{inline(lines.join(" "), `${bi}`)}</p>);
  });
  return <div className={className ?? "prose-rs"}>{out}</div>;
}
