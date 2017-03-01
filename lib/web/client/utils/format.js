export function date(timestamp) {
  const date = new Date(timestamp);

  if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
    return date.toLocaleTimeString();
  } else {
    return date.toLocaleString();
  }
}

export function object(obj) {
  if (Array.isArray(obj)) {
    return '[' + obj.map(object).join(', ') + ']';
  }

  if (obj === null) {
    return 'null';
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
