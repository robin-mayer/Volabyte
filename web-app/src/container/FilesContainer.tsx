import React from "react";
import FileQuickActions from "../components/FileQuickActions";

const FilesContainer: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  return (
    <React.Fragment>
      <FileQuickActions accessToken={accessToken} />
    </React.Fragment>
  );
};

export default FilesContainer;
