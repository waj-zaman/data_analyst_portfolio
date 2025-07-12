import React from "react";
import heroImg from "../assets/heroImg.png";

function Hero({ onContactClick }) {
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-28 lg:py-32">
        
        {/* Text */}
        <div className="w-full max-w-lg lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-black mb-4">
            Wajahath Zaman
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-body mb-6">
            A data analyst who turns raw data into strategic insights using tools like SQL, Python, Excel, and Tableau — empowering business decisions with clarity, confidence, and real-world impact.
          </p>
          <button
            onClick={onContactClick}
            className="btn btn-outline text-black text-lg md:text-xl mt-2 md:mt-4 font-heading hover:text-[#FFFBDE] px-6 py-3"
          >
            Ping Me
          </button>
        </div>

        {/* Image */}
        <div className="w-full max-w-sm lg:w-1/3">
          <img
            className="rounded-3xl drop-shadow-2xl w-full"
            src={heroImg}
            alt="Wajahath Zaman"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
