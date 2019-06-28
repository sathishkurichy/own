import { Record } from 'immutable';

interface IBasicChild {
    name: string,
    gender: string,
    id: number
}

const BasicChildRecord = Record({
    name: '',
    gender: '',
    id: 0
});

export class BasicChild extends BasicChildRecord implements IBasicChild {
    name: string;
    gender: string;
    id: number;

    constructor(props) {
        super(props);
    }

    static newDefaultBasicChild(): BasicChild {
        return new BasicChild({
            name: '',
            gender: '',
            id: 0
        });
    }
}