import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <AiOutlineLoading3Quarters className="text-dodger-blue-500 h-12 w-12 animate-spin" />
    </div>
  );
};

export default Loading;
