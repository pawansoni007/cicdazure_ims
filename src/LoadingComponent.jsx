import { CircularProgress } from "@mui/material";

const indicatorSize = 80;
const LoadingComponent = () => {
  return (
    <div id="root">
      <span className="text-loading">
        <CircularProgress
          color="inherit"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: `${-indicatorSize / 2}px`,
            marginLeft: `${-indicatorSize / 2}px`,
          }}
        />
      </span>
    </div>
  );
};

export default LoadingComponent;
