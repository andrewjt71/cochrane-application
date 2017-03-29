/**
 * Class Multi Term Select
 */
class MultiTermSelect {
    constructor($element) {
        this._$multiTermSelectAddButton = $('.multi-term-select__add', $element);
        this._$multiTermSelectTermInput = $('.multi-term-select__adder', $element);
        this._$multiTermSelectPrimary = $('.multi-term-select__primary', $element);
        this._$multiTermSelectPrimary.on('click', evt => this.showTermInputField(evt));
        this._$multiTermSelectTermInput.on('keyup', evt => this.handleTermInputSubmission(evt));
    }

    /**
     * Display term input field
     *
     * @param {} evt
     */
    showTermInputField(evt) {
        var $el = $(evt.target);
        if (!$el.hasClass('multi-term-select__term') && !$el.hasClass('multi-term-select__term__delete-icon')) {
            this._$multiTermSelectTermInput.removeClass('hidden');
            this._$multiTermSelectPrimary.addClass('multi-term-select__primary--adder-displayed');
        this._$multiTermSelectTermInput.focus();
        }
    }

    /**
     * Handle the submission of an added search term
     *
     * @param {} evt
     */
    handleTermInputSubmission(evt) {
        var $el = $(evt.target);
        if (evt.keyCode == 13) {
            this.addValue($el.val());
            this._$multiTermSelectTermInput.val('');
            this._$multiTermSelectTermInput.addClass('hidden');
            this._$multiTermSelectPrimary.removeClass('multi-term-select__primary--adder-displayed');
        }
    }

    /**
     * Add new value to the field
     *
     * @param string value
     */
    addValue(value) {
        var $newItem;

        if (value == '') {
            return;
        }

        $newItem = $("<a class='ui label transition visible multi-term-select__term' data-value='"+ value +"' style='display: inline-block !important;'>" + value + "<i class='multi-term-select__term__delete-icon delete icon'></i></a>");

        this._$multiTermSelectPrimary.append($newItem);
        $newItem.find('.delete.icon').on('click', function () {
            $(this).parent().remove();
        });
    }

    /**
     * Get values from the field
     */
    getValues() {
        var values = [];

        $('.multi-term-select__term', this._$multiTermSelectPrimary).each(function() {
            values.push($(this).data('value'));
        });

        return values;
    }

    /**
     * Clear terms added to the field
     */
    clearTerms() {
        $('.multi-term-select__term', this._$multiTermSelectPrimary).remove();
    }
}

module.exports = MultiTermSelect;


