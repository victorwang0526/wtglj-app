import { HttpParams } from '@angular/common/http';

export class Utils {
  buildQueryUrl(url: string, query: object | string[], repeatKey?: string) {
    if (query instanceof Array) {
      return query.reduce((prev, current, index) => {
        const firstSymbol = index === 0 ? '?' : '&';
        return prev + `${firstSymbol}${repeatKey}=${current}`;
      }, url);
    } else {
      return Object.keys(query)
        .filter((key) => query[key] || query[key] === false)
        .reduce((prev, current, index) => {
          const firstSymbol = index === 0 ? '?' : '&';
          return prev + `${firstSymbol}${current}=${query[current]}`;
        }, url);
    }
  }

  buildParamsUrl(url: string, query: {}) {
    return Object.keys(query)
      .filter((key) => query[key] || query[key] === false)
      .reduce((prev, key) => prev.replace(new RegExp(`:${key}`, 'g'), query[key]), url);
  }

  buildParams(query: {}) {
    return Object.keys(query)
      .filter((key) => !!query[key] || query[key] === false)
      .reduce((prev, key) => prev.set(key, String(query[key])), new HttpParams());
  }
}
