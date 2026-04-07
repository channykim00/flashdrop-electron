import { BiCheckCircle } from "react-icons/bi";

interface SuccessModalProps {
  successTitle?: string;
  successMessage?: string;
  onClose: () => void;
}

const SuccessModal = ({
  successTitle = "성공!",
  successMessage = "작업이 성공적으로 완료되었습니다.",
  onClose,
}: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <BiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-base font-semibold text-gray-900"
                id="dialog-title"
              >
                {successTitle}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-dodger-blue-500 hover:bg-dodger-blue-600 inline-flex w-full cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
