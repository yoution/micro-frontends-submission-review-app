/**
 * Provides date related utility methods
 */
import moment from 'moment'
import 'moment-duration-format'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS


/**
 * Returns phase's end date.
 * @param {Object} phase
 * @return {Date}
 */
export function phaseEndDate(phase) {
  // Case 1: phase is still open. take the `scheduledEndDate`
  // Case 2: phase is not open but `scheduledStartDate` is a future date.
  // This means phase is not yet started. So take the `scheduledEndDate`
  // Case 3: phase is not open & `scheduledStartDate` is a past date,
  // but the phase is `Iterative Review`. It will take the `scheduledEndDate`
  // as it's a valid scenario for iterative review,
  // there might not be any submission yet to open the phase
  if (phase.isOpen || moment(phase.scheduledStartDate).isAfter() || phase.name === 'Iterative Review') {
    return new Date(phase.scheduledEndDate);
  }
  // for other cases, take the `actualEndDate` as phase is already closed
  return new Date(phase.actualEndDate);
}


export const getLastDate = (dates) => {
  return Math.max(...dates)
}

export const getFormattedDuration = (duration) => {
  let format
  if (duration > DAY_MS) format = 'D[d] H[h]'
  else if (duration > HOUR_MS) format = 'H[h] m[min]'
  else format = 'm[min] s[s]'

  return moment.duration(duration).format(format)
}

export const getRoundFormattedDuration = (duration) => {
  let format
  if (duration > DAY_MS) format = 'D[d]'
  else format = 'H[h]'
  return moment.duration(duration).format(format)
}
