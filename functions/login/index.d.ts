/**
 * @typedef LoginData
 * @type {Object}
 * @property {string} identifier - identifier
 */
/**
 * @typedef LoginRequestConfig
 * @type {Object}
 * @property {LoginrData} data - body of the request
 */
/**
 * @param {LoginRequestConfig & Object<string,any>} config
 * @returns {Promise<any>}
 */
export function login(config: LoginRequestConfig & {
    [x: string]: any;
}): Promise<any>;
export type LoginData = {
    /**
     * - identifier
     */
    identifier: string;
};
export type LoginRequestConfig = {
    /**
     * - body of the request
     */
    data: LoginrData;
};
