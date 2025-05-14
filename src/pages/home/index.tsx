import { FlickeringGrid } from "@/components/global/fliker-grid";
import Partical from "@/components/global/partial";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="w-full pb-16 text-center lg:pb-0">
        <div className="flex">
          <div className="relative w-[159px] border-r p-1 max-lg:hidden 2xl:flex-1">
            {/* <div
              className="h-full w-full border-2 border-dashed"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888888' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div> */}
          </div>
          <div className="container  mx-auto p-6 lg:p-12 pt-16 pb-12 text-start md:pt-20 lg:pt-28">
            <h1 className="max-w-[500px] text-[2.5rem] leading-[1.2] tracking-[-1.6px] text-balance md:text-[4rem] md:!leading-[1.15] md:tracking-[-4.32px] lg:text-7xl">
              Hello, I'm Vicky
            </h1>
            <p className="text-2xl text-muted-foreground mt-5 max-w-[500px] leading-[1.5] tracking-[-0.32px] md:mt-6">
              I am a full stack developer with a passion for building things. I
              love to learn new technologies and improve my skills.
            </p>
            <Link
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-zinc-600 h-9 px-4 py-2 mt-6 gap-1 md:mt-8 lg:mt-10"
              to="/dashboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" x2="20" y1="19" y2="19"></line>
              </svg>
              Let's Talk
            </Link>
          </div>
          <div className="relative w-[159px] p-1 max-lg:hidden border-r-0 border-l 2xl:flex-1">
            {/* <div
              className="h-full w-full border-2 border-dashed"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888888' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div> */}
          </div>
        </div>
        <div className="flex h-8 gap-1 max-lg:hidden">
          <div className="flex-1 border" />
          <div
            className="h-full border-2 border-dashed w-52"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888888' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="w-24 border" />
          <div
            className="h-full border-2 border-dashed w-52"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888888' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="w-24 border" />
          <div
            className="h-full border-2 border-dashed w-52"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888888' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="flex-1 border" />
        </div>
      </section>
      <section id="skills">
        <div className="relative mx-auto container">
          <div className="text-center relative mx-auto border-x border-t overflow-hidden p-2 py-8 md:p-12">
            <h2 className="relative z-50 text-sm text-muted-foreground text-balance font-semibold tracking-tigh uppercase">
              Skills
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
        <div className="relative mx-auto container">
          <div className="border-x border-t">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              <div className="flex group items-center justify-center p-4 border-r border-t last:border-r-0 sm:last:border-r md:[&amp;:nth-child(3n)]:border-r md:[&amp;:nth-child(6n)]:border-r-0 md:[&amp;:nth-child(3)]:border-r [&amp;:nth-child(-n+2)]:border-t-0 sm:[&amp;:nth-child(-n+3)]:border-t-0 sm:[&amp;:nth-child(3n)]:border-r-0 md:[&amp;:nth-child(-n+6)]:border-t-0 [&amp;:nth-child(2n)]:border-r-0 sm:[&amp;:nth-child(2n)]:border-r">
                <div
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 ease-in-out opacity-30 hover:opacity-100"
                  style={{
                    opacity: 1,
                    willChange: "opacity, transform",
                    transform: "none",
                  }}
                >
                  <img
                    alt="python"
                    loading="lazy"
                    width="112"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className="h-10 w-14"
                    style={{ color: "transparent;" }}
                    src="https://skillicons.dev/icons?i=python"
                  />
                  <h1 className="text-2xl select-none ">Python</h1>
                </div>
              </div>
              <div className="flex group items-center justify-center p-4 border-r border-t last:border-r-0 sm:last:border-r md:[&amp;:nth-child(3n)]:border-r md:[&amp;:nth-child(6n)]:border-r-0 md:[&amp;:nth-child(3)]:border-r [&amp;:nth-child(-n+2)]:border-t-0 sm:[&amp;:nth-child(-n+3)]:border-t-0 sm:[&amp;:nth-child(3n)]:border-r-0 md:[&amp;:nth-child(-n+6)]:border-t-0 [&amp;:nth-child(2n)]:border-r-0 sm:[&amp;:nth-child(2n)]:border-r">
                <div
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 ease-in-out opacity-30 hover:opacity-100"
                  style={{
                    opacity: 1,
                    willChange: "opacity, transform",
                    transform: "scale(0.911768)",
                  }}
                >
                  <img
                    alt="django"
                    loading="lazy"
                    width="112"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className="h-10 w-14"
                    style={{ color: "transparent;" }}
                    src="https://skillicons.dev/icons?i=django"
                  />
                  <h1 className="text-2xl select-none ">Django</h1>
                </div>
              </div>
              <div className="flex group items-center justify-center p-4 border-r border-t last:border-r-0 sm:last:border-r md:[&amp;:nth-child(3n)]:border-r md:[&amp;:nth-child(6n)]:border-r-0 md:[&amp;:nth-child(3)]:border-r [&amp;:nth-child(-n+2)]:border-t-0 sm:[&amp;:nth-child(-n+3)]:border-t-0 sm:[&amp;:nth-child(3n)]:border-r-0 md:[&amp;:nth-child(-n+6)]:border-t-0 [&amp;:nth-child(2n)]:border-r-0 sm:[&amp;:nth-child(2n)]:border-r">
                <div
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 ease-in-out opacity-30 hover:opacity-100"
                  style={{
                    opacity: 1,
                    willChange: "opacity, transform",
                    transform: "none",
                  }}
                >
                  <img
                    alt="react"
                    loading="lazy"
                    width="112"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className="h-10 w-14"
                    style={{ color: "transparent;" }}
                    src="https://skillicons.dev/icons?i=react"
                  />
                  <h1 className="text-2xl select-none ">React</h1>
                </div>
              </div>
              <div className="flex group items-center justify-center p-4 border-r border-t last:border-r-0 sm:last:border-r md:[&amp;:nth-child(3n)]:border-r md:[&amp;:nth-child(6n)]:border-r-0 md:[&amp;:nth-child(3)]:border-r [&amp;:nth-child(-n+2)]:border-t-0 sm:[&amp;:nth-child(-n+3)]:border-t-0 sm:[&amp;:nth-child(3n)]:border-r-0 md:[&amp;:nth-child(-n+6)]:border-t-0 [&amp;:nth-child(2n)]:border-r-0 sm:[&amp;:nth-child(2n)]:border-r">
                <div
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 ease-in-out opacity-30 hover:opacity-100"
                  style={{
                    opacity: 1,
                    willChange: "opacity, transform",
                    transform: "scale(0.985737)",
                  }}
                >
                  <img
                    alt="nextjs"
                    loading="lazy"
                    width="112"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className="h-10 w-14"
                    style={{ color: "transparent;" }}
                    src="https://skillicons.dev/icons?i=nextjs"
                  />
                  <h1 className="text-2xl select-none ">Nextjs</h1>
                </div>
              </div>
              <div className="flex group items-center justify-center p-4 border-r border-t last:border-r-0 sm:last:border-r md:[&amp;:nth-child(3n)]:border-r md:[&amp;:nth-child(6n)]:border-r-0 md:[&amp;:nth-child(3)]:border-r [&amp;:nth-child(-n+2)]:border-t-0 sm:[&amp;:nth-child(-n+3)]:border-t-0 sm:[&amp;:nth-child(3n)]:border-r-0 md:[&amp;:nth-child(-n+6)]:border-t-0 [&amp;:nth-child(2n)]:border-r-0 sm:[&amp;:nth-child(2n)]:border-r">
                <div
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 ease-in-out opacity-30 hover:opacity-100"
                  style={{
                    opacity: 1,
                    willChange: "opacity, transform",
                    transform: "none",
                  }}
                >
                  <img
                    alt="mysql"
                    loading="lazy"
                    width="112"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className="h-10 w-14 "
                    style={{ color: "transparent;" }}
                    src="https://skillicons.dev/icons?i=mysql"
                  />
                  <h1 className="text-2xl select-none ">Mysql</h1>
                </div>
              </div>
              <div className="flex group items-center justify-center p-4 border-r border-t last:border-r-0 sm:last:border-r md:[&amp;:nth-child(3n)]:border-r md:[&amp;:nth-child(6n)]:border-r-0 md:[&amp;:nth-child(3)]:border-r [&amp;:nth-child(-n+2)]:border-t-0 sm:[&amp;:nth-child(-n+3)]:border-t-0 sm:[&amp;:nth-child(3n)]:border-r-0 md:[&amp;:nth-child(-n+6)]:border-t-0 [&amp;:nth-child(2n)]:border-r-0 sm:[&amp;:nth-child(2n)]:border-r">
                <div
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 ease-in-out opacity-30 hover:opacity-100"
                  style={{
                    opacity: 1,
                    willChange: "opacity, transform",
                    transform: "scale(0.951139)",
                  }}
                >
                  <img
                    alt="docker"
                    loading="lazy"
                    width="112"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className="h-10 w-14"
                    style={{ color: "transparent;" }}
                    src="https://skillicons.dev/icons?i=docker"
                  />
                  <h1 className="text-2xl select-none ">Docker</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="projects">
        <div className="relative mx-auto container">
          <div className="text-center relative mx-auto border-x border-t overflow-hidden p-2 py-8 md:p-12">
            <h2 className="relative z-50 text-sm text-muted-foreground text-balance font-semibold tracking-tigh uppercase">
              Projects
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
        <div className="relative mx-auto container border border-b-0 grid grid-rows-1">
          <div className="grid grid-rows-1 gap-y-3 p-10">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-center">
              Featured Projects
            </h1>
            <p className="text-xl md:text-2xl font-bold tracking-tighter text-center text-neutral-500">
              Focused on the experience.
            </p>
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
          <div className="justify-center border-l-[1.2px] min-h-[570px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col">
            <div className="p-6">
              <div className="relative">
                <img
                  src="/ecom.jpeg"
                  alt=""
                  className="w-full h-[350px] object-cover"
                />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-background dark:from-background z-10 from-10%"></div>
              </div>
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
                  Supports popular frameworks, including React, Vue, Svelte,
                  Astro, Solid, Next.js, Nuxt, Tanstack Start, Hono, and more.
                  <a className="ml-2 underline" href="/docs" target="_blank">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="justify-center border-l-[1.2px] min-h-[570px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-6">
            <div className="relative">
              <img
                src="/pm.jpeg"
                alt=""
                className="w-full h-[350px] object-cover"
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-background dark:from-background z-10 from-10%"></div>
            </div>
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
          <div className="justify-center border-l-[1.2px] min-h-[570px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-6">
            <div className="relative">
              <img
                src="/ecom.jpeg"
                alt=""
                className="w-full h-[350px] object-cover"
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-background dark:from-background z-10 from-10%"></div>
            </div>

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
                Supports popular frameworks, including React, Vue, Svelte,
                Astro, Solid, Next.js, Nuxt, Tanstack Start, Hono, and more.
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
      <section id="footer">
        <div className="relative mx-auto container p-2 border-l border-r flex justify-between items-center">
          <Link
            to="/"
            className="md:px-5 px-2.5 py-4 text-foreground md:col-span-2 shrink-0 transition-colors md:w-[268px] lg:w-[286px]"
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <p className="select-none flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" x2="20" y1="19" y2="19"></line>
                  </svg>
                  VICKY TAJPURIYA.
                </p>
              </div>
            </div>
          </Link>
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/"
              className="text-foreground md:col-span-2 shrink-0 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4em"
                height="1.4em"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"
                ></path>
              </svg>
            </Link>
            <Link
              to="/"
              className="text-foreground md:col-span-2 shrink-0 transition-colors"
            >
              <svg
                className="dark:fill-white fill-black"
                height="1.8em"
                width="1.8em"
                version="1.1"
                id="Shopicons"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 48 48"
                xmlSpace="preserve"
              >
                <g>
                  <path className="st0 fill-none" d="M0,0h48v48H0V0z" />
                  <path
                    d="M34,4H14C8.5,4,4,8.5,4,14v20c0,5.5,4.5,10,10,10h20c5.5,0,10-4.5,10-10V14C44,8.5,39.5,4,34,4z M17,35h-4V20h4V35z M15,17
		c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C17,16.1,16.1,17,15,17z M35,35h-4v-7.5c0-2.5-1-3.6-3-3.6L24,24v11h-4V20l8-0.2
		c3.4,0,7,2,7,7.6V35z"
                  />
                </g>
              </svg>
            </Link>
          </div>
        </div>
        <div className="mx-auto px-5 text-muted-foreground-subtle container border-x border-t border-b py-4 text-sm tracking-[-0.28px] lg:py-8"><p> ©2025 Relative. All rights reserved.</p></div>
        <div className="mx-auto px-5 text-muted-foreground-subtle container border-x border-t border-b py-4 text-sm tracking-[-0.28px] lg:py-8">
          {/* <Partical/> */}
        </div>
      </section>
    </>
  );
};

export default Home;
