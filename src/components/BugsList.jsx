import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBugs, getUnresolvedBugs, fixBug } from "../store/bugs";
const BugsList = () => {
  const dispatch = useDispatch();

  // useSelector(state => state.entities.bugs.list)
  const bugs = useSelector(getUnresolvedBugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, []);

  return (
    <ul>
      {/* {this.state.bugs.map((bug) => ( */}
      {bugs.map((bug) => (
        <li key={bug.id}>
          {bug.description}
          <button onClick={()=> dispatch(fixBug(bug.id))}>Resolve</button>
        </li>
      ))}
    </ul>
  );
};

export default BugsList;
