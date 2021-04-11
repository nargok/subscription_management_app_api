import { format } from "date-fns";

function convertDateObjectToDateString(date: Date) {
  return format(date, "YYYYMMDD");
}
