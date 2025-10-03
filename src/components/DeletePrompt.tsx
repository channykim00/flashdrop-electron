import { IoWarning } from "react-icons/io5";

interface DeletePromptProps {
  title: string;
  message: string;
  onCancel: () => void;
  onDelete: () => void;
}

const DeletePrompt = ({ title, message, onCancel, onDelete }: DeletePromptProps) => {
  return (
    <div>
      <div
        className="relative z-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <IoWarning className="text-2xl text-red-500" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-base font-semibold text-gray-900"
                      id="dialog-title"
                    >
                      {title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={onDelete}
                  type="button"
                  className="inline-flex w-full cursor-pointer justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  삭제
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="mt-3 inline-flex w-full cursor-pointer justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;
