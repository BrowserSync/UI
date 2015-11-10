import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import {clients} from './socket.js';

function main(responses) {

    let vtree$ = responses.clientList.map(users =>
        h('div.shane', [
            h('h1', 'Connected Clients'),
            h('ul.clients', users.map(x => h('p', x.id)))
        ])
    );

    return {
        DOM: vtree$
    };
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    clientList: function () {
        let clients$ = clients();
    	return clients$.share();
    }
});
