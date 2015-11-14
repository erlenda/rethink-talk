var React = require('React');

module.exports = React.createClass({
  render: function() {
    var teamRows = this.data.teams.value().map(function(t) {
      return  <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.won}</td>
                <td>{t.lost}</td>
                <td>{t.tie}</td>
              </tr>;
    });
    return(
      <table className="highlight bordered">
       <thead>
         <tr>
             <th data-field="name">Name</th>
             <th data-field="won">Won</th>
             <th data-field="lost">Lost</th>
             <th data-field="tie">Tie</th>
         </tr>
       </thead>
       <tbody>
          {teamRows}
       </tbody>
     </table>
    );
  }
});
