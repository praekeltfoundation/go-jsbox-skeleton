var State = require('vumigo_v02').lib.states.State;

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
var flows = {
    make_payment: [
        'What is the mobile number of your recipient?',
        'How many Stellars are you sending?',
    ],

};


// opts.im 
var StellarState = State.extend(function(self, name, opts) {
    // var msisdn = opts.im.user_addr;
    self._text = '';
    var api = new JsonApi(opts.im);

    self.metadata.operation_data = {};
    //      questions: [{
    //          question: 'What is the mobile number of your recipient?',
    //          result_variable: 'to_msisdn',
    //          validate: function()
    //      }]
    //
    self._make_operation = function(name, questions) {
        self.metadata.operation_data[name] = {
            _current_step: 0
        };
        return function() {
            var operation_data = self.metadata.operation_data[name];
            var question = questions[operation_data._current_step]
            if (self.metadata.input) {
                if (question.validate(self.metadata.input)) {
                    operation_data[question.result_variable] = self.metadata.input;
                    self.metadata.input = '';
                    operation_data._current_step++;
                } else {
                    self._text = 'Please try again, 
                }
            } 
            // in case we have moved on to the next step at this point
            question = questions[operation_data._current_step]
            if (!self.metadata.input) {
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

    self.make_payment = self._make_operation(
        'make_payment',
        [
            {
                question: 'Enter the mobile number of recipient',
                fail_message: 'That is not a valid mobile number, please try again',
                // TODO: only tests South african phone numbers
                validate: /^(\+?27|0)\d{9}$/.test,
                result_variable: 'to_msisdn'
            },
            {
                question: 'Enter the amount you wish to send',
                fail_message: 'Please enter a numerical amount',
                validate: /\d+/.test,
                result_variable: 'amount'
            },
            {
                question: 'Enter your wallet pin',
                fail_message: 'That is not a valid pin, it needs to be numeric',
                // TODO: validate pins
                validate: /\d+/.test,
                result_variable: 'pin'
            },
            function(operation_data) {
                api.post('http://localhost:9001/v1/payment',
                {
                    auth: {
                        username: opts.im.user_addr,
                        pin: operation_data['pin']
                    }
                    data: {
                        amount: operation_data['amount']
                        frommisdn: opts.im.user_addr,
                        tomsisdn: operation_data['to_msisdn']
                    }
                }).then(function(result) {
                    // DO STUFF
                });
            }
        ]);

    self.make_payment = function() {
        // we haven't yet requested the recipient msisdn, do that
        if (!self.metadata.to_msisdn) {
            // we just received the input
            if (self.metadata.input) {
                self.metadata.to_msisdn = self.metadata.input;
                // TODO validate
                self.metadata.input = '';
            } else {
                self._text = 'What is the mobile number of your recipient';
                return;
            }
        }

        // request the amount
        if (!self.metadata.amount) {
            if (self.metadata.input) {
                self.metadata.amount = self.metadata.input;
                // TODO validate
                self.metadata.input = '';
            } else {
                self._text = 'How much do you want to send?';
                return;
            }
        }
    };

    self.on('state:input', function(e) {
    });

    self.display = function() {
        self.operation
    };

    self.operations = {
        make_payment: self.make_payment,
    };

    if (!self.operations[opts.operation]) {
        throw new Error('no such operation');
    }
    self.operation = self.operations[opts.operation];

    State.call(self, name, opts);

}
