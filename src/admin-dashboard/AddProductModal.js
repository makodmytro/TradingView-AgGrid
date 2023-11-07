import React, {useState} from "react";
import styles from './AddProductModal.dark.module.scss'

const AddProductModal = ({ isOpen, closeModal }) => {
    const [rootSymbol, setRootSymbol] = useState("");
    const [systemSymbol, setSystemSymbol] = useState("");
    const [name, setName] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [stopLoss, setStopLoss] = useState("");

    const [errorMessage, setErrorMessage] = useState("");


    const handleSubmit =  () => {
        //TODO: Validate form data

        if(!rootSymbol || rootSymbol.length === 0){
            setErrorMessage("Root symbol is required");
            return;
        }

        if(!systemSymbol || systemSymbol.length === 0){
            setErrorMessage("System symbol is required");
            return;
        }
        if (!name || name.length === 0) {
            setErrorMessage("Name is required");
            return;
        }

        if (!takeProfit || takeProfit.length === 0) {
            setErrorMessage("Take profit is required");
            return;
        }

        if (!stopLoss || stopLoss.length === 0) {
            setErrorMessage("Stop loss is required");
            return;
        }
        closeModal({
            rootSymbol,
            systemSymbol,
            name,
            takeProfit,
            stopLoss
        });
    }


    const cancel = () => {
        setErrorMessage("")
        closeModal();
    }

    return isOpen ? (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Add Product</h2>
                <div className={styles.inputGroup}>


                    <label>Root Symbol</label>
                    <input type='text'
                           placeholder={'Enter root symbol'}
                           value={rootSymbol}
                           onChange={(e) => setRootSymbol(e.target.value)}
                    />
                    {/*<br/>*/}
                    <label>System Symbol</label>
                    <input type='text'
                           value={systemSymbol}
                           placeholder={'Enter system symbol'}
                           onChange={(e) => setSystemSymbol(e.target.value)} />
                    {/*<br/>*/}
                    <label>Name</label>
                    <input type='text'
                           value={name}
                           placeholder={'Enter name'}
                           onChange={(e) => setName(e.target.value)} />
                    {/*<br/>*/}
                    <label>Take Profit</label>
                    <input type='number'
                           value={takeProfit}
                           placeholder={'Enter take profit value'}
                           onChange={(e) => setTakeProfit(e.target.value)} />
                    {/*<br/>*/}
                    <label>Stop Loss</label>
                    <input type='number'
                           value={stopLoss}
                           placeholder={'Enter stop loss value'}
                           onChange={(e) => setStopLoss(e.target.value)} />

                    {errorMessage && <div className={styles.errorMessage}><p>{errorMessage}</p></div>}
                    {/*<div className={styles.actionContainer}>*/}
                    <button onClick={handleSubmit}>Add Product</button>
                    <button className={styles.cancelButton} onClick={cancel}>Cancel</button>
                    {/*</div>*/}
                </div>

                {/*<div className={styles.inputGroup}>*/}
                {/*</div>*/}
            </div>
        </div>
    ) : null;
}

export default AddProductModal;