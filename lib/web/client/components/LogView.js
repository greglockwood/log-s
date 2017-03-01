import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import * as format from '../utils/format';

let componentId = 0;

@inject('store')
@observer
export default class extends Component {
  constructor(props) {
    super(props);
    this.onClose = ::this.onClose;
  }

  onClose() {
    this.props.store.select(null);
  }

  render() {
    const { store } = this.props;
    const selected = store.selected;

    if (!selected) {
      return null;
    }

    return (
      <footer>
        <i className="icon-close" onClick={this.onClose} />
        <ObjectView value={selected.data} name="data" />
        <ObjectView value={selected.client} name="client" />
      </footer>
    );
  }
}

function ObjectView({ value, name }) {
  const complex = isComplex(value);
  const isString = typeof value === 'string';
  const id = componentId++;

  const valuePreview = format.object(value);
  const valueChar = valuePreview ? valuePreview.charAt(0) : null
  let valueClass = '';

  if (valueChar === '"') {
    valueClass = 'string';
  } else if (valueChar === '{' || valueChar === '[') {
    valueClass = '';
  } else {
    valueClass = 'scalar';
  }

  return (
    <div className="param">
      {complex &&  <input id={id} type="checkbox" />}
      <label htmlFor={id}>
        {name}<span className={valueClass}>: {valuePreview}</span>
      </label>
      {complex && (
        <div className="children">
          {!isString && mapObject(value, (val, n) => {
            return <ObjectView key={n} value={val} name={n} />;
          })}
          {isString && value}
        </div>
      )}
    </div>
  );
}

function isComplex(object) {
  if (Array.isArray(object) && object.length > 0) {
    return true;
  }

  if (typeof object === 'object' && Object.keys(object).length > 0) {
    return true;
  }

  //noinspection RedundantIfStatementJS
  if (typeof object === 'string' && object.length > 100) {
    return true;
  }

  return false;
}

function mapObject(object, callback) {
  if (Array.isArray(object)) {
    return object.map(callback);
  }

  const result = [];
  for (const i in object) {
    if (!object.hasOwnProperty(i)) return;
    result.push(callback(object[i], i));
  }

  return result;
}