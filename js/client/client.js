var React = require('React');
var table = require('../compos/table');

var App = React.createClass({
  componentDidMount: function () {
    console.log('componentDidMount()');
  },
  render: function() {
    var hello = 'hello';
    return (
      <div>
        {hello}
        {table}
      </div>
    );
  }
}, document.getElementById('app'));
