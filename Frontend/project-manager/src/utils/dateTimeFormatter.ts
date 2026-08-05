export const parseDateForFormInput = (dateObj: Date) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// For viewing on UI
export const parseDate = (arg: Date) => {
  const stringDate = arg.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return stringDate;
};

// For chats 
export const determineTimeStamp = (updatedAt: string) => {
  const updatedDate = new Date(updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return parseDate(updatedDate).split(", ")[1]; // exact time
  }

  if (diffHours >= 24 && diffHours < 48) {
    return "Yesterday";
  }

  return parseDate(updatedDate).split(", ")[0]; // exact date
}