import React, { Component } from "react";
import { connect } from "react-redux";
//import StoreContext from "../contexts/storeContext";
import bugs, { loadBugs, fixBug, getUnresolvedBugs } from "../store/bugs";

class Bugs extends Component {
  //static contextType = StoreContext;
  //state = { bugs: [] };

  componentDidMount() {
    /*const store = this.context;

    this.unsubscribe = store.subscribe(() => {
      const bugsInStore = store.getState().entities.bugs.list;
      if (this.state.bugs !== bugsInStore) this.setState({ bugs: bugsInStore });
    });

    store.dispatch(loadBugs());*/

    this.props.loadBugs();
  }

  componentWillUnmount() {
    //this.unsubscribe();
  }

  render() {
    return (
      <ul>
        {/* {this.state.bugs.map((bug) => ( */}
        {this.props.bugs.map((bug) => (
          <li key={bug.id}>
            {bug.description}
            <button onClick={() => this.props.fixBug(bug.id)}>Resolve</button>
          </li>
        ))}
      </ul>
    );
  }
}

// Bugs.contextType = StoreContext
const mapStateToProps = (state) => ({
  // bugs: state.entities.bugs.list,
  bugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBugs: () => dispatch(loadBugs()),
  fixBug: (id) => dispatch(fixBug(id)),
});

// export default Bugs;

// Container component
// Below implementation takes care of subscribing and unsubscribing to store because a new component is created under the hood that warps Bugs component
export default connect(mapStateToProps, mapDispatchToProps)(Bugs);
