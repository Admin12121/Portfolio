// @ts-nocheck
import * as React from "react";

export const Index: Record<string, Record<string, any>> = {
  Malware: {
    Venom: {
      name: "venom",
      title: "Venom",
      description:
        "A Rust C2 framework for building custom command and control systems.",
      type: "registry:block",
      registryDependencies: ["rust"],
      files: [
        {
          path: "registry/bases/malware/venom/src/main.rs",
          type: "registry:file",
          target: "src/main.rs",
        },
        {
          path: "registry/bases/malware/venom/src/cam.rs",
          type: "registry:file",
          target: "src/cam.rs",
        },
        {
          path: "registry/bases/malware/venom/src/winhttp.rs",
          type: "registry:file",
          target: "src/winhttp.rs",
        },
        {
          path: "registry/bases/malware/venom/Cargo.toml",
          type: "registry:file",
          target: "Cargo.toml",
        },
        {
          path: "registry/bases/malware/venom/README.md",
          type: "registry:page",
          target: "README.md",
        },
        {
          path: "registry/bases/malware/venom/index.json",
          type: "registry:document",
          target: "index.json",
        },
      ],
      categories: ["Malware"],
      meta: { iframeHeight: "1000px" },
    },
  },
};
