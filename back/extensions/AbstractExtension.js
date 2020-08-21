class AbstractExtension {
    constructor(socket, username, processTimeoutInterval) {
        this.socket = socket;
        this.username = username;
        this.processTimeoutInterval = processTimeoutInterval;
        this.extend();
    }

    extend() {}
}

module.exports = AbstractExtension;