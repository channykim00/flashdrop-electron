type ClickHandler = () => void;

const showNotification = (title: string, message: string, handleClick?: ClickHandler) => {
  const notification = new Notification(title, { body: message });

  notification.onclick = () => {
    if (typeof handleClick === "function") {
      handleClick();
    }
  };
};

export default showNotification;
