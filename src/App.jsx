import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div className="title">This is a react ssr demo</div>
        <ul className="nav">
          <li>Bar</li>
          <li>Baz</li>
          <li>Foo</li>
          <li>TopList</li>
        </ul>
        <div className="view">
        </div>
      </div>
    );
  }
}
