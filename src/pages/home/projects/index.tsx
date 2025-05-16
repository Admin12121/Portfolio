import { FlickeringGrid } from "@/components/global/fliker-grid";
import { ShoppingCart, KeyRound, Terminal } from "lucide-react";

const project = [
  {
    title: "Nepal Heritage Handicrafts",
    type: "E-commerce",
    icons: ShoppingCart,
    description: "An e-commerce platform built with Next.js, Django, and MySQL. Focused on the experience and performance.",
    image: "/ecom.jpeg",
  },
  {
    title: "Password Manager",
    type: "Tools & Utilities",
    icons: KeyRound,
    description: "A password manager built with multi-layer of encryption and Next.js. Focused on security and performance.",
    image: "/pm.jpeg",
  },
  {
    title: "Zone",
    type: "Social Media",
    icons: Terminal,
    description: "A social media platform built with Next.js. To connect Freshers and Developers to share their knowledge and experience.",
    image: "/pm.jpeg",
  },
]

const Project = () => {
  return (
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
        {project.map((item, index) => (
          <div key={index} className="justify-center border-l-[1.2px] min-h-[570px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col">
            <div className="p-6">
              <div className="relative">
                <img
                  src={item.image}
                  loading="lazy"
                  alt=""
                  className="w-full h-[350px] object-cover"
                />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-background dark:from-background z-10 from-10%"></div>
              </div>
              <div className="flex items-center gap-2 my-1">
                <item.icons className="w-4 h-4"/>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.type}
                </p>
              </div>
              <div className="mt-2">
                <div className="max-w-full">
                  <div className="flex gap-3 ">
                    <p className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl">
                      {item.title}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-left text-muted-foreground">
                  {item.description}
                  <a className="ml-2 underline" href="/docs" target="_blank">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>
        ))}
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

export default Project;
