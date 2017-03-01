import { action, computed, observable } from 'mobx';
import webSocket from './utils/webSocket';

class Store {
  @observable logs = observable.shallowArray();
  @observable selectedId = null;
  @observable paused = false;

  constructor() {
    webSocket.on('clear', ::this.onClear);
    webSocket.on('pause', ::this.onPause);
    webSocket.on('write', ::this.onWrite);
  }

  @action
  async load(offset = 0, limit = 30) {
    const socket = await webSocket.resolveWhenConnected();
    const result = await socket.call('load', { offset, limit});
    this.logs = observable.shallowArray(result.data);
    this.selectedId = null;

    if (result.paused !== undefined) {
      this.paused = result.paused;
    }
  }

  @action
  async clear() {
    this.logs = observable.shallowArray();
    this.selectedId = null;
    const socket = await webSocket.resolveWhenConnected();
    await socket.call('clear');
  }

  @action
  async togglePause() {
    this.paused = !this.paused;
    const socket = await webSocket.resolveWhenConnected();
    const { paused } = await socket.call('togglePause');
    this.paused = paused;
  }

  @action
  select(selectedId) {
    this.selectedId = selectedId;
  }

  @computed get selected() {
    return this.logs.find(l => l.id === this.selectedId);
  }

  @action
  onClear() {
    this.logs = observable.shallowArray();
  }

  @action
  onPause(data) {
    this.paused = data.state;
  }

  @action
  onWrite(data) {
    this.logs.push(data.data);
  }
}

export default new Store();