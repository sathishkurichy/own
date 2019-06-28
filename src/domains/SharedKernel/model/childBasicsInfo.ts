import { Record } from 'immutable';

export interface IChildBasicsInfo {
  name: string;
  gender: string;
}

const ChildBasicsInfoRecord = Record({
  name: '',
  gender: '',
});

export class ChildBasicsInfo extends ChildBasicsInfoRecord implements IChildBasicsInfo {

  public name: string;
  gender: string;

  constructor(props: IChildBasicsInfo) {
    super(props);
  }

  static newDefaultChild(): ChildBasicsInfo{
    return new ChildBasicsInfo({
      name: '',
      gender: ''
    });
  }
}
