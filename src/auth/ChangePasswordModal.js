import React, { useState } from 'react';
import styles from './ChangePasswordModal.dark.module.scss';
import {useApiCalls} from "../api/API";

const ChangePasswordModal = ({ isOpen, closeModal }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordsVisible, setNewPasswordsVisible] = useState(false);
    const { changePassword} = useApiCalls();
    const handleSubmit = async () => {
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }

        if (!isValidPassword(newPassword)) {
            setErrorMessage("Password must be at least 8 characters and contain two of the following: letters, digits, special characters.");
            return;
        }

        const resp = await changePassword(currentPassword, newPassword);
        console.log("ChangePasswordModal.js: resp: ", resp);
        if(resp && resp.httpStatus === "OK"){
            closeModal(true);
        } else {
            if(resp && resp.message){
                setErrorMessage(resp.message);
            } else if(resp && resp.error){
                setErrorMessage(resp.error);
            } else if(typeof resp === "string"){
                setErrorMessage(resp);
            }
        }
        // TODO: Call your API to change the password here

        // On success:
        // closeModal();
        // Display a toast or message confirming the password change.
    }
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
        setOldPasswordVisible(!oldPasswordVisible);
    }
    const toggleNewPasswordsVisibility = () => {
        setNewPasswordsVisible(!newPasswordsVisible);
    }

    return isOpen ? (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Change Password</h2>
                <div className={styles.inputGroup}>
                    <label>Current Password</label>
                    <input type={oldPasswordVisible ? 'text' : 'password'}
                           value={currentPassword}
                           onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <i
                        onClick={togglePasswordVisibility}
                        style={{ position: 'absolute', top: '70%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        className={`fa ${oldPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>New Password</label>
                    <input type={newPasswordsVisible ? 'text' : 'password'}
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)} />
                    <i
                        onClick={toggleNewPasswordsVisibility}
                        style={{ position: 'absolute', top: '70%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        className={`fa ${newPasswordsVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Confirm New Password</label>
                    <input type={newPasswordsVisible ? 'text' : 'password'}
                           value={confirmNewPassword}
                           onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    <i
                        onClick={toggleNewPasswordsVisibility}
                        style={{ position: 'absolute', top: '70%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        className={`fa ${newPasswordsVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                    />
                </div>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <button onClick={handleSubmit}>Submit</button>
                <button className={styles.cancelButton} onClick={closeModal}>Cancel</button>
            </div>
        </div>
    ) : null;
};

export default ChangePasswordModal;
