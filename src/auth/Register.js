import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/fontawesome-all.min.css';
import './css/iofrm-style.css';
import './css/iofrm-theme14.css';


const Register = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
    };

    return (
        <div className="form-body">
            <div className="row">
                <div className="form-holder">
                    <div className="form-content">
                        <div className="form-items">
                            <div className="website-logo-inside">
                                <a href="/">
                                    <div className="logo">
                                        {/* Uncomment the next line if you've imported LogoImage */}
                                        {/* <img className="logo-size" src={LogoImage} alt="" /> */}
                                    </div>
                                </a>
                            </div>
                            <h3>Get more things done with Login platform.</h3>
                            <p>Access to the most powerful tool in the entire design and web industry.</p>
                            <div className="page-links">
                                <a href="/">Login</a><a href="/register" className="active">Register</a>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <input className="form-control" type="text" name="name" placeholder="Full Name" required />
                                <input className="form-control" type="email" name="email" placeholder="E-mail Address" required />
                                <input className="form-control" type="password" name="password" placeholder="Password" required />
                                <div className="form-button">
                                    <button id="submit" type="submit" className="ibtn">Register</button>
                                </div>
                            </form>
                            {/*<div className="other-links">*/}
                            {/*    <span>Or register with</span>*/}
                            {/*    <a href="#"><i className="fab fa-facebook-f"></i></a>*/}
                            {/*    <a href="#"><i className="fab fa-google"></i></a>*/}
                            {/*    <a href="#"><i className="fab fa-linkedin-in"></i></a>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;