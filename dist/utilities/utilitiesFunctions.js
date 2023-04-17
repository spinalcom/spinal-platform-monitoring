"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateKey = exports.store = void 0;
function store(fs, model, path, callback_success, callback_error) {
    if (typeof callback_error === "undefined")
        callback_error = () => {
            console.log("Model could not be stored. You can pass a callback to handle this error.");
        };
    let lst = path.split('/');
    let fileName = lst.pop();
    if (lst[0] === "") {
        lst.splice(0, 1);
    }
    path = lst.join("/");
    const home_dir = fs._home_dir;
    // @ts-ignore
    fs.load_or_make_dir(home_dir + path, (dir, err) => {
        if (err)
            callback_error(err);
        else {
            let file = dir.detect((x) => { return x.name.get() === fileName; });
            if (file) {
                dir.remove(file);
            }
            dir.add_file(fileName, model, { model_type: "MonitoringModel" }); // CHANGE HERE
            callback_success();
        }
    });
}
exports.store = store;
function regenerateKey(type, ask = true) {
    let r = true;
    if (ask)
        r = confirm("Are you sure you want to generate a new secret? All clients using this key will stop working.");
    if (r === true) {
        let length = 64, charset = "abcdef0123456789", retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
}
exports.regenerateKey = regenerateKey;
//# sourceMappingURL=utilitiesFunctions.js.map