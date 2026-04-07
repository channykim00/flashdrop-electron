import { useState } from "react";
import { BsInboxesFill } from "react-icons/bs";

import DeletePrompt from "@/components/DeletePrompt";
import { API_URL } from "@/constants";
import type { UploadRequest } from "@/global";
import useUploadRequestStore from "@/stores/useUploadRequestStore";
import dateFormat from "@/utils/dateFormat";
import formatFileSize from "@/utils/formatFileSize";

const FileRequest = () => {
  const { requests, removeRequest } = useUploadRequestStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetRequest, setTargetRequest] = useState<UploadRequest | null>(null);

  const handleAcceptFile = (uploadData: UploadRequest) => {
    window.api.sendAcceptedUpload(uploadData);
    removeRequest(uploadData.fileId);
  };
  const handleDeclineFile = async (uploadData: UploadRequest) => {
    try {
      const response = await fetch(`${API_URL}/api/uploaded-file/${uploadData.fileId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "파일 삭제 실패");
      }

      removeRequest(uploadData.fileId);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("파일 삭제 중 오류:", error);
    }
  };
  return (
    <div>
      {isDeleteOpen && (
        <DeletePrompt
          title="파일 거절"
          message={`"${targetRequest?.fileName}" 파일을 거절하시겠습니까? 다시 다운로드할 수 없습니다.`}
          onCancel={() => {
            setIsDeleteOpen(false);
            setTargetRequest(null);
          }}
          onDelete={() => targetRequest && handleDeclineFile(targetRequest)}
        />
      )}
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <BsInboxesFill className="mr-3" />
        파일 요청함
      </h1>
      <section className="mt-6">
        <div className="rounded-lg bg-white p-5 shadow">
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs tracking-wider text-gray-500 uppercase">
                <tr className="text-center">
                  <th className="px-3 py-3">보낸이</th>
                  <th className="px-3 py-3">파일명</th>
                  <th className="px-3 py-3">용량</th>
                  <th className="px-3 py-3">연결된 링크</th>
                  <th className="px-3 py-3">업로드 시간</th>
                  <th className="px-3 py-3">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-center">
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-gray-500"
                    >
                      요청된 파일이 없습니다.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr
                      className="hover:bg-gray-50"
                      key={request.fileId}
                    >
                      <td className="px-2 py-4 text-xs">
                        {request.senderName ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                            {request.senderName}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                            없음
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-4 font-medium text-gray-900">{request.fileName}</td>
                      <td className="px-2 py-4 text-xs">{formatFileSize(request.size)}</td>
                      <td className="px-2 py-4 text-xs">{request.title}</td>
                      <td className="px-2 py-4 text-xs">{dateFormat(request.startedAt)}</td>
                      <td className="px-2 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:bg-gray-100"
                            onClick={() => {
                              setTargetRequest(request);
                              setIsDeleteOpen(true);
                            }}
                          >
                            거절
                          </button>
                          <button
                            className="bg-dodger-blue-500 hover:bg-dodger-blue-600 cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold text-white shadow transition"
                            onClick={() => handleAcceptFile(request)}
                          >
                            수락
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FileRequest;
