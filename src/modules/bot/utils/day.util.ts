import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getTzDate(tz = 'America/Bogota', date?: dayjs.ConfigType) {
  return dayjs(date).tz(tz);
}
