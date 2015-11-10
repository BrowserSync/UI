import Rx from 'rx';
const fromEvent = Rx.Observable.fromEvent;

const CLIENT_CONNECTIONS = 'ui:clients';
const UI_CONNECTION      = 'ui:connection';

export function connection () {
    return fromEvent(socket(), UI_CONNECTION);
}

export function clients () {
    return fromEvent(socket(), CLIENT_CONNECTIONS);
}

export function socket () {
    return window.___browserSync___.socket;
}
