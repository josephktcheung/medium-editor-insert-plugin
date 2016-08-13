describe('Gallery addon', function () {
    beforeEach(function () {
        $('body').append('<div id="fixtures"><div class="editable"></div></div>');
        this.$el = $('.editable');
        this.editor = new MediumEditor(this.$el.get(0));
        this.$el.mediumInsert({
            editor: this.editor,
            addons: {
                gallery: {
                    images: [
                        '/example1.jpg',
                        '/example2.jpg',
                        '/example3.jpg'
                    ]
                }
            }
        });
        this.addon = this.$el.data('plugin_mediumInsertGallery');

        jasmine.clock().install();
    });

    afterEach(function () {
        $('#fixtures').remove();

        jasmine.clock().uninstall();
    });

    it('adds modal to document body', function () {
        expect($('.medium-insert-gallery-modal').length).toEqual(1);
    });

    it('hides modal initially', function () {
        expect($('.medium-insert-gallery-modal').css('display')).toEqual('none');
    });

    it('shows modal when user clicks addon button', function () {
        this.addon.add();
        expect($('.medium-insert-gallery-modal').css('display')).toEqual('block');
    });

    it('shows all images', function () {
        expect($('.medium-insert-gallery-image').length).toEqual(3);
    });

    it('supports selecting image', function () {
        var $firstImage = $('.medium-insert-gallery-image')
            .first();

        $firstImage.click();

        expect($firstImage.hasClass('medium-insert-gallery-image-active')).toBe(true);
    });

    it('supports toggling image', function () {
        var $firstImage = $('.medium-insert-gallery-image')
            .first()
            .addClass('medium-insert-gallery-image-active');

        $firstImage.click();

        expect($firstImage.hasClass('medium-insert-gallery-image-active')).toBe(false);
    });

    it('inserts selected images after clicking confirm', function () {
        this.$el.find('p').addClass('medium-insert-active');

        $('.medium-insert-gallery-image')
            .first()
            .click();

        $('.medium-insert-gallery-image')
            .last()
            .click();

        $('#medium-insert-gallery-confirm').click();

        jasmine.clock().tick(50);

        expect(this.$el.find('img').length).toEqual(2);
    });

    it('hides modal after clicking confirm', function () {
        $('.medium-insert-gallery-modal').show();

        $('#medium-insert-gallery-confirm').click();

        expect($('.medium-insert-gallery-modal').css('display')).toEqual('none');
    });

    it('resets selected images after clicking confirm', function () {
        $('.medium-insert-gallery-image')
            .first()
            .addClass('medium-insert-gallery-image-active');

        $('#medium-insert-gallery-confirm').click();

        expect($('.medium-insert-gallery-image').first().hasClass('medium-insert-gallery-image-active')).toBe(false);
    });

    it('resets selected images after clicking cancel', function () {
        $('.medium-insert-gallery-image')
            .first()
            .addClass('medium-insert-gallery-image-active');

        $('#medium-insert-gallery-cancel').click();

        expect($('.medium-insert-gallery-image').first().hasClass('medium-insert-gallery-image-active')).toBe(false);
    });

    it('hides modal after clicking cancel', function () {
        $('.medium-insert-gallery-modal').show();

        $('#medium-insert-gallery-cancel').click();

        expect($('.medium-insert-gallery-modal').css('display')).toEqual('none');
    });
});
