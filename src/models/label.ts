import BaseModel from './base';

export interface ILabelModel {
  color?: string;
  name?: string;
  description?: string
}

export class LabelModel extends BaseModel implements ILabelModel {
  public color: string = '';
  public name: string = '';
  public description: string = '';
}