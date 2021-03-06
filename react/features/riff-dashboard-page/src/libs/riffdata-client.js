/* ******************************************************************************
 * riffdata-client.js                                                           *
 * *************************************************************************/ /**
 *
 * @fileoverview Connection to the riffdata server (currently feathers socket)
 *
 * [More detail about the file's contents]
 *
 * Created on        August 15, 2018
 * @author           Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';

// access to api

let dataserverPath = '/api/videodata';
dataserverPath += '/socket.io';

const socket = io(process.env.RIFF_SERVER_URL, {
    timeout: 20000,
    path: dataserverPath,
    transports: [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]
});


const app = feathers()
    .configure(socketio(socket), { timeout: 10000 })
    .configure(auth());

// participantEvents service still seems to end up w/ a timeout of 5000 even with
// the above timeouts specified. So try setting that service's timeout directly
app.service('participantEvents').timeout = 9000;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    app,
    socket,
};
