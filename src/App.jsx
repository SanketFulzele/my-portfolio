import MyPortfolio from './MyPortfolio/MyPortfolio'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <MyPortfolio />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
export default App
