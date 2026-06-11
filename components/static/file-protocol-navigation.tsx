"use client";

import { useEffect } from "react";

import { isFileProtocol, toStaticFileHref } from "@/lib/static-navigation";

export function FileProtocolNavigation() {
  useEffect(() => {
    if (!isFileProtocol()) return;

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || !rawHref.startsWith("/")) return;

      event.preventDefault();
      window.location.href = toStaticFileHref(rawHref);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
