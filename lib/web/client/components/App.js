import { Provider } from 'mobx-react';

import store from '../store';

import Header from './Header';
import LogList from './list/LogList';
import LogView from './LogView';

export default function App() {
  return (
    <Provider store={store}>
      <div className="react-wrapper main">
        <Header />
        <LogList />
        <LogView />
      </div>
    </Provider>
  );
}