import type { RecognitionEntry } from "../types/recognition";

const AWARDS: RecognitionEntry[] = [
  {
    key: "pentesternepals13thanniversaryctf",
    date: "2026-08",
    award: {
      title: "Pentester Nepal's 13th Anniversary CTF",
      organizer: "CVEPlayground",
      organizerURL: "https://cveplayground.com/",
      organizerLogoURL: "https://pentesternepal.com/_next/image?url=%2Flogo.png&w=384&q=75",
      prize: "Second Runner-Up",
      grade: "Team Sudo_Siblings",
      teamURL: "https://sudo-siblings.vercel.app",
      referenceLink: "https://lnkd.in/p/gS4FGQz6",
    },
  },
  {
    key: "kavachctf2026",
    date: "2026-07",
    award: {
      title: "KAVACH CTF 2026",
      organizer: "Yeti Cyber Operations",
      organizerLogoURL: "https://media.licdn.com/dms/image/v2/D4D0BAQEwrW7nR-BEWA/company-logo_200_200/B4DZfuYNfDG8AI-/0/1752051017366/yetisec_logo?e=1794441600&v=beta&t=_QHnkg0VmVqERQ8CyPAPNAxzJQvjIsBL4Y7_yu_uC6w",
      organizerURL: "https://www.yeticyberops.com.np/",
      prize: "First Runner-Up",
      grade: "Team Sudo_Siblings",
      teamURL: "https://sudo-siblings.vercel.app",
      referenceLink: "https://lnkd.in/p/gyvV7BYM"
    },
  },
  {
    key: "nepal-cyber-shield-2026-top-10",
    date: "2026-05",
    award: {
      title: "Hackअस्त्र 2026 National CTF",
      organizer: "Ethical HCK",
      organizerLogoURL: "/images/hackastra.png",
      organizerURL: "https://www.instagram.com/devcorps.ethicalhck/",
      prize: "Third runner-up",
      grade: "Team Sudo_Siblings",
      teamURL: "https://sudo-siblings.vercel.app",
      referenceLink: "https://ctftime.org/event/3270",
    },
  },
  {
    key: "nepal-cyber-shield-2026-top-10",
    date: "2026-04",
    award: {
      title: "Netanix CTF 2026",
      organizer: "Softwarica College of IT and E-commerce",
      organizerLogoURL: "https://netanixctf.com/logo.svg",
      organizerURL: "https://softwarica.edu.np",
      prize: "Winner",
      grade: "Team Sudo_Siblings",
      teamURL: "https://sudo-siblings.vercel.app",
      referenceLink: "https://www.linkedin.com/feed/update/urn:li:activity:7458044133451161600/"
    },
  },
  {
    key: "nepal-cyber-shield-2026-top-10",
    date: "2026-02",
    award: {
      title: "Navya Dhristi Hackathon 2026",
      organizer: "Cosmos College of Management and Technology",
      organizerURL: "https://cosmoscollege.edu.np",
      prize: "Second Runner-Up",
      referenceLink: "https://www.devpulse.info/news-and-articles/navya-drishti-hackathon-2026-empowering-innovation-and-creativity"
    },
  },
  {
    key: "nepal-cyber-shield-2026-top-10",
    date: "2026-01",
    award: {
      title: "त्रि 𝐊𝐨𝐝𝐞 Hackathon 2026",
      organizerLogoURL: "/images/trikode.png",
      organizer: "Softwarica College of IT and E-commerce",
      organizerURL: "https://softwarica.edu.np",
      prize: "First Runner-up",
      referenceLink: "https://lnkd.in/p/gdtsxeK8"
    },
  },
];

export const RECOGNITION: RecognitionEntry[] = AWARDS.sort(
  (a, b) => b.date.localeCompare(a.date)
);
