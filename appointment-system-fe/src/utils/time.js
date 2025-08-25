import moment from "moment-timezone";

export function fmt(isoString, tz = moment.tz.guess()) {
  return moment(isoString).tz(tz).format("YYYY-MM-DD HH:mm z");
}
