import axios from "axios";
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
export function backupCard(config) {
    config = { ...config, method: "get", url: "https://master.spicaengine.com/api/fn-execute/dashboard/backup-card" };
    axiosWriteValidator(config);
    axiosReadValidator(config);
    return axios.request(config).then(r => r.data);
}
export function backup(config) {
    config = { ...config, method: "post", url: "https://master.spicaengine.com/api/fn-execute/dahsboard/backup" };
    axiosWriteValidator(config);
    axiosReadValidator(config);
    return axios.request(config).then(r => r.data);
}
// This statement has been deleted.
;
// This statement has been deleted.
;
// This statement has been deleted.
;
function axiosWriteValidator(config) {
    if (["post", "put", "patch"].includes(config.method) && !config.data) {
        console.warn("Sending empty request body for post, put, patch requests is unusual. If it's not intented, please use config.data or update your spica function.");
    }
}
function axiosReadValidator(config) {
    if (["get", "delete", "trace", "options", "head"].includes(config.method) && config.data) {
        console.warn("Sending request body for get, delete, trace, options, head requests is unusual. If it's not intented, please remove config.data or update your spica function.");
    }
}
