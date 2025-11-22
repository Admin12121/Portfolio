import {
  isRouteErrorResponse,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { RootProvider } from "fumadocs-ui/provider/react-router";
import type { Route } from "./+types/root";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { HeadProvider, Head, Meta, LinkTag } from "./headmanager";
import { SITE_INFO, META_THEME_COLORS } from "@/config/site";
import { USER } from "@/features/profile/data/user";

import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HeadProvider
      initial={{
        title: `${USER.displayName} – ${USER.jobTitle}`,
        tags: [
          {
            name: "viewport",
            content: "width=device-width,initial-scale=1,viewport-fit=cover",
          },
          { name: "theme-color", content: META_THEME_COLORS.light },
          { name: "description", content: SITE_INFO.description },
          { name: "keywords", content: SITE_INFO.keywords.join(", ") },
          { property: "og:site_name", content: SITE_INFO.name },
          {
            property: "og:title",
            content: `${USER.displayName} – ${USER.jobTitle}`,
          },
          { property: "og:description", content: SITE_INFO.description },
          { property: "og:url", content: SITE_INFO.url },
          { property: "og:type", content: "profile" },
          { property: "profile:first_name", content: USER.firstName },
          { property: "profile:last_name", content: USER.lastName },
          { property: "profile:username", content: USER.username },
          { property: "profile:gender", content: USER.gender },
          { property: "og:image", content: SITE_INFO.ogImage },
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "twitter:title",
            content: `${USER.displayName} – ${USER.jobTitle}`,
          },
          { name: "twitter:description", content: SITE_INFO.description },
          { name: "twitter:image", content: SITE_INFO.ogImage },
        ],
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Admin12121</title>
        </head>
        <body className="flex flex-col min-h-screen">
          <Navbar />
          <RootProvider>{children}</RootProvider>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </HeadProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="max-w-screen overflow-x-hidden px-2">
      <div className="mx-auto md:max-w-3xl">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
