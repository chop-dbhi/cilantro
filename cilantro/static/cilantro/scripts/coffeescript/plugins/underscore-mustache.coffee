define [
    'underscore'
], (_) ->

    _.templateSettings =
         evaluate : /\{\[([\s\S]+?)\]\}/g
         interpolate : /\{\{([\s\S]+?)\}\}/g
