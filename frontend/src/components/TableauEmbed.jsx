import React, { useRef, useEffect } from 'react';

const tableau = window.tableau;

function TableauEmbed({ url }) {
  const ref = useRef(null);
  const vizRef = useRef(null);

  function initViz() {
    if (!tableau || !ref.current || !url) {
      console.error("Tableau JS API not available or missing URL");
      return;
    }

    // Dispose existing viz if any
    if (vizRef.current) {
      vizRef.current.dispose();
    }

    vizRef.current = new tableau.Viz(ref.current, url, {
      width: '100%',
      height: ref.current.offsetHeight,
      hideTabs: true,
      hideToolbar: false,
      onFirstInteractive: () => {
        console.log("Viz is interactive!");
      }
    });
  }

  useEffect(() => {
    initViz();

    return () => {
      if (vizRef.current) {
        vizRef.current.dispose();
      }
    };
  }, [url]);

  return (
    <div
      className="
        w-full
        h-[600px]
        sm:h-[700px]
        md:h-[800px]
        lg:h-[900px]
        xl:h-[1000px]
        2xl:h-[1100px]
        rounded-xl
        overflow-hidden
        shadow-lg
        bg-base-200
      "
      ref={ref}
    />
  );
}

export default TableauEmbed;
