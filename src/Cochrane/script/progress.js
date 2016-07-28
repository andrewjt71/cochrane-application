class Progress {
    constructor($progressElement) {
        this._$progressElement = $progressElement;
    }

    setTotal(total) {
        this._$progressElement.attr('data-total', total);
        this._$progressElement.attr('data-value', '1');
    }

    increment() {
        this._$progressElement.progress('increment');
    }

    show() {
        this._$progressElement.removeClass('hidden');
    }
}

module.exports = Progress;
