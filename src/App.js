import { Provider } from "react-redux";
import "./App.css";
import Bugs from "./components/Bugs";
// import StoreContext from "./contexts/storeContext";
import configureStore from "./store/configureStore";
import BugsList from "./components/BugsList";

const store = configureStore();

function App() {
  return (
    /*<StoreContext.Provider value={store}>
       <Bugs />
     </StoreContext.Provider>*/
    <Provider store={store}>
      <Bugs />
      {/* <BugsList /> */}
    </Provider>
  );
}

export default App;
