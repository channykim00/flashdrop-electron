export default function remainTimeFormat(
  createdAt: string | number | Date,
  expireTime: number,
): string | null {
  if (!expireTime || expireTime <= 0) return null;

  const created = new Date(createdAt);
  const now = new Date();

  const expireAt = new Date(created.getTime() + expireTime * 60 * 1000);
  const remainingMs = expireAt.getTime() - now.getTime();

  if (remainingMs <= 0) return "만료됨";

  const totalMinutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}시간 ${minutes}분 남음` : `${minutes}분 남음`;
}
