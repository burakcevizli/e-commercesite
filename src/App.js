import './App.css';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Productpage from './pages/Productpage';
import ProductListPage from './pages/ProductListPage';
import About from './pages/About';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import FormPage from './components/FormPage';
import LoginPage from './components/LoginPage';

import { api } from "../src/api/api"
import { useDispatch } from 'react-redux';
import { setUser } from "../src/store/actions/userActions"

import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import axios from 'axios';
import { setProductList } from './store/actions/productActions';
import { setLoading } from './store/actions/loadingAction';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(setLoading(true))
    const token = localStorage.getItem("token");

    if (token !== null) {
      axios.defaults.headers.common["Authorization"] = token;
      console.log("Token mevcut, otomatik giriş yapılıyor ...");


      api.get("/categories", {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        const categories = res.data;
        console.log("CATEGORI Basarılır cekıldı: ", categories)
        dispatch({ type: "SET_CATEGORY", payload: categories })
      }).catch(error => {
        console.log("CATEGORIES ERROR : ", error.message)
      })

      setTimeout(() => {
      api.get(`products/`)
                .then((response) => {
                    console.log("REPONSE DATA , ", response)
                    dispatch(setProductList(response.data.products))
                    dispatch(setLoading(false));
                })
              }, 1000)


      api.get("/verify", {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          const user = response.data;
          dispatch({ type: "SET_USER", user });

          const newToken = response.data.token;

          localStorage.setItem("token", newToken);

          axios.defaults.headers.common["Authorization"] = newToken;
        })
        .catch((error) => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common["Authorization"];
          console.log("Error token yetkilendirilemedi:", error.message);
        });
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/productlistpage" component={Productpage} />
          <Route path="/shopping" component={ProductListPage} />
          <Route path="/about" component={About} />
          <Route path="/team" component={Team} />
          <Route path="/contact" component={Contact} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/signup" component={FormPage} />
          <Route path="/login" component={LoginPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;