var $ = require('jquery');
var Backbone = require('backbone');
var recipeListTemplate = require('../templates/Recipe-list.hbs');
require('malihu-custom-scrollbar-plugin')($);

var App = require('../app');

var RecipeList = Backbone.View.extend({
  el: $('main'),
  collection: App.Collections.recipe,

  render: function (searchTerm, byCategory) {
    var _this = this;
    var recipeCollection = this.collection;


    recipeCollection.fetch().done(function () {

      if (byCategory) {
        var recipes = recipeCollection.filter(function (model) {
          return model.get('category') === searchTerm
        })
        .map(function (model) {
          return model.toJSON()
        })
        _this.$el.html(recipeListTemplate(recipes));
      }

      else if (searchTerm) {
        var recipes = recipeCollection.filter(function (model) {
          var match = false
          match = (new RegExp('.*' + searchTerm + '.*'))
            .test(model.get('name'))

          match = (new RegExp('.*' + searchTerm + '.*'))
            .test(model.get('ingredients'))

          return match
        })
        .map(function (model) {
          return model.toJSON()
        })
        if (!recipes.length) {
          _this.$el.html('<div class="borderDiv"> <div class="sorry">Sorry, no results were found<br> matching' + ' ' + '"' + searchTerm + '"' + '.' + '</div>' +
            '<img class="hunger" src="../images/hunger.jpg">' +
            '<div class="sorry contribute">Have your own recipe featuring' + ' ' + searchTerm + '?<br>' + ' ' + 'Add it to our website.<br> We\'re always hungry for new recipes!</div></div>')
          return false
        }
      } else {
        var recipes = recipeCollection.toJSON();
      }
      _this.$el.html(recipeListTemplate(recipes));

      $('.directions').mCustomScrollbar({
        theme: "rounded-dark",
        axis: "y",
          advanced:{
            updateOnContentResize: true
          }
      })

      $('.graph input').knob({
		  	width: '50%',
		  	displayInput: true,
		  	max: 5,
		  	readOnly: true,
		  	fgColor: "white",
        bgColor: "rgba(76, 58, 40, 1)",
        inputColor: "white"
      })
    });
  },
  
});

module.exports = RecipeList;