export class UserMap {
    private obj: {[key: string]: string} = {};

    add(user: string, socket: string) {
        if (this.hasUser(user)) {
            return;
        }
        this.obj[user] = socket;
        this.obj[socket] = user;
    }

    delete(user: string): void {
        let socketToDelete = this.getSocket(user);
        delete this.obj[user];
        delete this.obj[socketToDelete];
    }

    hasUser(user: string) {
        return this.obj[user];
    }

    getSocket(key: string): string {
        return this.obj[key];
    }

    getUser(socket: string): string {
        return this.obj[socket];
    }

    clear(): void {
        this.obj = {};
    }
}