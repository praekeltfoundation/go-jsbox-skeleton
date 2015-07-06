var vumigo = require('vumigo_v02');
var AppTester = vumigo.AppTester;


describe("app", function() {
    describe("StellarApi", function() {
        var app;
        var tester;

        beforeEach(function() {
            var App = vumigo.App.extend(function(self) {
                vumigo.App.call(self, 'states:start');
                self.init = function() {
                };
                self.states.add('states:start', function(name) {
                    return new StellarState(name, {
                        im: self.im,
                        operation: 'make_payment'
                    });
                });
            });
            app = new App();
            tester = new AppTester(app);
            tester.setup.config.app({
                    name: 'test_app'
                });
        });

        it("Initial state", function() {
            return tester
                .check.interaction({
                    state: 'states:start',
                    reply: 'Enter the mobile number of recipient'
                })
                .run();
        });

        it("Check mobile number verification", function() {
            return tester
                .input('sdf')
                .check.interaction({
                    state: 'states:start',
                    reply: 'That is not a valid mobile number, please try again'
                })
                .run();

        });

        it("Input mobile number", function() {
            return tester
                .input('0761234567')
                .check.interaction({
                    state: 'states:start',
                    reply: 'Enter the amount you wish to send'
                })
                .run();
        });

        it("Enter amount", function() {
            return tester
                .inputs(null, '0761234567', '10')
                .check.reply('Enter your wallet pin')
                .run();
        });
    });
});
