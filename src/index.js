const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const morgan = require('morgan');
const ws = new WebSocket.Server({port:8000});
const app = express();
let msgServer = {};
let clientsHost = [];

//Settings
app.set('port', process.env.PORT || 3000);
//Middlewars
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//Static file
app.use(express.static(path.join(__dirname, 'public')));

ws.on('connection', (socket, req) => {
    let id = req.headers['sec-websocket-key'];
    clientsHost[id] = {
        name: '',
        ip: req.socket.remoteAddress
    };

    socket.on('message', msgText => {
        let msg = JSON.parse(msgText);
        let name = clientsHost[id].name;
        if(name == "") name = id;

        console.log('Mensaje recibido de', name);
        if(msg.type=='message'){
            msgServer = {
                type: 'message',
                text: msg.text,
                id: name,
                date: msg.date
            };
            ws.clients.forEach(client => {
                client.send(JSON.stringify(msgServer));
            });
        } else if(msg.type=='username'){
            clientsHost[id].name = msg.text;

            msgServer = {
                type: 'message',
                text: id+", cambio su nombre de usuario a "+user[1],
                id: "SERVER",
                date: msg.date
            };

            ws.clients.forEach(client => {
                client.send(JSON.stringify(msgServer));
            });
        } else if(msg.type=='video'){
            console.log('Se recibio un video:', msg.text);
            msgServer = {
                type: 'video',
                text: msg.text,
                id: "SERVER",
                date: msg.date
            };

            ws.clients.forEach(client => {
                client.send(JSON.stringify(msgServer));
            });
            msgServer = {
                type: 'message',
                text: name +", cambio el video.",
                id: "SERVER",
                date: msg.date
            };
            ws.clients.forEach(client => {
                client.send(JSON.stringify(msgServer));
            });
        }

    });

    socket.on('close', () => {
        let name = clientsHost[id].name;
        if(name == "") name = id;
        delete clientsHost[id];

        console.log('Nodo desconectado', id);
        msgServer = {
            type: 'message',
            text: name +', Se ha desconecto!',
            id: 'SERVER',
            date: Date.now()
        };
        ws.clients.forEach(client => {
            client.send(JSON.stringify(msgServer));
        });
    });

    console.log('+1 socket conectado: ', id);
    msgServer = {
        type: 'message',
        text: 'Bienvenido al chat: '+ id +', cambie su nombre con "/username nombre"',
        id: 'SERVER',
        date: Date.now()
    };
    socket.send(JSON.stringify(msgServer));
    console.log('Se envia mensaje a socket: ', id);

    msgServer = {
        type: 'message',
        text: id + ' se ha conectado a la sala.',
        id: 'SERVER',
        date: Date.now()
    };
    ws.clients.forEach(client => {
        client.send(JSON.stringify(msgServer));
    });
});

console.log('WebSocket operando por el puerto: 8000');
app.listen(app.get('port'), () => {
    console.log("Servidor HTTP  escuchando por el puerto: 3000")
});