import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import type React from "react";

interface SpeedDialProps {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

const UploadSpeedDial: React.FC<{ actions: SpeedDialProps[] }> = ({
  actions,
}) => {
  return (
    <SpeedDial
      icon={<SpeedDialIcon />}
      ariaLabel="SpeedDial upload"
      direction="right"
      FabProps={{
        sx: {
          width: 42,
          height: 42,
        },
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={"speeddialoption" + action.name}
          icon={action.icon}
          title={action.name}
          sx={{
            width: 42,
            height: 42,
          }}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

export default UploadSpeedDial;
