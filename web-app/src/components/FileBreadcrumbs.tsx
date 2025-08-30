import React from "react";
import type { Breadcrumb } from "../types/Breadcrumb";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Breadcrumbs } from "@mui/material";

const FileBreadcrumbs: React.FC<{
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: any;
}> = ({ breadcrumbs, setBreadcrumbs }) => {
  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
      fontSize: "1rem",
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: (theme.vars || theme).palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
        ...theme.applyStyles("dark", {
          backgroundColor: emphasize(theme.palette.grey[800], 0.06),
        }),
      },
      "&:active": {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
        ...theme.applyStyles("dark", {
          backgroundColor: emphasize(theme.palette.grey[800], 0.12),
        }),
      },
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    };
  }) as typeof Chip;

  function handleClick(id: number | null) {
    if (id) {
      const index = breadcrumbs.findIndex((b) => b.id === id);
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    } else {
      setBreadcrumbs([]);
    }
  }

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          label="/"
          onClick={() => handleClick(null)}
        />
        {breadcrumbs.map((breadcrumb) => (
          <StyledBreadcrumb
            key={"breadcrumb_" + breadcrumb.id}
            component="a"
            label={breadcrumb.name}
            onClick={() => handleClick(breadcrumb.id)}
          />
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default FileBreadcrumbs;
