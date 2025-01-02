import React,{useEffect,useState} from 'react'
import Header from '../layout/Header'
import Navbar from '../layout/Navbar'
import AppContent from './Paste'
// import Loader from '../layout/loader'
import _ from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { Config } from '../config/connect';
import axios from 'axios';
export default function Application() {
  const api=Config.urlApi;
  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);
  const [minified,setMinified]=useState(false);
  const routes=['/r-sale' && '/received']

  const navigate = useNavigate();
  useEffect(() => {
    // if (!token) {
    //   navigate('/login');
    // }

    const token = localStorage.getItem('token'); // Get token from localStorage
    const checkTokenAndMakeRequest = async () => {
      if (!token) {
        navigate('/login');
      } else {
        try {
          const resp = await axios.post(api + 'login/authen', {}, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + token
            }
          });

          console.log('Response:', resp.data); 
        } catch (error) {
          console.error('Error making the API request:', error); // Handle errors
          navigate('/login');
        }
      }
    };

    checkTokenAndMakeRequest();

    setPath(pathName);
    if(_.includes(routes,path)){
      setMinified(true);
    }
  }, [pathName,navigate]);
  return (
    <>
      {/* <Loader /> */}
      { path=== "/login" || path=== "/sale" ||  path=== "/price-days" ? (
        <AppContent />
      ) : (
        <div id="app" class={`app app-header-fixed app-sidebar-fixed app-gradient-enabled app-content-full-height ${minified == true ? 'app-sidebar-minified' :'' }`}>
      {/* <div id="app" className="app app-header-fixed app-sidebar-fixed app-without-sidebar "> */}
        <Header />
        <Navbar />
        <AppContent />
        <a href="javascript:;" class="btn btn-icon btn-circle btn-theme btn-scroll-to-top" data-toggle="scroll-to-top"><i class="fa fa-angle-up"></i></a>
      </div>
      )}
    </>
  )
}
