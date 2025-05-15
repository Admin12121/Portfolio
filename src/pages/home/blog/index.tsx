import { FlickeringGrid } from "@/components/global/fliker-grid";

const Blog = () => {
  return (
    <section id="blog">
      <div className="relative mx-auto container">
        <div className="text-center relative mx-auto border-x border-t overflow-hidden p-2 py-8 md:p-12">
          <h2 className="relative z-50 text-sm text-muted-foreground text-balance font-semibold tracking-tigh uppercase">
            Blog
          </h2>
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full"
            squareSize={4}
            gridGap={3}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={500}
            width={2100}
          />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-background dark:from-background z-10 from-50%"></div>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 relative md:grid-rows-1 md:grid-cols-3 border-b-[1.2px] border-t border-r">
        <div className="hidden md:grid top-0 left-0 -translate-y-1/2 w-full grid-cols-3 z-10 pointer-events-none select-none absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus w-8 h-8 text-neutral-300 translate-x-[16.5px] translate-y-[.5px] ml-auto dark:text-neutral-600"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus w-8 h-8 text-neutral-300 ml-auto translate-x-[16.5px] translate-y-[.5px] dark:text-neutral-600"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </div>
        <div className="justify-center border-l-[1.2px] min-h-[250px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-10">
          <div className="flex items-center gap-2 my-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-plug-zap w-4 h-4"
            >
              <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"></path>
              <path d="m2 22 3-3"></path>
              <path d="M7.5 13.5 10 11"></path>
              <path d="M10.5 16.5 13 14"></path>
              <path d="m18 3-4 4h6l-4 4"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              Framework Agnostic
            </p>
          </div>
          <div className="mt-2">
            <div className="max-w-full">
              <div className="flex gap-3 ">
                <p className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl">
                  Support for popular <strong>frameworks</strong>.
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-left text-muted-foreground">
              Supports popular frameworks, including React, Vue, Svelte, Astro,
              Solid, Next.js, Nuxt, Tanstack Start, Hono, and more.
              <a className="ml-2 underline" href="/docs" target="_blank">
                Learn more
              </a>
            </p>
          </div>
        </div>
        <div className="justify-center border-l-[1.2px] min-h-[250px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-10">
          <div className="flex items-center gap-2 my-1">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Authentication</p>
          </div>
          <div className="mt-2">
            <div className="max-w-full">
              <div className="flex gap-3 ">
                <p className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl">
                  Email &amp; Password <strong>Authentication</strong>.
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-left text-muted-foreground">
              Built-in support for email and password authentication, with
              session and account management features.
              <a className="ml-2 underline" href="/docs" target="_blank">
                Learn more
              </a>
            </p>
          </div>
        </div>
        <div className="justify-center border-l-[1.2px] min-h-[250px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-10">
          <div className="flex items-center gap-2 my-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-webhook w-4 h-4"
            >
              <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"></path>
              <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"></path>
              <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Social Sign-on</p>
          </div>
          <div className="mt-2">
            <div className="max-w-full">
              <div className="flex gap-3 ">
                <p className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl">
                  Support multiple <strong>OAuth providers</strong>.
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-left text-muted-foreground">
              Allow users to sign in with their accounts, including GitHub,
              Google, Discord, Twitter, and more.
              <a className="ml-2 underline" href="/docs" target="_blank">
                Learn more
              </a>
            </p>
          </div>
        </div>
        <div className="hidden md:grid -bottom-8 left-0 -translate-y-1/2 w-full grid-cols-3 z-10 pointer-events-none select-none absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus w-8 h-8 text-neutral-300 translate-x-[16.5px] translate-y-[.5px] ml-auto dark:text-neutral-600"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus w-8 h-8 text-neutral-300 ml-auto translate-x-[16.5px] translate-y-[.5px] dark:text-neutral-600"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Blog;
