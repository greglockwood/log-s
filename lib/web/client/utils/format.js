import moment from 'moment';

const timeFormat = 'HH:mm:ss.SSS A';

export function date(timestamp) {
  const date = moment(timestamp);
  const now = moment();
  if (date.isSame(now, 'day')) {
    return date.format(timeFormat);
  } else if (date.isSame(now, 'year')) {
    return date.format(`MMM DD ${timeFormat}`);
  } else {
    return date.format(`YYYY-MM-DD ${timeFormat}`);
  }
}

export function object(obj) {
  if (Array.isArray(obj)) {
    return '[' + obj.map(object).join(', ') + ']';
  }

  if (obj === null) {
    return 'null';
  }
  
  if (obj && typeof obj.getMonth === 'function') {
    return JSON.stringify(obj);
  }
  
  if (typeof obj === 'object') {
    let result = '';
    for (const i in obj) {
      if (result) {
        result += ', ';
      }
      result += i + ': ' + object(obj[i]);
    }
    return `{${result}}`;
  }

  return JSON.stringify(obj);
}
