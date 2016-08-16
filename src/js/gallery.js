;(function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Gallery', // first char is uppercase
        defaults = {
            label: '<span class="fa fa-folder-open"></span>',
            images: []
        };

    /**
     * Custom Addon object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override defaults
     * @return {void}
     */

    function Gallery(el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_' + pluginName);
        this.options = $.extend(true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Gallery.prototype.init = function () {
        this.$modal = $(this.templates["src/js/templates/gallery-modal.hbs"]({
            images: this.options.images
        }).trim());

        if ($('.medium-insert-gallery-modal').length === 0) {
            $('body').append(this.$modal);
        } else {
            $('.medium-insert-gallery-modal').replaceWith(this.$modal);
        }

        this.$modal.hide();

        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    Gallery.prototype.events = function () {
        this.$modal
            .on('click', '.medium-insert-gallery-image', $.proxy(this, 'selectImage'))
            .on('click', '#medium-insert-gallery-confirm', $.proxy(this, 'confirm'))
            .on('click', '#medium-insert-gallery-cancel', $.proxy(this, 'cancel'));
    };

    /**
     * Get the Core object
     *
     * @return {object} Core object
     */
    Gallery.prototype.getCore = function () {
        return this.core;
    };

    /**
     * Add custom content
     *
     * This function is called when user click on the addon's icon
     *
     * @return {void}
     */

    Gallery.prototype.add = function () {
        this.core.hideButtons();
        this.$modal.show();
    };

    Gallery.prototype.selectImage = function (e) {
        var $image = $(e.target);

        $image.toggleClass('medium-insert-gallery-image-active');
    };

    Gallery.prototype.confirm = function (e) {
        var that = this,
            $place = this.$el.find('.medium-insert-active');

        e.preventDefault();

        $place.click();

        if ($place.is('p')) {
            $place.replaceWith('<div class="medium-insert-active">' + $place.html() + '</div>');
            $place = this.$el.find('.medium-insert-active');
            if ($place.next().is('p')) {
                this.core.moveCaret($place.next());
            } else {
                $place.after('<p><br></p>'); // add empty paragraph so we can move the caret to the next line.
                this.core.moveCaret($place.next());
            }
        }

        $place.addClass('medium-insert-images');

        $('.medium-insert-gallery-image-active')
            .each(function () {
                var $image = $(that.templates['src/js/templates/images-image.hbs']({
                    img: $(this).attr('src')
                })).appendTo($place);

                $(this).removeClass('medium-insert-gallery-image-active');

                if (that.options.captions) {
                    that.core.addCaption($image.closest('figure'), that.options.captionPlaceholder);
                }
            });

        $place.find('br').remove();

        this.$modal.hide();
    };

    Gallery.prototype.cancel = function (e) {
        e.preventDefault();

        $('.medium-insert-gallery-image-active')
            .each(function () {
                $(this).removeClass('medium-insert-gallery-image-active');
            });

        this.$modal.hide();
    };

    /** Addon initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Gallery(this, options));
            }
        });
    };

})(jQuery, window, document);
