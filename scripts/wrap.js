let fs = require('fs');

function wrap(config, template, file) {
    let tpl = fs.readFileSync(template, 'utf-8');
    let keys = Object.keys(config).join('|');
    let regex = new RegExp(keys, "gi");
    let output = tpl.replace(regex, function(item) {
        return (item == '###content###' ? file.contents : config[item]);
    });
    return Buffer.from(output);
};

module.exports = wrap;