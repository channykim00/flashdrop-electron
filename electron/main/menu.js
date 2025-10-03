import { Menu } from "electron";

export const createAppMenu = () => {
  const template = [
    {
      label: "File",
      submenu: [{ role: "quit", label: "종료" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo", label: "실행 취소" },
        { role: "redo", label: "다시 실행" },
        { type: "separator" },
        { role: "cut", label: "잘라내기" },
        { role: "copy", label: "복사" },
        { role: "paste", label: "붙여넣기" },
      ],
    },
    {
      label: "View",
      submenu: [{ role: "reload", label: "다시 불러오기" }],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
