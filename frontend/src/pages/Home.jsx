import React from "react";
import Hero from "../sections/Hero";
import Contact from "../sections/Contact";
import { useRef, useState } from "react";
import { DataAnalysis } from "../sections/DataAnalysis";
import { WebDev } from "../sections/WebDev";

function Home() {
  const contactRef = useRef(null);
  const [isMernActive, setIsMernActive] = useState(true);


  const handleScrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <>
      <div>
        <Hero onContactClick={handleScrollToContact} />

        {/* Toggle Switch */}
        <div className="flex justify-center my-8 items">
          <div className="flex bg-base-200  w-full justify-evenly">
            <button
              onClick={() => setIsMernActive(true)}
              className={`py-2 px-6 font-heading rounded-md transition-all duration-300 ease-in-out text-2xl m-2 w-1/2 ${isMernActive ? 'bg-[#FFFBDE] text-black font-bold' : 'text-gray-500'
                }`}
            >
              Web Development
            </button>
            <button
              onClick={() => setIsMernActive(false)}
              className={`py-2 px-6 font-heading rounded-md transition-all duration-300 ease-in-out text-2xl w-1/2 m-2 ${!isMernActive ? 'bg-[#FFFBDE] text-black font-bold' : 'text-gray-400'
                }`}
            >
              Data Analysis
            </button>
          </div>
        </div>

        {/* Conditional Rendering */}
        {isMernActive ?
          (
            <>
              <WebDev />
            </>
          ) : (
            <>
              <DataAnalysis />
            </>
          )}

        <Contact ref={contactRef} isMernActive={isMernActive}/>
      </div>
    </>
  );
}

export default Home;
