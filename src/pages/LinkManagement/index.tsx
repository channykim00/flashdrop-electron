import { useState, useEffect } from "react";
import { FaFolderOpen, FaFile } from "react-icons/fa";
import { FaLink, FaFloppyDisk } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";
import { IoFlash } from "react-icons/io5";
import { MdOutlineTimelapse, MdSubtitles, MdAccessTimeFilled } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbBinaryTree2 } from "react-icons/tb";
import { useLocation } from "react-router-dom";

import { CLIENT_URL, API_URL } from "../../constants";

import DeletePrompt from "@/components/DeletePrompt";
import SuccessModal from "@/components/SuccessModal";
import { FILE_TYPE_OPTIONS } from "@/constants";
import type { LinkItem } from "@/global";
import EditLinkModal from "@/pages/LinkManagement/EditLinkModal";
import type { LinkData } from "@/types/link";
import formatFileSize from "@/utils/formatFileSize";
import remainTimeFormat from "@/utils/remainTimeFormat";

const LinkManagement = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const location = useLocation();
  const defaultOpenId = location.state?.openId || null;
  const [openId, setOpenId] = useState(defaultOpenId);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);

  useEffect(() => {
    if (location.state?.openId) {
      setOpenId(location.state.openId);
    }
  }, [location.state?.openId]);

  useEffect(() => {
    window.api.getLinkList().then((loadedLinks) => {
      setLinks(loadedLinks || []);
    });
  }, []);

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsEditModalOpen(true);
  };

  const handleDeleteLink = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`${API_URL}/api/links/${deleteTarget?.uniqueUrl}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "삭제 실패");

      await window.api.deleteLinkData(deleteTarget.uniqueUrl);

      setLinks((prev) => prev.filter((link) => link.uniqueUrl !== deleteTarget.uniqueUrl));

      setDeleteTarget(null);
      setSuccessTitle("삭제 완료!");
      setSuccessMessage("링크가 성공적으로 삭제되었습니다.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSaveLink = async (updatedLink: LinkItem) => {
    try {
      const response = await fetch(`${API_URL}/api/links/${updatedLink.uniqueUrl}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLink),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "업데이트 실패");
      }

      const savedLink = result.link;

      setLinks((prev) =>
        prev.map((link) => (link.uniqueUrl === savedLink.uniqueUrl ? savedLink : link)),
      );

      await window.api.updateLinkData(savedLink);

      setIsEditModalOpen(false);
      setSuccessTitle("수정 완료!");
      setSuccessMessage("링크가 성공적으로 수정되었습니다.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("링크 업데이트 중 오류가 발생했습니다.");
    }
  };
  const isLinkExpired = (link: LinkItem) => {
    return remainTimeFormat(link.createdAt, link.expireTime) === "만료됨";
  };
  return (
    <div>
      {deleteTarget && (
        <DeletePrompt
          title="링크 삭제 확인"
          message={`"${deleteTarget.title || "제목 없음"}" 링크를 삭제하시겠습니까?`}
          onCancel={() => setDeleteTarget(null)}
          onDelete={handleDeleteLink}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          successTitle={successTitle}
          successMessage={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {isEditModalOpen && editingLink && (
        <EditLinkModal
          link={editingLink as LinkData} // LinkItem → LinkData로 타입 캐스팅
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedLink: LinkData) => {
            if (!editingLink) return;
            const mergedLink: LinkItem = { ...editingLink, ...updatedLink }; // 병합
            handleSaveLink(mergedLink);
          }}
        />
      )}
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <TbBinaryTree2 className="mr-1 text-xl" />
        링크 관리
      </h1>

      <section className="mt-6 mb-6 rounded border border-gray-200 bg-white p-4 shadow">
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200">
          <div className="bg-gray-100 px-4 py-3">
            <div className="flex justify-between gap-4 text-center">
              <div className="flex-1 text-sm text-gray-500">링크 제목</div>
              <div className="flex-[2] text-sm text-gray-500">주소</div>
              <div className="flex-[2] text-sm text-gray-500">폴더</div>
              <div className="text-sm text-gray-500">만료 기간</div>
            </div>
          </div>
          {links.length === 0 && (
            <div className="p-4 text-center text-gray-500">저장된 링크가 없습니다.</div>
          )}
          {links.map((link) => (
            <div
              key={link.uniqueUrl}
              className="text-sm"
            >
              <div
                className="group cursor-pointer rounded-lg px-4 py-3 text-center transition-colors hover:bg-gray-50"
                onClick={() => setOpenId(openId === link.uniqueUrl ? null : link.uniqueUrl)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 truncate font-medium text-gray-900">
                    {link.title || "제목 없음"}
                  </div>
                  <div className="flex-[2] truncate text-xs">
                    {CLIENT_URL}/{link.uniqueUrl}
                  </div>
                  <div className="flex-[2] truncate text-xs text-gray-500">{link.folderPath}</div>
                  <div className="text-xs whitespace-nowrap text-gray-500">
                    {remainTimeFormat(link.createdAt, link.expireTime)}
                  </div>
                </div>
              </div>

              {openId === link.uniqueUrl && (
                <div className="space-y-2 bg-gray-50 px-5 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <MdSubtitles />
                      링크 제목
                    </span>
                    <span>{link.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <FaLink />
                      링크 주소
                    </span>
                    <span>
                      {CLIENT_URL}/{link.uniqueUrl}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <FaFolderOpen />
                      저장 경로
                    </span>
                    <span>
                      <p className="bg-dodger-blue-100 inline-block rounded p-2 font-mono text-xs break-all text-blue-600">
                        {link.folderPath}
                      </p>
                      <button
                        className="bg-dodger-blue-500 hover:bg-dodger-blue-600 ml-3 cursor-pointer rounded px-3 py-1 text-xs text-white"
                        onClick={() => window.api.openFolder(link.folderPath)}
                      >
                        폴더 열기
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <MdOutlineTimelapse />
                      남은 시간
                    </span>
                    <span>{remainTimeFormat(link.createdAt, link.expireTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <MdAccessTimeFilled />
                      생성 시각
                    </span>
                    <span>{new Date(link.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <RiLockPasswordFill />
                      비밀번호
                    </span>
                    <span className={link.password ? "font-medium text-red-600" : "text-gray-600"}>
                      {link.password ? "🟢" : "🔴"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <IoIosPerson />
                      이름 요구
                    </span>
                    <span>{link.requireSenderName ? "🟢" : "🔴"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <IoFlash />
                      자동 수락
                    </span>
                    <span>{link.autoAccept ? "🟢" : "🔴"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-1 text-gray-500">
                      <FaFile />
                      허용 파일
                    </span>
                    <span className="flex flex-wrap gap-1">
                      {link.allowedFileTypeGroup === "all" ? (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          전체 허용
                        </span>
                      ) : (
                        (
                          FILE_TYPE_OPTIONS.find(
                            (option) => option.value === link.allowedFileTypeGroup,
                          )?.extensions || []
                        ).map((ext) => (
                          <span
                            key={ext}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {ext}
                          </span>
                        ))
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex w-32 items-center gap-2 text-gray-500">
                      <FaFloppyDisk />
                      최대 크기
                    </span>
                    <span>{formatFileSize(link.maxFileSize)}</span>
                  </div>
                  <div className="flex pt-4">
                    {!isLinkExpired(link) && (
                      <button
                        className="bg-dodger-blue-600 hover:bg-dodger-blue-700 mr-2 cursor-pointer rounded px-4 py-1.5 text-sm text-white"
                        onClick={() => handleEditLink(link)}
                      >
                        설정 수정
                      </button>
                    )}
                    <button
                      className="cursor-pointer rounded bg-red-500 px-4 py-1.5 text-sm text-white hover:bg-red-600"
                      onClick={() => setDeleteTarget(link)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LinkManagement;
