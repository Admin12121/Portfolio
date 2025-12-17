// @ts-nocheck
import * as React from "react";

export const Index: Record<string, Record<string, any>> = {
  Malware: {
    Venom: {
      discord: {
        title: "Discord",
        description:
          "A Rust C2 framework for building custom command and control systems.",
        type: "registry:block",
        registryDependencies: ["rust"],
        files: [
          {
            path: "registry/bases/malware/venom/discord/src/main.rs",
            type: "registry:file",
            target: "src/main.rs",
          },
          {
            path: "registry/bases/malware/venom/discord/src/cam.rs",
            type: "registry:file",
            target: "src/cam.rs",
          },
          {
            path: "registry/bases/malware/venom/discord/src/winhttp.rs",
            type: "registry:file",
            target: "src/winhttp.rs",
          },
          {
            path: "registry/bases/malware/venom/discord/Cargo.toml",
            type: "registry:file",
            target: "Cargo.toml",
          },
          {
            path: "registry/bases/malware/venom/discord/README.md",
            type: "registry:page",
            target: "README.md",
          }
        ],
        categories: ["Malware"],
        meta: { iframeHeight: "1000px" },
      },
      github: {
        title: "Github",
        description:
          "A Rust C2 framework for building custom command and control systems.",
        type: "registry:block",
        registryDependencies: ["rust"],
        files: [
          {
            path: "registry/bases/malware/venom/github/src/main.rs",
            type: "registry:file",
            target: "src/main.rs",
          },
          {
            path: "registry/bases/malware/venom/github/Cargo.toml",
            type: "registry:file",
            target: "Cargo.toml",
          },
        ],
        categories: ["Malware"],
        meta: { iframeHeight: "1000px" },
      },
    },
  },
};
