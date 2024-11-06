import ppLoaderIcon from "../assets/images/hcp_loader.png";

function InterfaceLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img className="text-xs" src={ppLoaderIcon} alt={"loader-icon"} />
    </div>
  );
}

export default InterfaceLoader;
