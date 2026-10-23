import type { Project } from "../types/projects";

export const PROJECTS: {
  tools: Project[];
} = {
  tools: [
    {
      id: "rooms24",
      title: "Rooms24",
      period: {
        start: "7.2026",
      },
      link: "https://rooms24.app/",
      skills: ["Next.js", "TypeScript", "Rust", "PostgreSQL"],
      description: `Co-founded Rooms24, an all-in-one hospitality SaaS platform designed to help Owners to manage their operations from a single system.
- Centralized property management with reservations, restaurant POS, and dedicated business websites
- Unified communication hub integrating WhatsApp, Facebook, Instagram, email, and other messaging channels
- Booking channel integrations including Booking.com, Airbnb, and Google Hotels
- Built with Next.js, Rust, and PostgreSQL using a multi-tenant SaaS architecture`,
      logo: "/images/rooms24.webp",
      isExpanded: true,
    },
    {
      id: "decompile",
      title: "Decompile ⫻ { Reverse Engineering Tool }",
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
      isBeta: true,
    },
    {
      id: "venom",
      title: "Venom ⫻ { C2 Framework }",
      period: {
        start: "10.2026",
      },
      link: "https://github.com/Admin12121/venom",
      skills: [
        "Open Source",
        "Rust",
        "C2 Framework",
        "Command and Control",
        "Red Teaming",
      ],
      description: `Rust-based experimental Command and Control (C2) framework developed to study adversary communication techniques and remote command execution in controlled research environments.
- Explores the use of Discord and GitHub as alternative C2 communication channels
- Demonstrates how remote commands are delivered, executed, and their results communicated
- Investigates how legitimate public platforms can be repurposed as command infrastructure during adversary operations
- Built for cybersecurity research, red teaming education, and understanding C2 behavior`,
    },
    {
      id: "bhumirajestates",
      title: "BhumiRaj Estates",
      period: {
        start: "9.2026",
        end: "10.2026",
      },
      link: "https://bhumirajestates.com.np/",
      skills: [
        "Next.js",
        "TypeScript",
        "NestJS",
        "PostgreSQL",
        "Custom CRM",
      ],
      description: `Full-service real estate platform connecting property buyers, sellers, renters, and owners through a unified digital experience.
- Property discovery and listing management for buying, selling, and renting real estate
- Built with Next.js and TypeScript for the frontend, backed by NestJS and PostgreSQL
- Custom CRM architecture supporting property management, customer inquiries, and real estate workflows`,
      logo: "/images/bhumirajestate.webp",
    },
    {
      id: "nepanova",
      title: "NepaNova",
      period: {
        start: "5.2026",
        end: "6.2026",
      },
      link: "https://nepanova.com/",
      skills: [
        "Next.js",
        "TypeScript",
        "Django",
        "Python",
        "PostgreSQL",
        "E-commerce",
      ],
      description: `Full-stack e-commerce platform developed for NepaNova, a premium Nepali tea brand, to connect with domestic and international customers in collaboration with the National Innovation Center.
- Online storefront showcasing premium Nepali tea products for national and international markets
- Next.js and TypeScript frontend with Django-powered backend services
- PostgreSQL-based architecture supporting product catalogs, customer management, and e-commerce operations`,
      logo: "https://nepanova.com/logo.png",
    },
    {
      id: "thevoxelanatomy",
      title: "Voxel Anatomy",
      period: {
        start: "4.2026",
        end: "9.2026",
      },
      link: "https://thevoxelanatomy.com/",
      skills: [
        "Next.js",
        "TypeScript",
        "Rust",
        "WebGL",
        "Three.js",
        "PostgreSQL",
      ],
      description: `High-performance 3D medical imaging platform combining frontend and backend expertise.
  - Built full-stack with Next.js (frontend) and Rust (backend services)
  - Implemented WebGL-based volumetric rendering for real-time 3D slice navigation
  - PostgreSQL database architecture for efficient imaging metadata management
  `,
      logo: "https://thevoxelanatomy.com/_next/image?url=%2Flogo.webp&w=48&q=75",
    },
    {
      id: "paayonepal",
      title: "Paayo Nepal",
      period: {
        start: "3.2026",
        end: "5.2026",
      },
      link: "https://paayonepal.com/",
      skills: [
        "Next.js",
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
      id: "encapsula",
      title: "Encapsula ⫻ { Steganography CLI Tool }",
      period: {
        start: "10.2025",
        end: "10.2025",
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
};
