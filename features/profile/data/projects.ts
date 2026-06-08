import type { Project } from "../types/projects";

export const PROJECTS: {
  tools: Project[];
  external: Project[];
} = {
  tools: [
    {
      id: "decompile",
      title: "Decompile",
      period: {
        start: "05.2026",
      },
      link: "https://github.com/Admin12121/decompile",
      skills: [
        "Reverse Engineering",
        "Open Source",
        "CLI Tool",
        "Python",
        "Docker",
        "Ghidra",
        "JADX",
        "ILSpy",
      ],
      description: `[Open-source](https://github.com/Admin12121/decompile) One line command reverse-engineering tool with AI integration for unpacking, inspecting, and decompiling binaries and app packages.
- No local Ghidra/JADX/apktool/ILSpy setup; heavy tools run inside Docker
- Usage:
  - Run directly: \`uvx decompile ./file\` or \`pipx run decompile ./file\`
  - Install on Arch: \`paru -S decompile\`

| Input | Tooling | Output |
| --- | --- | --- |
| ELF, PE, EXE, DLL, SYS, Mach-O | Ghidra headless, objdump, optional AI cleanup | ASM, pseudocode C, enhanced C, summary |
| APK, AAB, DEX | JADX, apktool | Java/Kotlin source, resources, summary |
| JAR, WAR, EAR, \`.class\` | JADX | Java source, summary |
| .NET EXE/DLL | ilspycmd | C# source, summary |
| IPA, \`.app\` bundle | IPA/app extraction plus native analysis | Native output and app metadata |

`,
      isExpanded: true,
      isBeta: true,
    },
    {
      id: "encapsula",
      title: "Encapsula",
      period: {
        start: "10.2025",
      },
      link: "https://www.npmjs.com/package/encapsula",
      skills: [
        "Open Source",
        "Node.js",
        "TypeScript",
        "CLI Tool",
        "Steganography",
        "Encryption",
      ],
      description: `Lightweight and powerful steganography cli tool made using TypeScript. Easy access using <br/> \`npx encapsula\``,
    },
  ],
  external: [
    {
      id: "thevoxelanatomy",
      title: "Voxel Anatomy",
      period: {
        start: "4.2026",
      },
      link: "https://thevoxelanatomy.com/",
      skills: [
        "Next.js 15",
        "TypeScript",
        "Rust",
        "WebGL",
        "Three.js",
        "PostgreSQL",
        "Real-time APIs",
        "Performance Optimization",
      ],
      description: `High-performance 3D medical imaging platform combining frontend and backend expertise.
- Built full-stack with Next.js 15 (frontend) and Rust (backend services)
- Implemented WebGL-based volumetric rendering for real-time 3D slice navigation
- PostgreSQL database architecture for efficient imaging metadata management
`,
      logo: "https://thevoxelanatomy.com/_next/image?url=%2Flogo.webp&w=48&q=75",
      isExpanded: true,
    },
    {
      id: "paayonepal",
      title: "Paayo Nepal",
      period: {
        start: "3.2026",
      },
      link: "https://paayonepal.com/",
      skills: [
        "Next.js 16",
        "TypeScript",
        "Rust",
        "Geolocation APIs",
        "PostgreSQL GIS",
        "Content Management",
      ],
      description: `Content-heavy platform with advanced geolocation and data aggregation capabilities.
- Rust backend for high-performance geographical queries and distance calculations
- Custom content management system for blog posts, guides, and tourism data
`,
      logo: "https://paayonepal.com/logo.webp",
    },
    {
      id: "alphasuits",
      title: "Alpha Suits",
      period: {
        start: "2.2026",
      },
      link: "https://alphasuits.com.np/",
      skills: ["Next.js 16", "TypeScript", "Django", "Python", "Custom CRM"],
      description: `Full-stack e-commerce platform demonstrating modern web and backend architecture.
- Next.js 16 frontend with complex state management for cart, measurements, and orders
- Django REST API backend with custom CRM logic for artisan workflow management
`,
      logo: "https://alphasuits.com.np/logo.png",
    },
  ],
};
