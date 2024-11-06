import React, { useState, useEffect } from "react";

export const ProjectForm = ({mode}) => {

    return (
        <div className={"project-form"}>
            {mode === "view" && <h1>View a project!</h1>}
            {mode === "edit" && <h1>Edit a project!</h1>}
            {mode === "add" && <h1>Add a new project!</h1>}
        </div>
    );
}