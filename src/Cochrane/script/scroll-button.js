/**
 * Class ScrollButton
 *
 * Button which scrolls page to div
 */
class ScrollButton {
    constructor($scrollButtonElement) {
        this._$scrollButtonElement = $scrollButtonElement

        this._$scrollButtonElement.on('click', evt => this.handleClickEvent(evt))
    }

    handleClickEvent(evt) {

        var target = '.' + this._$scrollButtonElement.data('target-class');

        $('html,body').animate({
            scrollTop: $(target).offset().top
        });
    }
}

module.exports = ScrollButton;
