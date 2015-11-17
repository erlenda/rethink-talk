var React = require('React');
var SUBS = require('../const/sub');
var SubStore = require('../stores/subscription');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      teams: []
    }
  },
  SubStoreClient: null,
  componentDidMount: function () {
    this.setState({
      teams: [
        { id: 0, name: 'initializing...'}
      ]
    });
    this.SubStoreClient = SubStore();
    this.SubStoreClient.subscribe(SUBS.TEAMS_CHANGED, this.onTeamsChanged)
    //this.SubStoreClient.subscribe(SUBS.MATCHES_CHANGED, this.onMatchesChanged)
  },
  onTeamsChanged: function (event) {
    console.log(event.data);
    var updatedTeams = JSON.parse(event.data);
    var teams = this.state.teams;
    var newTeam = updatedTeams[0];
    newTeam.id = teams.length;
    teams.push(newTeam);

    this.setState({
      teams: teams
    });
  },
  onMatchesChanged: function (event) {
    console.log(event.data);
  },
  render: function() {
    var teamRows = this.state.teams.map(function(t) {
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
