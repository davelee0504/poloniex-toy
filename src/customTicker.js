module.exports = (function() {
    'use strict';
    const request = require('request');
    const USER_AGENT = 'MY UserAgent';
    const DEFAULT_SOCKETTIMEOUT = 60 * 1000;
    const DEFAULT_KEEPALIVE = true;

    function CustomTicker(url) {
        
    }

    CustomTicker.prototype = {

        constructor: CustomTicker,

        _request: function (options, callback) {
            if (!('headers' in options)) {
                options.headers = {};
            }

            options.json = true;
            options.headers['User-Agent'] = CustomTicker.USER_AGENT;
            options.strictSSL = true;
            options.timeout = this.options && this.options.socketTimeout || DEFAULT_SOCKETTIMEOUT;
            options.forever = this.options && this.options.hasOwnProperty('keepAlive') ? this.options.keepAlive : DEFAULT_KEEPALIVE;
            if (options.forever) {
                options.headers['Connection'] = 'keep-alive';
            }

            request(options, function (error, response, body) {
                let err = error;
                if (!err && response.statusCode !== 200) {
                    let errMsg = `Poloniex error ${response.statusCode}: ${response.statusMessage}`;
                    if (typeof response.body === 'object' && response.body.hasOwnProperty('error')) {
                        errMsg = `${errMsg}. ${response.body.error}`;
                    }

                    err =  new Error(errMsg);
                }

                if (!err && (typeof response.body === 'undefined' || response.body === null)) {
                    err = new Error('Poloniex error: Empty response');
                }

                if (!err && body.error) {
                    err = new Error(body.error);
                }

                if (!err) 
                    console.log(`req: ${response.request.href}, resp: ${JSON.stringify(response.body)}`);
                callback(err, body);
            });
            return this;
        },

        _requestPromised: function (options) {
            if (!('headers' in options)) {
                options.headers = {};
            }

            options.json = true;
            options.headers['User-Agent'] = CustomTicker.USER_AGENT;
            options.strictSSL = true;
            options.timeout = this.options && this.options.socketTimeout || DEFAULT_SOCKETTIMEOUT;
            options.forever = this.options && this.options.hasOwnProperty('keepAlive') ? this.options.keepAlive : DEFAULT_KEEPALIVE;
            if (options.forever) {
                options.headers['Connection'] = 'keep-alive';
            }

            return new Promise((resolve, reject) => {
                request(options, function (error, response, body) {
                let err = error;
                if (!err && response.statusCode !== 200) {
                    let errMsg = `Poloniex error ${response.statusCode}: ${response.statusMessage}`;
                    if (typeof response.body === 'object' && response.body.hasOwnProperty('error')) {
                    errMsg = `${errMsg}. ${response.body.error}`;
                    }

                    err =  new Error(errMsg);
                }

                if (!err && (typeof response.body === 'undefined' || response.body === null)) {
                    err = new Error('Poloniex error: Empty response');
                }

                if (!err && body.error) {
                    err = new Error(body.error);
                }

                if (!err) {
                    resolve(body);
                } else {
                    reject(err);
                }
                });
            });
        },


        // Make a public API request
        _public: function (command, parameters, callback) {
            Object.keys(parameters).forEach((key) => {
                if (typeof parameters[key] === 'function') {
                    throw new Error('Invalid parameters');
                }
            });

            let param = parameters;
            param.command = command;
            let options = {
                method: 'GET',
                url: parameters.url,
                qs: param,
            };
            if(callback) {
                return this._request(options, callback);
            } else {
                return this._requestPromised(options);
            }
        },


        getAUDTicker: function (callback) {
            let parameters = {url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=AUD&e=BTCMarkets'};
            return this._public('price', parameters, callback);
        },

        getUSDTicker: function(callback){
            let parameters = {url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&e=Poloniex'};
            return this._public('price', parameters, callback)
        },

        getExchangeRate: function(callback){
            let parameters = {url: 'http://api.fixer.io/latest?base=USD&symbols=AUD'};
            return this._public('price', parameters, callback)
        },

        getHistoryTrend: function(callback){
            let parameters = {url: 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=20&e=Poloniex'};
            return this._public('price', parameters, callback);
        }

    };
    return CustomTicker;
})();



