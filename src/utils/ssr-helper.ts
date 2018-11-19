// export ssr util functions, one injecting variable to script and the other take that variable

function getVarName(name: string) {
  return `__ssr__${name}__`
}

export function save(data: any, name: string): void {
  setTimeout(() => {
    const element = document.createElement('script');
    const varName = getVarName(name);
    const encodedData = encodeURIComponent(JSON.stringify(data));
    element.innerHTML = `var ${varName} = "${btoa(encodedData)}"`;
    document.getElementsByTagName('head')[0].append(element);
    document.dispatchEvent(new Event('render-trigger'));
  });
}

export function load<T>(name: string): T | undefined {
  const varName = getVarName(name);
  const base64 = (<any>window)[varName];
  if (base64 === undefined)
    return undefined;
  const encoded = atob(base64);
  return JSON.parse(decodeURIComponent(encoded));
};