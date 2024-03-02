const initialControlsCount = 3;

const controlsWrapper = findRef('controls');
const btnAdd = findRef('btn-add');

const state = createState({
  sum: undefined,
  average: undefined,
  min: undefined,
  max: undefined,
});

function main() {
  repeat(initialControlsCount, appendControl);
  btnAdd.addEventListener('click', appendControl);
}

function appendControl() {
  const wrapper = document.createElement('div');
  const control = document.createElement('input');
  control.type = 'number';
  control.dataset.ref = 'control';
  control.addEventListener('input', updateStateFromControls);
  const btnRemove = document.createElement('button');
  btnRemove.textContent = '-';

  btnRemove.addEventListener('click', () => {
    wrapper.remove();
    updateStateFromControls();
  });

  wrapper.appendChild(control);
  wrapper.appendChild(btnRemove);
  controlsWrapper.appendChild(wrapper);
}

function getControlsValues() {
  return findRefs('control', controlsWrapper).map(control => control.value);
}

function updateStateFromControls() {
  const textValues = getControlsValues();
  const numberValues = textValues.map(text => parseInt(text));
  updateStateByValues(numberValues);
}

/** @argument {number[]} values */
function updateStateByValues(values) {
  values = values.filter(value => !isNaN(value));
  if (values.length === 0) return state.clear();

  const sum = values.reduce((sum, value) => sum + value, 0);
  state.set('sum', sum);
  state.set('average', sum / values.length);
  state.set('min', Math.min(...values));
  state.set('max', Math.max(...values));
}

function updateTexts(key) {
  findElements('text', key).forEach(element => (element.textContent = state.get(key) ?? ''));
}

function createState(initialValue = {}) {
  return {
    value: initialValue,
    get(key) {
      return this.value[key];
    },
    set(key, value) {
      this.value[key] = value;
      updateTexts(key);
    },
    clear() {
      for (const key of Object.keys(this.value)) {
        this.set(key, undefined);
      }
    },
  };
}

function repeat(count, callable) {
  for (let i = 0; i < count; i++) callable(count);
}

function findRef(name, parent = document) {
  return findElement('ref', name, parent);
}

function findRefs(name, parent = document) {
  return findElements('ref', name, parent);
}

function findElement(key, name, parent = document) {
  return parent.querySelector(`[data-${key}="${name}"]`);
}

function findElements(key, name, parent = document) {
  return [...parent.querySelectorAll(`[data-${key}="${name}"]`)];
}

main();
