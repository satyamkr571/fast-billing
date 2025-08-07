import "./App.css";
import Header from "./components/header/Header";
import InvoiceGenerator from "./components/invoice/Invoice";
import profileIcon from "../src/assets/icons/profileIcon.jpg";

function App() {
  return (
    <div className="App">
      <Header user={{ name: "Satyam Kumar", avatar: profileIcon }} />
      <InvoiceGenerator />
    </div>
  );
}

export default App;
