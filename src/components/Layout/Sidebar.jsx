import { BsInboxesFill } from "react-icons/bs";
import { RiFolderDownloadFill } from "react-icons/ri";
import { TbBinaryTree2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

import useUploadRequestStore from "@/stores/useUploadRequestStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const requests = useUploadRequestStore((state) => state.requests.length);

  return (
    <div className="w-48 flex-col border-r border-gray-200 bg-white shadow-sm md:flex">
      <div className="flex flex-1 flex-col">
        <nav className="flex flex-1 flex-col gap-10 rounded-2xl px-2 py-4">
          <div className="py-2.5">
            <a
              href="#"
              className="flex items-center px-4 text-gray-100"
              draggable="false"
            >
              <img
                src={logo}
                alt="Flash Drop Logo"
                className="h-auto w-auto"
                draggable="false"
              />
            </a>
          </div>

          <div className="flex flex-1 flex-col justify-between text-sm">
            <div className="mt-2 flex flex-col gap-3">
              <button
                className="sidebar-link cursor-pointer"
                onClick={() => navigate("/fileHistory")}
              >
                <RiFolderDownloadFill className="mr-3 text-xl" /> 받은 파일 기록
              </button>
              <button
                className="sidebar-link cursor-pointer"
                onClick={() => navigate("/linkManagement")}
              >
                <TbBinaryTree2 className="mr-3 text-xl" /> 링크 관리
              </button>
              <button
                className="sidebar-link cursor-pointer"
                onClick={() => navigate("/fileRequest")}
              >
                <BsInboxesFill className="mr-3 text-xl" /> 파일 요청함
                <span className="ml-3 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                  {requests}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
