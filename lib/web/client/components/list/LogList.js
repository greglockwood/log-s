import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Record from './Record';

@inject('store')
@observer
export default class LogList extends Component {
  componentWillMount() {
    const { store } = this.props;
    store.load();
  }

  render() {
    const { store } = this.props;
    return (
      <main>
        {store.logs.map(rec => <Record key={rec.id} record={rec} />)}
      </main>
    );
  }
}