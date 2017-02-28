/*
main.js entry point voor movies app
 */

requirejs.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone'
    },

    shim: {
        underscore: {
            exports: "_"
        },

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

//Require laadt de app
require(['movies'],
    function(movies) {
    movies.start(); //start de movies app
});