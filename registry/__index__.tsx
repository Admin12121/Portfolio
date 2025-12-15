// @ts-nocheck
import * as React from "react"

export const Index: Record<string, Record<string, any>> = {
  "rust-c2": {
       name: "rust-c2",
       title: "Rust C2",
       description: "A Rust C2 framework for building custom command and control systems.",
       type: "registry:block",
       registryDependencies: ["rust"],
       files: [{
         path: "registry/bases/malware/src/main.rs",
         type: "registry:file",
         target: "src/main.rs",
       },
       {
         path: "registry/bases/malware/src/cam.rs",
         type: "registry:file",
         target: "src/cam.rs",
       },
       {
         path: "registry/bases/malware/src/winhttp.rs",
         type: "registry:file",
         target: "src/winhttp.rs",
       },
       {
         path: "registry/bases/malware/Cargo.toml",
         type: "registry:component",
         target: "Cargo.toml",
       },],
       categories: ["Malware"],
       meta: {"iframeHeight":"1000px"},
     },
}
