import Rx from 'rx';

const CLIENT_CONNECTIONS = 'ui:client:connection';
const UI_CONNECTIONS = 'connection';

export function socket () {
    return window.___browserSync___.socket;
};

export let uiConnection$ = Rx.Observable.fromEvent(socket(), UI_CONNECTIONS);

export let connections$  = Rx.Observable
    .fromEvent(socket(), CLIENT_CONNECTIONS)
    .skipUntil(uiConnection$)
    .take(1);
