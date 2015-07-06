// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

var vumigo = require('vumigo_v02');
var State = vumigo.states.State;
var JsonApi = vumigo.http.api.JsonApi;

/**
 * Stellar state
 *
 * All stellar operations need to make use of this state to 
 * make operations with stellar
 *
 * Possible operations
 *
 * create wallet
 * make payment
 * check balance
 *
 * common substate: authentication
 *
 *
 *
 */
StellarState = State.extend(function(self, name, opts) {
    State.call(self, name, opts);
    // var msisdn = opts.im.user_addr;
    self.init = function() {
        self._text = '';
        var api = new JsonApi(opts.im);

        
        self.metadata.operation_data = self.metadata.operation_data || {};
        self.make_payment = self._make_operation(
            'make_payment',
            [
                {
                    question: 'Enter the mobile number of recipient',
                    fail_message: 'That is not a valid mobile number, please try again',
                    // TODO: only tests South african phone numbers
                    validate: function(v) { 
                        return /^(\+?27|0)\d{9}$/.test(v); 
                    },
                    result_variable: 'to_msisdn'
                },
                {
                    question: 'Enter the amount you wish to send',
                    fail_message: 'Please enter a numerical amount',
                    validate: function(v) {
                        return /\d+/.test(v);
                    },
                    result_variable: 'amount'
                },
                {
                    question: 'Enter your wallet pin',
                    fail_message: 'That is not a valid pin, it needs to be numeric',
                    // TODO: validate pins
                    validate: function(v) {
                        return /\d+/.test;
                    },
                    result_variable: 'pin'
                },
                function(operation_data) {
                    api.post(
                        'http://localhost:9001/v1/payment',
                        {
                            auth: {
                                username: opts.im.user_addr,
                                pin: operation_data.pin
                            },
                            data: {
                                amount: operation_data.amount,
                                frommisdn: opts.im.user_addr,
                                tomsisdn: operation_data.to_msisdn
                            }
                        })
                        .then(function(result) {
                            // DO STUFF
                            console.log(result);
                        });
                }
            ]);
        self.operations = {
            make_payment: self.make_payment,
        };

        if (!self.operations[opts.operation]) {
            throw new Error('no such operation');
        }
        self.operation = self.operations[opts.operation];
    };
    //      questions: [{
    //          question: 'What is the mobile number of your recipient?',
    //          result_variable: 'to_msisdn',
    //          validate: function()
    //      }]
    //
    self._make_operation = function(name, questions) {
        if (!self.metadata.operation_data[name]) {
            self.metadata.operation_data[name] = {
                _current_step: 0
            };
        }
        return function() {
            var operation_data = self.metadata.operation_data[name];
            var question = questions[operation_data._current_step];
            if (self.metadata.input) {
                if (question.validate(self.metadata.input)) {
                    operation_data[question.result_variable] = self.metadata.input;
                    self.metadata.input = '';
                    operation_data._current_step++;
                } else {
                    self._text = question.fail_message; 
                }
            } 
            // in case we have moved on to the next step at this point
            question = questions[operation_data._current_step];
            if (!self.metadata.input && !self._text) {
                if (question.question) {
                    self._text = question.question;
                } 
                // a callback that should do things
                else {
                    question(operation_data);
                }
            }
        };
    };

    self.on('state:input', function(e) {
        var content = (e.content || '').trim();
        console.log('content '+content);
        self.metadata.input = content;
    });

    self.display = function() {
        self.operation();
        var text = self._text;
        self._text = false;
        if (!text) {
            console.error('aaaah');
        }
        return text;
    };

});

go.init = function() {


    /*return {
        im: new InteractionMachine(api, new GoApp())
    };*/
}();
