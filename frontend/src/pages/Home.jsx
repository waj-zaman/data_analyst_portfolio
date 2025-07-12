import React from "react";
import Hero from "../sections/Hero";
import ProjectPreview from "../sections/ProjectPreview";
import SQL from "../sections/SQL";
import Python from "../sections/Python";
import Contact from "../sections/Contact";
import { useRef } from "react";

function Home() {
  const contactRef = useRef(null);

  const handleScrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <Hero onContactClick={handleScrollToContact} />
        <ProjectPreview />
        
        <div className="flex flex-col lg:flex-row items-center justify-center text-center gap-8 lg:gap-12 mx-4 sm:mx-6 my-10">
          <SQL />
          <Python />
        </div>
        
        <Contact ref={contactRef} />
      </div>
    </>
  );
}

export default Home;
