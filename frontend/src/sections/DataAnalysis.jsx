import React from "react";

import ProjectPreview from "./ProjectPreview";
import SQL from "./SQL";
import Python from "./Python";


export const DataAnalysis = () => {


    return (
        <><ProjectPreview />
            <div className="flex flex-col lg:flex-row items-center justify-center text-center gap-8 lg:gap-12 mx-4 sm:mx-6 my-10">
                <SQL />
                <Python />
            </div>
        </>
    )
};