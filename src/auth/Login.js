
import React, {useContext, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/bootstrap.min.css';

import './css/fontawesome-all.min.css';
import './css/iofrm-style.css';
import './css/iofrm-theme14.css';
import 'font-awesome/css/font-awesome.min.css';
import {useApiCalls} from "../api/API";
import {AuthContext} from "../AuthProvider";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const { login } = useApiCalls(); // Get auth function from API
    const {  updateAuthData } = useContext(AuthContext);  // Get setIsLoggedIn from context
    const navigate = useNavigate();

    function parseJwt(token) {
        try {
            // Split the JWT token into its parts
            const [headerEncoded, payloadEncoded] = token.split('.');

            // Base64Url decode the payload
            const payloadDecoded = atob(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/'));

            // Parse the payload as JSON
            const payloadObject = JSON.parse(payloadDecoded);

            // Log or return the payload
            // console.log('JWT payload:', payloadObject);
            return payloadObject;
        } catch (error) {
            console.error('Failed to decode JWT:', error);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            if (response && response.accessToken && response.refreshToken) {
                // Parse JWT and print its payload
                const payload = parseJwt(response.accessToken);
                updateAuthData(response.accessToken, response.refreshToken, payload);
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                if(response && response.message){
                    toast.error(response.message, { position: toast.POSITION.TOP_CENTER });
                } else if(response && response.error){
                    toast.error(response.error, { position: toast.POSITION.TOP_CENTER });
                } else if(typeof response === "string"){
                    toast.error(response, { position: toast.POSITION.TOP_CENTER });
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="form-body">
            <div className="row">
                <div className="form-holder">
                    <div className="form-content">
                        <div className="form-items" >
                            <div className="website-logo-inside">
                                <a href="/">
                                    <div className="logo">
                                        {/* Uncomment the next line if you've imported LogoImage */}
                                        {/* <img className="logo-size" src={LogoImage} alt="" /> */}
                                    </div>
                                </a>
                            </div>
                            <h3><strong>nexday.ai</strong></h3>
                            <p>Probably the most accurate market predictions.</p>
                            {/*<div className="page-links">*/}
                            {/*    <a href="/" className="active">Login</a>*/}
                            {/*    /!*<a href="/register">Register</a>*!/*/}
                            {/*</div>*/}
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="form-control"
                                    style={{color: '#101112'}}
                                    type="text"
                                    name="username"
                                    placeholder="E-mail Address or UserId"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                    <input
                                        className="form-control"
                                        style={{color: '#101112'}}
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <i
                                        onClick={togglePasswordVisibility}
                                        style={{ position: 'absolute', top: '38%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                        className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                    />
                                </div>

                                <div className="form-button">
                                    <button id="submit" type="submit" className="ibtn">Login</button> <a href="/forget">Forget password?</a>
                                </div>
                            </form>
                            {/*<div className="other-links">*/}
                            {/*    <span>Or auth with</span>*/}
                            {/*    <a href="#"><i className="fab fa-facebook-f"></i></a>*/}
                            {/*    <a href="#"><i className="fab fa-google"></i></a>*/}
                            {/*    <a href="#"><i className="fab fa-linkedin-in"></i></a>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;