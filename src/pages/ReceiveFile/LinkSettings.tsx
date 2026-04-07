import { GiSettingsKnobs } from "react-icons/gi";

import { FILE_TYPE_OPTIONS } from "@/constants";
import useLinkStore from "@/stores/linkStore";

const LinkSettings = () => {
  const { linkSettings, setLinkSettings } = useLinkStore();

  const handleChange = (field, value) => {
    setLinkSettings({ ...linkSettings, [field]: value });
  };

  return (
    <>
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
        <GiSettingsKnobs /> 링크 설정
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">링크 제목</label>
          <input
            type="text"
            placeholder="예: 프로젝트 제출 링크"
            value={linkSettings.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="focus:ring-dodger-blue-300 w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">만료 시간</label>
          <select
            className="w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
            value={linkSettings.expireTime || "60"}
            onChange={(e) => handleChange("expireTime", e.target.value)}
          >
            <option value="30">30분</option>
            <option value="60">1시간</option>
            <option value="120">2시간</option>
            <option value="360">6시간</option>
            <option value="720">12시간</option>
            <option value="1440">24시간</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">허용 파일 형식</label>
          <select
            value={linkSettings.allowedFileTypeGroup || "all"}
            onChange={(e) => handleChange("allowedFileTypeGroup", e.target.value)}
            className="w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
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

        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">최대 파일 크기</label>
          <select
            className="w-60 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
            value={linkSettings.maxFileSize}
            onChange={(e) => handleChange("maxFileSize", Number(e.target.value))}
          >
            <option value={10 * 1024 * 1024}>10MB</option>
            <option value={100 * 1024 * 1024}>100MB</option>
            <option value={500 * 1024 * 1024}>500MB</option>
            <option value={1 * 1024 * 1024 * 1024}>1GB</option>
            <option value={2 * 1024 * 1024 * 1024}>2GB</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">자동 수락</label>
          <input
            type="checkbox"
            checked={linkSettings.autoAccept || false}
            onChange={(e) => handleChange("autoAccept", e.target.checked)}
            className="text-dodger-blue-500 focus:ring-dodger-blue-500 h-5 w-5 rounded border-gray-300"
          />
        </div>
      </div>
    </>
  );
};

export default LinkSettings;
