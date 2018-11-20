export default function parseSearch(search: string): {
  [key: string]: string
} {
  if (search[0] === '?')
    search = search.slice(1);
  const terms = search.split('&');
  const out: {[key: string]: string} = {};
  terms.forEach(t => {
    const [key, value] = t.split('=');
    out[key] = value;
  });
  return out;
}