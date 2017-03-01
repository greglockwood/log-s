import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import * as format from '../../utils/format';

@inject('store')
@observer
export default class Record extends Component {
  constructor(props) {
    super(props);
    this.onSelect = ::this.onSelect;
  }

  onSelect() {
    const { record, store } = this.props;
    store.select(record.id);
  }

  render() {
    const { record, store } = this.props;

    const classes = [
      'record',
      record.level,
      store.selectedId === record.id ? 'selected' : ''
    ].join(' ');

    return (
      <div className={classes} onClick={this.onSelect}>
        <span className="date">{format.date(record.date)}</span>
        &nbsp;
        <span className="text">{formatData(record.data)}</span>
      </div>
    );
  }
}

function formatData(data, recursive = true) {
  if (recursive && Array.isArray(data)) {
    return data.map(d => formatData(d, false)).join(' ');
  }

  if (typeof data !== 'object') {
    return data.toString();
  }

  return format.object(data);
}