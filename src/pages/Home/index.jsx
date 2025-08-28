import { ImFolderDownload } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">FlashDrop으로 파일 받기</h1>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <button
          onClick={() => navigate("/receiveFile")}
          type="button"
          className="flex cursor-pointer flex-col items-center rounded-xl bg-white p-4 shadow transition-all hover:shadow-md active:scale-95"
        >
          <ImFolderDownload className="text-dodger-blue-500 h-30 w-30" />
          <p className="mt-3 text-2xl text-gray-500">파일 받기 링크 생성</p>
        </button>
      </section>
    </div>
  );
};

export default Home;
