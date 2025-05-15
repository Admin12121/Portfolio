import { FlickeringGrid } from "@/components/global/fliker-grid";

const Skills = () => {
  return (
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
  )
}

export default Skills