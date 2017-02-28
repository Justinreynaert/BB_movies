/*
Movies module: movies.js
 */

console.log('movies.js geladen');

define([
    'jquery',
    'underscore',
    'backbone'], function($,_,Backbone, films) {

    // MODEL: Film

    var Film = Backbone.Model.extend({
        defaults: {
            filmNr  :0,
            titel : "",
            beschrijving: "",
            genre: "",
            duur: "",
            regisseur: "",
            release: "",
            foto: "noimage.jpg"
        }
    });

    // COLLECTION: filmCollecie
    var FilmCollectie = Backbone.Collection.extend({
        model: Film,
        url: "/api/films"
    });

    //VIEW: één film
    var FilmView = Backbone.View.extend({
        tagName: "div",
        className: "film cf",
        template: $("#filmTemplate").html(),
        render: function() {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
        events: {
            'click .delete':'deleteFilm'
        },
        deleteFilm:function(e) {
            this.model.destroy();
            this.remove();
        }
    });

    //VIEW: filmoverzicht
    var FilmlijstView = Backbone.View.extend({
       el: $("#films"),
        initialize: function(films) {
           var that = this;
           this.collection = new FilmCollectie();
           this.collection.fetch({reset:true});
           this.listenTo(this.collection, 'add', this.renderFilm);
           this.listenTo(this.collection, 'reset', this.render);

        },
        get$Lijst: function(){
           return this.$el.find('.lijst')
        },
        render: function() {
            _.each(this.collection.models, function(item){
                this.renderFilm(item);
            }, this);
            console.log("rendering collection: ", this.collection);
        },

        renderFilm: function(item) {
            var filmView = new FilmView({
                model: item
            });
            this.$lijst.append(filmView.render().el);
        },



        addFilm: function(e) {
            e.preventDefault();
            var formData = {};
            $velden = $('#frmFilm').find('input, textarea');
            $velden.each(function(i, el){
                if($(el).val()!='') {
                    formData[el.name] = $(el).val();
                }
            });

            if(formData.foto) {
                fotoFullPath = formData.foto;
                formData.foto = /([^\\]+)$/.exec(fotoFullPath)[1];
            }

            this.collection.add(new Film(formData));
            $velden.each(function(i,el){
                $(el).val('');
            });
            console.log('addFilm formData: ', formData);
        },

        events: {
            "click #voegtoe":"addFilm"
        }


    });
    return {
        start: function() {
            console.log('movies.start()');
            var films = new FilmlijstView();
        }
    };

});