import Blog from "./blog";
import Project from "./projects";
import Skills from "./skills";
import Hero from "./hero";

const Home = () => {
  return (
    <>
      <Hero />
      <Skills />
      <Project />
      <Blog />
    </>
  );
};

export default Home;
