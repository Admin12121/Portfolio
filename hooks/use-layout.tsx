"use client";

import * as React from "react";

type Layout = "fixed";

interface LayoutProviderState {
  layout: Layout;
  setLayout: (layout: Layout | ((prev: Layout) => Layout)) => void;
}

const useLayout = () => {
  const setLayout = React.useCallback(
    (value: Layout | ((prev: Layout) => Layout)) => {
      void value;
    },
    [],
  );

  return React.useMemo(
    () => ({
      layout: "fixed" as const,
      setLayout,
    }),
    [setLayout],
  );
};

export { useLayout };
