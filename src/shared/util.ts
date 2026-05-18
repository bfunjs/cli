import md5 from 'md5';

type TemplateData = Record<string, number | string>;

export function compile(tmpl: string, data: TemplateData = {}) {
  const now = new Date();
  const ctx: TemplateData = {
    DD: `0${now.getDate()}`.slice(-2),
    dd: now.getDate(),
    HASH: md5(Date.now().toString(16)).slice(0, 8),
    MM: `0${now.getMonth() + 1}`.slice(-2),
    mm: now.getMonth() + 1,
    YYYY: now.getFullYear(),
    ...data,
  };
  return tmpl.replaceAll(/{{(.*?)}}/g, (_match: string, key: string) =>
    String(ctx[key.trim()] ?? ''),
  );
}

export function toCamel(name: string) {
  if (!name) throw new Error('name is required');
  let tmp = name.replaceAll(/([^\da-z0-9])/gi, '_');
  if (tmp.startsWith('_')) tmp = tmp.slice(1);
  return tmp.replaceAll(
    /([^_])_+([^_])/g,
    ($0, $1, $2) => $1 + $2.toUpperCase(),
  );
}
