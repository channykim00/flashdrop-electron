import { useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import { FILE_TYPE_OPTIONS } from "@/constants";
import type { LinkData } from "@/types/link";

interface EditLinkModalProps {
  link: LinkData;
  onClose: () => void;
  onSave: (updatedLink: LinkData) => void | Promise<void>;
}

const EditLinkModal = ({ link, onClose, onSave }: EditLinkModalProps) => {
  const [title, setTitle] = useState(link.title || "");
  const [folderPath, setFolderPath] = useState(link.folderPath || "");
  const [expireTime, setExpireTime] = useState(link.expireTime || 0);
  const [password, setPassword] = useState(link.password || "");
  const [maxFileSize, setMaxFileSize] = useState(link.maxFileSize || 0);
  const [autoAccept, setAutoAccept] = useState(link.autoAccept || false);
  const [requireSenderName, setRequireSenderName] = useState(link.requireSenderName || false);
  const [allowedFileTypeGroup, setAllowedFileTypeGroup] = useState(
    link.allowedFileTypeGroup || "all",
  );

  const handleSelectFolder = async () => {
    const selected: string | null = await window.api.selectFolder();
    if (selected) setFolderPath(selected);
  };

  const handleSubmit = () => {
    const updated: LinkData = {
      ...link,
      title,
      folderPath,
      expireTime: Number(expireTime),
      password: password || null,
      allowedFileTypeGroup,
      maxFileSize,
      autoAccept,
      requireSenderName,
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-300 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">링크 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="cursor-pointer text-xl" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-6 text-sm text-gray-700">
          {/* 제목 */}
          <div>
            <label className="mb-1 block font-medium">링크 제목</label>
            <input
              className="w-full rounded border border-gray-400 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목 없음"
            />
          </div>

          {/* 저장 폴더 */}
          <div>
            <label className="mb-1 block font-medium">저장 폴더</label>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded border border-gray-400 px-3 py-2"
                value={folderPath}
                readOnly
              />
              <button
                onClick={handleSelectFolder}
                className="bg-dodger-blue-500 hover:bg-dodger-blue-600 cursor-pointer rounded px-3 py-2 text-xs text-white"
              >
                <FaFolderOpen className="mr-1 inline-block" />
                폴더 선택
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="mb-1 block font-medium">비밀번호</label>
            <input
              className="w-full rounded border border-gray-400 px-3 py-2"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="없음"
            />
          </div>

          {/* 만료 시간 */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">만료 시간</label>
            <select
              className="w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
              value={expireTime || 60}
              onChange={(e) => setExpireTime(Number(e.target.value))}
            >
              <option value={30}>30분</option>
              <option value={60}>1시간</option>
              <option value={120}>2시간</option>
              <option value={360}>6시간</option>
              <option value={720}>12시간</option>
              <option value={1440}>24시간</option>
            </select>
          </div>

          {/* 허용 파일 형식 */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">허용 파일 형식</label>
            <select
              value={allowedFileTypeGroup}
              className="w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
              onChange={(e) => setAllowedFileTypeGroup(e.target.value)}
            >
              {FILE_TYPE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 파일 용량 */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">파일 용량</label>
            <select
              className="w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(Number(e.target.value))}
            >
              <option value={10 * 1024 * 1024}>10MB</option>
              <option value={100 * 1024 * 1024}>100MB</option>
              <option value={500 * 1024 * 1024}>500MB</option>
              <option value={1 * 1024 * 1024 * 1024}>1GB</option>
              <option value={2 * 1024 * 1024 * 1024}>2GB</option>
            </select>
          </div>

          {/* 자동 수락 */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">자동 수락</label>
            <input
              type="checkbox"
              checked={autoAccept}
              onChange={(e) => setAutoAccept(e.target.checked)}
              className="text-dodger-blue-500 focus:ring-dodger-blue-500 h-5 w-5 rounded border-gray-300"
            />
          </div>

          {/* 전송자 이름 받기 */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">전송자 이름 받기</label>
            <input
              type="checkbox"
              checked={requireSenderName}
              onChange={(e) => setRequireSenderName(e.target.checked)}
              className="text-dodger-blue-500 focus:ring-dodger-blue-500 h-5 w-5 rounded border-gray-300"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 border-t border-gray-300 px-5 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="bg-dodger-blue-500 hover:bg-dodger-blue-600 cursor-pointer rounded px-4 py-2 text-sm text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLinkModal;
