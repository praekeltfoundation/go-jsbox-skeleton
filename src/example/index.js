var vumigo = require('vumigo_v02');


if (typeof api === "undefined") {
    // testing hook (supplies api when it is not passed in by the real sandbox)
    var api = this.api = new vumigo.dummy_api.DummyApi();
}

var GoApp = vumigo.App.extend(function(self) {
    App.call(self, 'states:start');

    stellar.register_authentication_states({
        app: self,
        initial_state: 'states:start',
        success_state: 'auth_success',
        failure_state: 'auth_fail'
    });
});


var im = new vumigo.InteractionMachine(api, new GoApp());
