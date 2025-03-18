import { format, formatDistanceToNow } from "date-fns";

export const formatDateTime = (
  dateTimestamp: number | null | undefined
): string => {
  if (!dateTimestamp) return "N/A";

  try {
    const date = new Date(dateTimestamp);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return format(date, "dd-MM-yyyy HH:mm:ss 'UTC'");
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};

export const formatTimeSince = (
  dateTimestamp: number | null | undefined
): string => {
  if (!dateTimestamp) return "Never";

  try {
    const date = new Date(dateTimestamp);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};
