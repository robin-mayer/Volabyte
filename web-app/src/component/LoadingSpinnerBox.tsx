import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinnerBox() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffffff",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c67b0" />
            <stop offset="100%" stopColor="#8034f2" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </Box>
  );
}
