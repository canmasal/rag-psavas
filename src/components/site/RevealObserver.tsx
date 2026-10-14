"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window { __rvReady?: boolean }
}

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    window.__rvReady = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
  return null;
}

/** JS etkinse animasyon sınıfını erken ekler; gözlemci yüklenmezse içerik yine görünür olur. */
export const revealBootScript = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__rvReady){document.querySelectorAll('[data-reveal]').forEach(function(e){e.classList.add('is-visible')})}},2500);`;
