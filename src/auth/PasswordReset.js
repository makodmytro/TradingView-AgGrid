import React, { useState } from 'react';
import {toast, ToastContainer} from 'react-toastify';  // Assuming you're using react-toastify
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/fontawesome-all.min.css';
import './css/iofrm-style.css';
import './css/iofrm-theme14.css';
import {useApiCalls} from "../api/API";

const PasswordReset = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { requestPasswordReset, resetPassword} = useApiCalls();



    const sendResetCode = async () => {
        // Make your remote call here.
        // For the sake of the example, I'm simulating an asynchronous call using setTimeout.
        const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        if (!isValidEmail(email)) {
            toast.error('Invalid email address!', { position: toast.POSITION.TOP_CENTER });
            return;
        }
        const resp = await requestPasswordReset(email);

        if(resp && resp.httpStatus === "OK"){
            toast.success('Reset code sent successfully!', { position: toast.POSITION.TOP_CENTER });
            setStep(2);
        } else {
            if(resp && resp.message){
                toast.error(resp.message, { position: toast.POSITION.TOP_CENTER });
            } else if(resp && resp.error){
                toast.error(resp.error, { position: toast.POSITION.TOP_CENTER });
            } else if(typeof resp === "string"){
                toast.error(resp, { position: toast.POSITION.TOP_CENTER });
            }
        }
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!', { position: toast.POSITION.TOP_CENTER });
            return;
        }

        if (!isValidPassword(newPassword)) {
            toast.error("Password must be at least 8 characters and contain two of the following: letters, digits, special characters.", { position: toast.POSITION.TOP_CENTER });
            return;
        }
        const resp = await resetPassword(email, resetCode, newPassword);

        if(resp && resp.httpStatus === "OK"){
            toast.success('Password reset successfully!', { position: toast.POSITION.TOP_CENTER });
            setStep(3);
        } else {
            if(resp && resp.message){
                toast.error(resp.message, { position: toast.POSITION.TOP_CENTER });
            } else if(resp && resp.error){
                toast.error(resp.error, { position: toast.POSITION.TOP_CENTER });
            } else if(typeof resp === "string"){
                toast.error(resp, { position: toast.POSITION.TOP_CENTER });
            }
        }
    };

    const isValidPassword = (password) => {
        if (password.length < 8) {
            return false;
        }

        const containsLetters = /[A-Za-z]/.test(password);
        const containsDigits = /\d/.test(password);
        const containsSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const typesCount = [containsLetters, containsDigits, containsSpecialChars].filter(Boolean).length;

        return typesCount >= 2;
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-body">
            <div className="row">
                <div className="form-holder">
                    <div className="form-content">
                        <div className="form-items">
                            <div className="website-logo-inside">
                                <a href="index.html">
                                    <div className="logo">
                                        <img className="logo-size" src="images/logo-light.svg" alt="" />
                                    </div>
                                </a>
                            </div>

                            {step === 1 && (
                                <>
                                    <h3>Password Reset</h3>
                                    <p>To reset your password, enter the email address you use to sign in to nexday.ai</p>
                                    <input className="form-control" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail Address" required />
                                    <div className="form-button full-width">
                                        <button type="button" className="ibtn btn-forget" onClick={sendResetCode}>Send Reset Code</button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <h3>Enter Reset Code and New Password</h3>
                                    <input className="form-control" type="text" value={resetCode} onChange={e => setResetCode(e.target.value)} placeholder="Enter Reset Code" required />
                                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                        <input className="form-control"
                                               type={showPassword ? "text" : "password"}
                                               value={newPassword}
                                               onChange={e => setNewPassword(e.target.value)}
                                               placeholder="Enter New Password"
                                               required />
                                        <i
                                            onClick={togglePasswordVisibility}
                                            style={{ position: 'absolute', top: '38%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                        />
                                    </div>
                                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>

                                        <input className="form-control"
                                               type={showPassword ? "text" : "password"}
                                               value={confirmPassword}
                                               onChange={e => setConfirmPassword(e.target.value)}
                                               placeholder="Confirm New Password" required />
                                        <i
                                            onClick={togglePasswordVisibility}
                                            style={{ position: 'absolute', top: '38%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                        />

                                    </div>
                                    <div className="form-button full-width">
                                        <button type="button" className="ibtn btn-forget" onClick={handlePasswordReset}>Reset Password</button>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <h3>Password Reset Successfully!</h3>
                                    <p>You can now log in with your new password.</p>
                                    <div className="form-button full-width">
                                        <a href="/" className="ibtn btn-forget">Go to Login</a>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="form-sent">
                            {/* ... (Content for form-sent div goes here) */}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PasswordReset;
