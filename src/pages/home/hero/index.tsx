import { BlurFade } from "@/components/global/fade-in-out";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full text-center ">
      <div className="container relative border-l border-r  mx-auto p-6 lg:p-12 pt-16 pb-12 text-start md:pt-20 lg:pt-28">
        <BlurFade delay={0.1} inView>
          <h1 className="max-w-[500px] text-[2.5rem] leading-[1.2] tracking-[-1.6px] text-balance md:text-[4rem] md:!leading-[1.15] md:tracking-[-4.32px] lg:text-7xl">
            Hello, I'm Vicky
          </h1>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <p className="text-2xl text-muted-foreground mt-5 max-w-[500px] leading-[1.5] tracking-[-0.32px] md:mt-6">
            I am a full stack developer with a passion for building things. I
            love to learn new technologies and improve my skills.
          </p>
        </BlurFade>
        <BlurFade delay={0.3} inView>
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
        </BlurFade>
      </div>
    </section>
  );
};

export default Hero;
