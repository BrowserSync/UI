import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import {clients, socket} from './socket.js';

var clients$ = Rx.Observable.fromEvent(socket(), 'ui:clients');

function main(responses) {
    let vtree$ = clients$.startWith([]).map(users => {
        return h('div.shane', [
            h('h1', `Connected Clients (${users.length})`),
            h('ul.clients', users.length ? users.map(x => h('p', x.id)) : [h('p', 'non')])
        ])
    });

    return {
        DOM: vtree$
    };
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app')
});
