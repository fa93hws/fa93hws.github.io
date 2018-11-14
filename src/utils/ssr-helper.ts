// export ssr util functions, one injecting variable to script and the other take that variable

function getVarName(name: string) {
  return `__ssr__${name}__`
}

export function save(data: any, name: string): void {
  setTimeout(() => {
    const element = document.createElement('script');
    const varName = getVarName(name);
    element.innerHTML = `var ${varName} = ${JSON.stringify(data)}`;
    document.getElementsByTagName('head')[0].append(element);
  });
}

export function load<T>(name: string): T {
  const varName = getVarName(name);
  return (<any>window)[varName];
};