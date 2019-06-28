import {DomainEvent} from "../core/event/event";

export class UserLogoutEvent implements DomainEvent {
  readonly type = LOGOUT_EVENT_TYPE.USER_DISCONNECTED;
  constructor(public payload?: any) { }
}

export const LOGOUT_EVENT_TYPE = {
  USER_DISCONNECTED: '[App] User is disconnected',
};
