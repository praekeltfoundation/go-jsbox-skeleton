MakePaymentOperationFactory = function(self, opts) {
    return self._make_operation(
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
                    return /^\d+$/.test(v);
                },
                result_variable: 'amount'
            },
            {
                question: 'Enter your wallet pin',
                fail_message: 'That is not a valid pin, it needs to be numeric',
                // TODO: validate pins
                validate: function(v) {
                    return /^\d+$/.test;
                },
                result_variable: 'pin'
            },
            function(operation_data) {
                self.json_api.post(
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
                    });
                return 'Payment pending, we will sms you when it completes';
            }
        ]);
};
