import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";

export const ProjectDetails = () => {
    const projectId = useParams();

    return (
        <div className={"project-details"}>
            <h1>Project Details</h1>
        </div>
    );
}