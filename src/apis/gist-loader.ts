interface IGistJson {
  div: string,
  stylesheet: string
}

class GistLoader {
  private gistUrlPattern: RegExp =  /^https:\/\/gist.github.com\/[^.]+\.js$/;
   // ms
  private timeout: number = 5000;

  public parseAllIn(containerId: string): void {
    const gistContainers: HTMLScriptElement[] = this.findAll(containerId);
    gistContainers.forEach((ele:HTMLScriptElement, idx:number) => {
      ele.className = 'lt-blog__gist--loading';
      ele.id = `${containerId}gist${idx}`;
      this.parseOne(ele);
    });
  }

  private jsonp = (ele: HTMLScriptElement): Promise<any> => new Promise((resolve, reject) => {
    let isSuccess = false;
    // generate unique function name to prevent overwriting
    (<any>window)[`handle${ele.id}`] = (data: IGistJson) => {
      isSuccess = true;
      delete (<any>window)[`handle${ele.id}`];
      resolve(data);
    }
    const scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = `${ele.src}on?callback=handle${ele.id}`;
    scriptElement.async = true;
    document.getElementsByTagName('head')[0].appendChild(scriptElement);

    setTimeout(() => {
      if (!isSuccess){
        reject('jsonp timeout');
      }
    }, this.timeout);
  });
  private parseOne = (ele: HTMLScriptElement) => this.jsonp(ele).then((reply:IGistJson) => {
    // replace element
    ele.outerHTML = reply.div;
    // append stylesheet
    if (this.requireStyle(reply.stylesheet)){
      const linkElement: HTMLLinkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.type = 'text/css';
      linkElement.href = reply.stylesheet;
      document.getElementsByTagName('head')[0].appendChild(linkElement);
    }
  }).catch(()=>{
    ele.className = 'lt-blog__gist--failed';
  })
  private requireStyle(href: string): boolean {
    const styles = Array.from(document.getElementsByTagName('link'));
    return styles.findIndex((style: HTMLLinkElement) => style.href === href) === -1
  }

  // find all gist container from the given element id;
  private findAll(containerId: string): HTMLScriptElement[] {
    const postContainer = document.getElementById(containerId);
    if (postContainer === null) {
      return [];
    }
    const scriptTags = Array.from(postContainer.getElementsByTagName('script'));
    const gistContainers = scriptTags.filter( (ele: HTMLScriptElement) => {
      const emptyContentFlag = ele.innerHTML === '';
      const sourceFlag = ele.src.match(this.gistUrlPattern) !== null;
      return emptyContentFlag && sourceFlag;
    })
    return gistContainers;
  }
}

const gistLoader = new GistLoader();
export default gistLoader;