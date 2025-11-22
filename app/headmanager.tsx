import React, { createContext, useContext, useEffect, useState, useRef } from "react";

type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string }
  | { rel: string; href: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

interface HeadState {
  title?: string;
  tags: MetaTag[];
}

interface HeadContextValue {
  state: HeadState;
  setHead: (partial: Partial<HeadState>) => void;
  pushTag: (tag: MetaTag) => void;
  reset: () => void;
}

const HeadContext = createContext<HeadContextValue | null>(null);

export function HeadProvider({ children, initial }: { children: React.ReactNode; initial?: HeadState }) {
  const [state, setState] = useState<HeadState>(initial || { tags: [] });
  const isFirst = useRef(true);

  function setHead(partial: Partial<HeadState>) {
    setState((prev) => ({
      title: partial.title ?? prev.title,
      tags: partial.tags ? partial.tags : prev.tags,
    }));
  }

  function pushTag(tag: MetaTag) {
    setState((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  }

  function reset() {
    setState({ title: undefined, tags: [] });
  }

  // Client-side sync (optional if you rely on SSR injection)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (state.title) document.title = state.title;

    // Clean previous dynamic tags we control
    const markerAttr = "data-react-head";
    document.head.querySelectorAll(`[${markerAttr}]`).forEach((n) => n.remove());

    state.tags.forEach((tag) => {
      let el: HTMLElement | null = null;
      if ("name" in tag) {
        el = document.createElement("meta");
        el.setAttribute("name", tag.name);
        el.setAttribute("content", tag.content);
      } else if ("property" in tag) {
        el = document.createElement("meta");
        el.setAttribute("property", tag.property);
        el.setAttribute("content", tag.content);
      } else if ("rel" in tag) {
        el = document.createElement("link");
        el.setAttribute("rel", tag.rel);
        el.setAttribute("href", tag.href);
      } else if ("charSet" in tag) {
        el = document.createElement("meta");
        el.setAttribute("charset", tag.charSet);
      } else if ("httpEquiv" in tag) {
        el = document.createElement("meta");
        el.setAttribute("http-equiv", tag.httpEquiv);
        el.setAttribute("content", tag.content);
      }
      if (el) {
        el.setAttribute(markerAttr, "true");
        document.head.appendChild(el);
      }
    });

    if (isFirst.current) {
      isFirst.current = false;
    }
  }, [state]);

  return (
    <HeadContext.Provider value={{ state, setHead, pushTag, reset }}>
      {children}
    </HeadContext.Provider>
  );
}

export function useHead() {
  const ctx = useContext(HeadContext);
  if (!ctx) throw new Error("useHead must be used within HeadProvider");
  return ctx;
}

// Convenience component
export function Head({ title, children }: { title?: string; children?: React.ReactNode }) {
  const { setHead, reset } = useHead();

  useEffect(() => {
    reset();
    setHead({ title });
  }, [title]);

  return <>{children}</>;
}

// Helper components for individual tags
export function Meta(props: { name?: string; property?: string; content: string }) {
  const { pushTag } = useHead();
  useEffect(() => {
    pushTag(props.name ? { name: props.name, content: props.content } : { property: props.property!, content: props.content });
  }, [props.name, props.property, props.content]);
  return null;
}

export function LinkTag(props: { rel: string; href: string }) {
  const { pushTag } = useHead();
  useEffect(() => {
    pushTag({ rel: props.rel, href: props.href });
  }, [props.rel, props.href]);
  return null;
}
