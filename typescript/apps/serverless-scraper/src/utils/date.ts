import moment from 'moment/moment.js'

export const getYesterdayDateString = (stringFormat = 'YYYY-MM-DD') => moment().subtract(1, 'days').format(stringFormat)
