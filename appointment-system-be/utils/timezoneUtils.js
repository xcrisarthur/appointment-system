const moment = require("moment-timezone");

/**
 * Cek apakah appointment valid di semua timezone peserta
 * @param {Date} start - tanggal mulai (UTC)
 * @param {Date} end - tanggal selesai (UTC)
 * @param {Array} participants - list user { id, preferred_timezone }
 * @returns {Object} { valid: boolean, errors: [] }
 */
function validateWorkingHours(start, end, participants) {
  const errors = [];

  participants.forEach((user) => {
    const tz = user.preferred_timezone || "UTC";

    // Konversi ke timezone user
    const startLocal = moment(start).tz(tz);
    const endLocal = moment(end).tz(tz);

    // Ambil jam
    const startHour = startLocal.hour();
    const endHour = endLocal.hour();

    // Cek range 9-17
    if (startHour < 9 || endHour > 17) {
      errors.push(
        `❌ User ${user.name} (${tz}) di luar jam kerja: ${startLocal.format(
          "HH:mm"
        )} - ${endLocal.format("HH:mm")}`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = { validateWorkingHours };
