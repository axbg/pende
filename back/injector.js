const fs = require('fs');
const replace = require('replace');

const FILE_PREFIX = "main."

const injector = (path, placeholder, googleClientId) => {
    fs.readdirSync(path).forEach(file => {
        if (file.startsWith(FILE_PREFIX)) {
            console.log("\ninjected values in: ")
            replace({
                regex: placeholder,
                replacement: googleClientId,
                paths: [path + file],
                recursive: false,
                silent: false
            });
        }
    });
}

module.exports = injector;