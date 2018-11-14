export interface IGQModel {
  parseGQResponse: (arg: any) => void;
}
export default abstract class BaseModel {
  constructor(params: any = {}) {
    Object.assign(this, params);
  }
}