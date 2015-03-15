var App = App || {};

App.initialize = function() {
    App.ws = new WSpace($('#workspace'), PlacementFactory);
    var $placement = null;
    $('#addPlacement').click(function() {
       $placement = App.ws.addPlacement();
    });

    $('#save').click(function() {
       localStorage.setItem('state', JSON.stringify(App.ws.export()));
    });

    $('#restore').click(function() {
        App.ws.restore(JSON.parse(localStorage.getItem('state')));
    });

}


$(App.initialize);