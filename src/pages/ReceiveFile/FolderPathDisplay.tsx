interface FolderPathDisplayProps {
  folderPath: string;
  onOpenFolder: () => void;
  onChangePath: () => void;
}

const FolderPathDisplay = ({ folderPath, onOpenFolder, onChangePath }: FolderPathDisplayProps) => {
  return (
    <div className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-700">현재 선택된 폴더 경로:</p>
      <div className="mt-1">
        <p className="bg-dodger-blue-100 inline-block rounded p-2 font-mono text-xs break-all text-blue-600">
          {folderPath}
        </p>
        <div className="mt-3">
          <button
            onClick={onOpenFolder}
            className="mr-3 cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
          >
            폴더 열기
          </button>
          <button
            onClick={onChangePath}
            className="bg-dodger-blue-500 hover:bg-dodger-blue-600 cursor-pointer rounded px-3 py-1 text-sm text-white"
          >
            경로 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderPathDisplay;
