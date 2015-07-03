// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

function Stellar() {
    /**
     * Set up authentication states
     *
     * opts.app - InteractionMachine
     * opts.initial_state - State we start from
     * opts.success_state - state to go to on succcessful authentication
     * opts.failure_state - state to move to on authentication failure
     */
    function register_authentication_states(opts) {
        var app = opts.app;
        app.states.add(
            opts.initial_state,
            function(name) {
                return new ChoiceState(
                    n
            });
    }

    return {
        register_authentication_states: register_authentication_states
    };
}

module.exports = new Stellar();

var vumigo = require('vumigo_v02');
var stallar = require('../');


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

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoApp = go.app.GoApp;


    return {
        im: new InteractionMachine(api, new GoApp())
    };
}();
