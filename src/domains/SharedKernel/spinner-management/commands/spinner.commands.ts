import { Command } from '../../core/command/command';
import { SPINNER_COMMAND_TYPE } from './spinner.command-type';

export class ShowSpinnerCommand implements Command {
    readonly type = SPINNER_COMMAND_TYPE.SHOW_SPINNER;
    constructor() { }
}

export class HideSpinnerCommand implements Command {
    readonly type = SPINNER_COMMAND_TYPE.HIDE_SPINNER;
    constructor() { }
}

export type Commands
    = ShowSpinnerCommand
    | HideSpinnerCommand;