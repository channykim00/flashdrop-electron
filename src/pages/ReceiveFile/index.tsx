import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import { API_URL } from "@/constants";
import FolderPathDisplay from "@/pages/ReceiveFile/FolderPathDisplay";
import LinkSettings from "@/pages/ReceiveFile/LinkSettings";
import SecuritySettings from "@/pages/ReceiveFile/SecuritySettings";
import useDeviceStore from "@/stores/deviceStore";
import useLinkStore from "@/stores/linkStore";

const ReceiveFile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successLinkUrl, setSuccessLinkUrl] = useState(null);

  const {
    folderPath,
    linkSettings,
    securitySettings,
    setFolderPath,
    setLinkSettings,
    setSecuritySettings,
    reset,
  } = useLinkStore();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const openFolderSelectDialog = async () => {
    try {
      const path = await window.api.selectFolder();
      if (path) {
        setFolderPath(path);
      }
    } catch (err) {
      setError(err.message || "폴더를 여는 중 문제가 발생했습니다.");
    }
  };

  const handleChangePath = () => {
    openFolderSelectDialog();
  };

  const deviceId = useDeviceStore((state) => state.deviceId);

  const handleCreateLink = async () => {
    try {
      const selectedGroup = linkSettings.allowedFileTypes;

      const payload = {
        deviceId,
        folderPath,
        title: linkSettings.title,
        expireTime: linkSettings.expireTime,
        allowedFileTypeGroup: selectedGroup,
        maxFileSize: linkSettings.maxFileSize,
        autoAccept: linkSettings.autoAccept,
        requireSenderName: securitySettings.requireSenderName,
        password: securitySettings.password || null,
      };

      const res = await fetch(`${API_URL}/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "링크 생성 실패");
      }

      const linkToSave = data.link;
      const saveRes = await window.api.saveLinkData(linkToSave);
      if (!saveRes.success) {
        throw new Error("로컬 저장 실패: " + saveRes.error);
      } else {
        setSuccessLinkUrl(linkToSave.uniqueUrl);
      }
    } catch (err) {
      setError(err.message || "링크 생성 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      {error && (
        <ErrorModal
          errorTitle="폴더 선택 중 오류"
          errorMessage={error}
          onClose={() => setError(null)}
        />
      )}
      {successLinkUrl && (
        <SuccessModal
          successTitle="링크가 생성되었습니다."
          successMessage="링크가 정상적으로 생성되었습니다."
          onClose={() => {
            navigate(`/linkdetail/${successLinkUrl}`);
          }}
        />
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">파일 받기 링크 생성</h1>

        <section className="mt-6">
          {!folderPath ? (
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <p className="mb-4 text-gray-700">파일을 저장할 폴더를 먼저 선택해주세요.</p>
              <button
                className="bg-dodger-blue-500 hover:bg-dodger-blue-600 cursor-pointer rounded px-4 py-2 text-white"
                onClick={openFolderSelectDialog}
              >
                저장할 폴더 선택하기
              </button>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-4 shadow">
              <FolderPathDisplay
                folderPath={folderPath}
                onOpenFolder={() => window.api.openFolder(folderPath)}
                onChangePath={handleChangePath}
              />
              <div className="mb-3 flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
                <div className="w-full md:w-1/2">
                  <LinkSettings
                    settings={linkSettings}
                    onChange={setLinkSettings}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <SecuritySettings
                    settings={securitySettings}
                    onChange={setSecuritySettings}
                  />
                </div>
              </div>
              <button
                className="bg-dodger-blue-500 hover:bg-dodger-blue-600 w-full cursor-pointer rounded px-3 py-2 text-lg text-white"
                onClick={handleCreateLink}
              >
                링크 생성
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ReceiveFile;
