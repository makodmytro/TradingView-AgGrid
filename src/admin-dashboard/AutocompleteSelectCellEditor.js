function AutocompleteSelectCellEditor() {}

AutocompleteSelectCellEditor.prototype.init = function(params) {
    this.params = params;
    this.eInput = document.createElement('input');
    this.eList = document.createElement('div');
    this.eList.style.position = 'absolute';
    this.eList.style.border = '1px solid #ccc';
    this.eList.style.backgroundColor = '#fff';
    this.eList.style.maxHeight = '150px';
    this.eList.style.overflowY = 'auto';

    this.eInput.addEventListener('keyup', this.filterOptions.bind(this));
    document.body.appendChild(this.eList);
};

AutocompleteSelectCellEditor.prototype.filterOptions = function() {
    const search = this.eInput.value.toLowerCase();
    while (this.eList.firstChild) {
        this.eList.removeChild(this.eList.firstChild);
    }
    this.params.values.forEach((value) => {
        if (value.toLowerCase().includes(search)) {
            const optionDiv = document.createElement('div');
            optionDiv.style.padding = '5px';
            optionDiv.textContent = value;
            optionDiv.addEventListener('click', () => {
                this.eInput.value = value;
                this.hideOptions();
            });
            this.eList.appendChild(optionDiv);
        }
    });
};

AutocompleteSelectCellEditor.prototype.showOptions = function() {
    this.eList.style.display = 'block';
    const rect = this.eInput.getBoundingClientRect();
    this.eList.style.top = rect.bottom + 'px';
    this.eList.style.left = rect.left + 'px';
    this.eList.style.width = rect.width + 'px';
};

AutocompleteSelectCellEditor.prototype.hideOptions = function() {
    this.eList.style.display = 'none';
};

AutocompleteSelectCellEditor.prototype.getGui = function() {
    return this.eInput;
};

AutocompleteSelectCellEditor.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.showOptions();
};

AutocompleteSelectCellEditor.prototype.isCancelBeforeStart = function() {
    return false;
};

AutocompleteSelectCellEditor.prototype.isCancelAfterEnd = function() {
    return false;
};

AutocompleteSelectCellEditor.prototype.getValue = function() {
    return this.eInput.value;
};

AutocompleteSelectCellEditor.prototype.destroy = function() {
    document.body.removeChild(this.eList);
};

AutocompleteSelectCellEditor.prototype.focusIn = function() {
    this.eInput.focus();
};

export default AutocompleteSelectCellEditor;
