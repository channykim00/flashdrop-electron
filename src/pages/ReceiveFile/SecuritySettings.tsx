import { useState } from "react";
import { MdOutlineSecurity } from "react-icons/md";

import useLinkStore from "@/stores/linkStore";

const SecuritySettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { securitySettings, setSecuritySettings } = useLinkStore();

  const handleChange = (field, value) => {
    setSecuritySettings({ ...securitySettings, [field]: value });
  };

  const handlePasswordToggle = () => {
    const newShowPassword = !showPassword;
    setShowPassword(newShowPassword);
    if (!newShowPassword) {
      handleChange("password", "");
      setPasswordTouched(false);
    }
  };

  const isPasswordValid = securitySettings.password?.length >= 4;

  return (
    <>
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
        <MdOutlineSecurity /> 링크 보안 설정
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">전송자 이름 받기</label>
          <input
            type="checkbox"
            checked={securitySettings.requireSenderName || false}
            onChange={(e) => handleChange("requireSenderName", e.target.checked)}
            className="text-dodger-blue-500 focus:ring-dodger-blue-500 h-5 w-5 rounded border-gray-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">비밀번호 설정</label>
            <button
              onClick={handlePasswordToggle}
              className={`rounded px-3 py-1 text-sm text-white ${
                showPassword
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-dodger-blue-500 hover:bg-dodger-blue-600"
              }`}
            >
              {showPassword ? "제거하기" : "설정하기"}
            </button>
          </div>
          {showPassword && (
            <>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={securitySettings.password || ""}
                onChange={(e) => {
                  handleChange("password", e.target.value);
                  setPasswordTouched(true);
                }}
                onBlur={() => setPasswordTouched(true)}
                className={`ml-32 w-60 rounded border px-3 py-1 text-sm text-gray-800 ${
                  passwordTouched && !isPasswordValid ? "border-red-500" : "border-gray-300"
                }`}
              />
              {passwordTouched && !isPasswordValid && (
                <p className="mt-1 ml-32 text-sm text-red-600">
                  비밀번호는 최소 4자리 이상이어야 합니다.
                </p>
              )}
              {passwordTouched && isPasswordValid && (
                <p className="mt-1 ml-32 text-sm text-green-600">비밀번호가 설정되었습니다.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SecuritySettings;
