import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getTzDate(date?: dayjs.ConfigType, tz?: string) {
  tz = tz || 'America/Bogota';
  return dayjs(date).tz(tz);
}
