import { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.onClearClick = ::this.onClearClick;
    this.onStopClick   = ::this.onStopClick;
  }

  onClearClick() {
    this.props.store.clear();
  }

  onStopClick() {
    this.props.store.togglePause();
  }

  render() {
    const { store } = this.props;
    const stopClass = 'icon-stop ' + (store.paused ? '' : 'active');

    return (
      <header>
        <input className="filter" placeholder="Filter"/>
        <i
          className={stopClass}
          onClick={this.onStopClick}
          title="Start/stop writing logs"
        />
        <i
          className="icon-clear"
          onClick={this.onClearClick}
          title="Clear logs"
        />
      </header>
    );
  }
}