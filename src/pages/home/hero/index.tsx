import { Link } from "react-router-dom";

const Hero = () => {
  return (
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
  );
};

export default Hero;
