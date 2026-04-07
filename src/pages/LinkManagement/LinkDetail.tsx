import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaFolderOpen } from "react-icons/fa6";
import { IoTimeSharp } from "react-icons/io5";
import { MdOutlineStorage } from "react-icons/md";
import { MdAutorenew } from "react-icons/md";
import { PiSubtitlesFill } from "react-icons/pi";
import { RiCloseLargeLine } from "react-icons/ri";
import { useParams } from "react-router-dom";

import ErrorModal from "@/components/ErrorModal";
import Loading from "@/components/Loading";
import type { LinkItem } from "@/types/link";
import formatFileSize from "@/utils/formatFileSize";
import fullUrl from "@/utils/fullUrl";

const LinkDetail = () => {
  const { uniqueUrl } = useParams();
  const [link, setLink] = useState<LinkItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    if (!link) return;

    navigator.clipboard
      .writeText(fullUrl(link.uniqueUrl))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("복사 실패:", err);
      });
  };

  useEffect(() => {
    const fetchLink = async () => {
      if (!uniqueUrl) {
        setError("잘못된 링크입니다.");
        setLoading(false);
        return;
      }

      try {
        const result = await window.api.getLinkByUniqueUrl(uniqueUrl);
        if (!result) {
          setError("링크 정보를 찾을 수 없습니다.");
        } else {
          setLink(result);
        }
      } catch {
        setError("링크 로딩 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [uniqueUrl]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <ErrorModal
        errorTitle="링크 로딩 오류"
        errorMessage={error}
        onClose={() => setError(null)}
      />
    );
  }
  if (!link) {
    return (
      <div className="p-4 text-gray-500">링크 정보를 불러오는 중이거나 존재하지 않습니다.</div>
    );
  }

  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold text-gray-800">링크 상세 정보</h1>
      <section>
        <div className="space-y-3 rounded-lg bg-white p-4 shadow">
          <div className="relative mt-4 w-full max-w-sm min-w-[200px]">
            <label className="mb-2 block text-sm text-slate-600">링크 주소</label>

            <div className="relative">
              <input
                type="text"
                value={fullUrl(link.uniqueUrl)}
                disabled
                className="ease w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 py-2 pr-20 pl-3 text-sm text-slate-500 shadow-sm transition duration-300 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="bg-dodger-blue-500 hover:bg-dodger-blue-600 focus:bg-dodger-blue-600 active:bg-dodger-blue-700 absolute top-1 right-1 flex cursor-pointer items-center gap-1 rounded border border-transparent px-2.5 py-1 text-sm text-white shadow-sm transition-all hover:shadow focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                <FaCopy /> 복사
              </button>

              {copied && (
                <span className="absolute -top-6 right-1 text-xs font-medium text-green-600">
                  복사됨!
                </span>
              )}
            </div>
          </div>

          <hr className="my-6 border-t border-gray-300" />

          <div className="space-y-2 text-sm text-gray-700">
            <div className="mb-5 flex items-center gap-2">
              <PiSubtitlesFill className="text-dodger-blue-500 text-lg" />
              <span className="w-32 font-medium">링크 제목</span>
              <span>{link.title}</span>
            </div>
            <div className="mb-5 flex items-center gap-2">
              <FaFolderOpen className="text-dodger-blue-500 text-lg" />
              <span className="w-32 font-medium">폴더 경로</span>
              <span className="bg-dodger-blue-100 rounded-lg px-3 py-2 text-xs">
                {link.folderPath}
              </span>
              <span>
                <button
                  className="bg-dodger-blue-500 hover:bg-dodger-blue-600 focus:ring-dodger-blue-300 cursor-pointer rounded-md px-3 py-1 text-xs font-semibold text-white shadow-sm transition focus:ring-2 focus:outline-none"
                  onClick={() => window.api.openFolder(link.folderPath)}
                >
                  폴더 열기
                </button>
              </span>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <IoTimeSharp className="text-dodger-blue-500 text-lg" />
              <span className="w-32 font-medium">만료 시간</span>
              <span>{link.expireTime}분</span>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <MdOutlineStorage className="text-dodger-blue-500 text-lg" />
              <span className="w-32 font-medium">최대 파일 크기</span>
              <span>{formatFileSize(link.maxFileSize)}</span>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <MdAutorenew className="text-dodger-blue-500 text-lg" />
              <span className="w-32 font-medium">자동 수락</span>
              <span>{link.autoAccept ? <FaCheck /> : <RiCloseLargeLine />}</span>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <FaUser className="text-dodger-blue-500 text-lg" />
              <span className="w-32 font-medium">전송자 이름 요구</span>
              <span>{link.requireSenderName ? <FaCheck /> : <RiCloseLargeLine />}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LinkDetail;
