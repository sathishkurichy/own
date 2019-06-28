import * as SpinnerCommands from '../commands/spinner.commands';
import { SPINNER_COMMAND_TYPE } from "../commands/spinner.command-type";
import { HideSpinnerCommand, ShowSpinnerCommand } from "../commands/spinner.commands";

export function spinnerProjection(state: boolean = false, action: SpinnerCommands.Commands): boolean {

    switch (action.type) {
        case SPINNER_COMMAND_TYPE.SHOW_SPINNER:
            return handleShowSpinner(state, action);
        case SPINNER_COMMAND_TYPE.HIDE_SPINNER:
            return handleHideSpinner(state, action);
        default:
            return state;
    }

    function handleShowSpinner(oldState: boolean, cmd: ShowSpinnerCommand): boolean {
        return true;
    }

    function handleHideSpinner(oldState: boolean, cmd: HideSpinnerCommand): boolean {
        return false;
    }
}