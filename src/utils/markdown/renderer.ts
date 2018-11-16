import MarkdownIt from 'markdown-it';
import MarkdownKatex from 'markdown-it-katex';

export function render (plainText: string): string {
  // const refreshInterval: number = 250; // ms
  const md = new MarkdownIt({
    html: true,
  });
  md.use(MarkdownKatex,{"throwOnError" : false, "errorColor" : " #cc0000"});
  // console.log(plainText);
  const htmlElement: string = md.render(plainText);
  // console.log(htmlElement);
  // preview.innerHTML = htmlElement;
  return htmlElement;
}