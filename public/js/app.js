requirejs.config({
    "baseUrl": "/",
    "paths": {
      "async": 'js/requirejs-plugins/async',
      "order": 'js/requirejs-plugins/order',
      "assets": "assets",
      "jquery": "assets/jquery",
      "jquery_ujs": "assets/jquery_ujs",
      "scroll": "js/jquery.jscroll",
      "underscore": "js/underscore",
      "backbone": "js/backbone",
      "map": "js/map",
      "application": "assets/application"
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
      },
      map : {
        exports: "Map"
      },
      jquery_ujs : {
        
      }
  }
});

requirejs(["/js/main.js"]);