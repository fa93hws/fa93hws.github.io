import { action, observable } from 'mobx';

class TopBarStore {
  @observable public title: string = '';
}

class LeftNavStore {
  @observable public isShown: boolean = true;
  @action.bound public toggleShown() {
    this.isShown = !this.isShown;
  }
}

export const topBarStore = new TopBarStore();
export const leftNavStore = new LeftNavStore();
