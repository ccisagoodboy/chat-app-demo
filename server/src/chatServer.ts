import { Server, createServer } from 'http';
import * as SocketIO from 'socket.io';
import * as express from 'express';
import { UserMap } from './utils/map';

import { Message } from "./model/message";
import { MessageType } from "./model/messageType";

export class ChatServer {
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: number = 8080;
    private currentUser: UserMap = new UserMap();
    private allMessages: Message[] = [];

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = SocketIO(this.server);
        this.listen();
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Server is runing on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            socket.on('login', (username) => {
                console.log('recived a login request from ' + username);
                if (this.currentUser.hasUser(username)) {
                    socket.emit('loginResponse', 'rejected');
                    console.log('login request rejected from ' + username);
                } else {
                    this.sendHistoryMessages(socket);
                    socket.emit('loginResponse', 'accepted');
                    socket.broadcast.emit('message', {
                        from: username,
                        messageType: MessageType.JOINED
                    });
                    this.currentUser.add(username, socket.id);
                    console.log('login request accepted ' + username);
                }
            });
            socket.on('disconnect', () => {
                let user = this.findDisconnectedUser(socket);
                console.log(`deleting disconnected user ${user}`);
                this.currentUser.delete(user);
                socket.broadcast.emit('message', {
                    from: user,
                    messageType: MessageType.LEFT
                });
            });
            socket.on('message', (m: Message) => {
                console.log('received a normal chat message. adding to cache.');
                this.allMessages.push(m);
                this.io.emit('message', m);
            });
        })
    }

    private sendHistoryMessages(socket: any): void {
        for (let message of this.allMessages) {
            socket.emit('message', message);
        }
    }

    private findDisconnectedUser(socket: any): string {
        return this.currentUser.getUser(socket.id);
    }

    public getApp(): express.Application {
        return this.app;
    }
}