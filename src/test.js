var vumigo = require('vumigo_v02');
var AppTester = vumigo.AppTester;
var app;
var tester;

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
tester
    .start()
    .check.interaction({
        state: 'states:start',
        reply: '2Enter the mobile number of recipient'
    })
    .run();
