export const dateToString = (date: Date): String => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(
    seconds
  )}`;
};

export function generateRandomId(): number {
    return Math.floor(Math.random() * 1_000_000);
  }


