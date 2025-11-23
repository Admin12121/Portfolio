'use client';

import React, {
  use,
  useEffect,
  useId,
  useState,
  Children,
  ReactNode,
} from 'react';
import { useTheme } from 'next-themes';

type MermaidProps = {
  chart?: string;
  children?: ReactNode;
};

export function Mermaid({ chart, children }: MermaidProps) {
  const [mounted, setMounted] = useState(false);

  const effectiveChart =
    chart ??
    Children.toArray(children)
      .map((c) => (typeof c === 'string' ? c : ''))
      .join('')
      .replace(/\r/g, '')
      .trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!effectiveChart) return null;

  return <MermaidContent chart={effectiveChart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const { default: mermaid } = use(
    cachePromise('mermaid', () => import('mermaid')),
  );

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeCSS: 'margin: 1.5rem auto 0;',
    theme: resolvedTheme === 'dark' ? 'dark' : 'default',
  });

  const safeChart = String(chart);

  const { svg, bindFunctions } = use(
    cachePromise(`${safeChart}-${resolvedTheme}`, () => {
      const normalized = safeChart
        .split('\\n')
        .join('\n')
        .trim();
      return mermaid.render(id, normalized);
    }),
  );

  return (
    <div
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
