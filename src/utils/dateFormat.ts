const dateFormat = (timestamp: number | string): string => {
  const date = new Date(timestamp);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const min = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "오후" : "오전";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const hh = String(hours).padStart(2, "0");

  return `${yyyy}년 ${mm}월 ${dd}일 - ${ampm} ${hh}:${min}`;
};

export default dateFormat;
