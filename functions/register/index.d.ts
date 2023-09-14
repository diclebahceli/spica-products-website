/**
 * @typedef RegisterData
 * @type {Object}
 * @property {string} password - password
 * @property {string} name - name
 * @property {string} identifier - identifier
 */
/**
 * @typedef RegisterRequestConfig
 * @type {Object}
 * @property {RegisterData} data - body of the request
 */
/**
 * @param {RegisterRequestConfig & Object<string,any>} config
 * @returns {Promise<any>}
 */
export function register(config: RegisterRequestConfig & {
    [x: string]: any;
}): Promise<any>;
export type RegisterData = {
    /**
     * - password
     */
    password: string;
    /**
     * - name
     */
    name: string;
    /**
     * - identifier
     */
    identifier: string;
};
export type RegisterRequestConfig = {
    /**
     * - body of the request
     */
    data: RegisterData;
};
