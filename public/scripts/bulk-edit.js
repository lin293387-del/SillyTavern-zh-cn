import { characterGroupOverlay, printCharacters } from '../script.js';
import { BulkEditOverlay, BulkEditOverlayState, CharacterContextMenu } from './BulkEditOverlay.js';
import { event_types, eventSource } from './events.js';

let is_bulk_edit = false;

const enableBulkEdit = async () => {
    await enableBulkSelect();
    characterGroupOverlay.selectState();
    // show the bulk edit option buttons
    $('.bulkEditOptionElement').show();
    is_bulk_edit = true;
    characterGroupOverlay.updateSelectedCount(0);
};

const disableBulkEdit = async () => {
    await disableBulkSelect();
    characterGroupOverlay.browseState();
    // hide the bulk edit option buttons
    $('.bulkEditOptionElement').hide();
    is_bulk_edit = false;
    characterGroupOverlay.updateSelectedCount(0);
};

const toggleBulkEditMode = async (isBulkEdit) => {
    if (isBulkEdit) {
        await disableBulkEdit();
    } else {
        await enableBulkEdit();
    }
};

/**
 * Toggles bulk edit mode on/off when the edit button is clicked.
 */
async function onEditButtonClick() {
    console.log('Edit button clicked');
    await toggleBulkEditMode(is_bulk_edit);
}

/**
 * Toggles the select state of all characters in bulk edit mode to selected. If all are selected, they'll be deselected.
 */
function onSelectAllButtonClick() {
    console.log('Bulk select all button clicked');
    const characters = Array.from(document.querySelectorAll('#' + BulkEditOverlay.containerId + ' .' + BulkEditOverlay.characterClass));
    let atLeastOneSelected = false;
    for (const character of characters) {
        const checked = $(character).find('.bulk_select_checkbox:checked').length > 0;
        if (!checked && character instanceof HTMLElement) {
            characterGroupOverlay.toggleSingleCharacter(character);
            atLeastOneSelected = true;
        }
    }

    if (!atLeastOneSelected) {
        // If none was selected, trigger click on all to deselect all of them
        for(const character of characters) {
            const checked = $(character).find('.bulk_select_checkbox:checked') ?? false;
            if (checked && character instanceof HTMLElement) {
                characterGroupOverlay.toggleSingleCharacter(character);
            }
        }
    }
}

/**
 * Deletes all characters that have been selected via the bulk checkboxes.
 */
async function onDeleteButtonClick() {
    console.log('Delete button clicked');

    // We just let the button trigger the context menu delete option
    await characterGroupOverlay.handleContextMenuDelete();
}

/**
 * Enables bulk selection by adding a checkbox next to each character.
 */
async function enableBulkSelect() {
    const container = $('#rm_print_characters_block');
    container.addClass('bulk_select');
    await printCharacters(false);

    container.find('.character_select').each((_, el) => {
        if ($(el).find('.bulk_select_checkbox').length > 0) {
            return;
        }
        const checkbox = $('<input type=\'checkbox\' class=\'bulk_select_checkbox\'>');
        checkbox.on('change', () => {});
        $(el).prepend(checkbox);
    });

    container.addClass('bulk_select');
    $('#rm_print_characters_block.group_overlay_mode_select .bogus_folder_select, #rm_print_characters_block.group_overlay_mode_select .group_select')
        .addClass('disabled');

    $(document).on('click', '.bulk_select_checkbox', function (event) {
        event.stopImmediatePropagation();
    });
}

/**
 * Disables bulk selection by removing the checkboxes.
 */
async function disableBulkSelect() {
    const container = $('#rm_print_characters_block');
    container.removeClass('bulk_select');
    $(document).off('click', '.bulk_select_checkbox');

    await printCharacters(false);

    $('.bulk_select_checkbox').remove();
    $('#rm_print_characters_block.group_overlay_mode_select .bogus_folder_select, #rm_print_characters_block.group_overlay_mode_select .group_select')
        .removeClass('disabled');
}

/**
 * Entry point that runs on page load.
 */
export function initBulkEdit() {
    characterGroupOverlay.addStateChangeCallback((state) => {
        if (state === BulkEditOverlayState.select) enableBulkEdit().catch(console.error);
        if (state === BulkEditOverlayState.browse) disableBulkEdit().catch(console.error);
    });

    $('#bulkEditButton').on('click', onEditButtonClick);
    $('#bulkSelectAllButton').on('click', onSelectAllButtonClick);
    $('#bulkDeleteButton').on('click', onDeleteButtonClick);

    const characterContextMenu = new CharacterContextMenu(characterGroupOverlay);
    eventSource.on(event_types.CHARACTER_PAGE_LOADED, characterGroupOverlay.onPageLoad);
    console.debug('Character context menu initialized', characterContextMenu);
}
