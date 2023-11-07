import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Resizable.css';

const Resizable = ({ leftChild, rightChild }) => {
    const containerRef = useRef(null);
    const [leftShown, setLeftShown] = useState(true);
    const [rightShown, setRightShown] = useState(true);

    const toggleLeftVisible = () => {
        setLeftShown(!leftShown);
        if (leftShown) {
            document.querySelector(".resizable-right-child").style.flexBasis = '100%';
            document.querySelector(".resizable-left-child").style.flexBasis = '0%';
            document.querySelector(".resizer").style.flexBasis = '0%';
        } else {
            //left show
            document.querySelector(".resizable-right-child").style.flexBasis = '49.5%';
            document.querySelector(".resizable-left-child").style.flexBasis = '50%';
            document.querySelector(".resizer").style.flexBasis = '0.5%';
        }
    };

    const toggleRightVisible = () => {
        setRightShown(!rightShown);
        if (rightShown) {
            document.querySelector(".resizable-left-child").style.flexBasis = '100%';
            document.querySelector(".resizable-right-child").style.flexBasis = '0%';
            document.querySelector(".resizer").style.flexBasis = '0%';
        } else {
            document.querySelector(".resizable-right-child").style.flexBasis = '49.5%';
            document.querySelector(".resizable-left-child").style.flexBasis = '50%';
            document.querySelector(".resizer").style.flexBasis = '0.5%';
        }
    };
    const handleMouseDown = (e) => {
        e.preventDefault();

        // Add the overlay to block interactions with the right child.
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.left = '0';
        overlay.style.zIndex = '10'; // This should be higher than the z-index of elements in TVChartContainer
        document.querySelector('.resizable-right-child').appendChild(overlay);


        const initialX = e.clientX;
        const initialWidth = containerRef.current.clientWidth;
        const leftChildInitialWidth = document.querySelector(".resizable-left-child").offsetWidth;

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - initialX;
            const newLeftChildWidth = ((leftChildInitialWidth + deltaX) / initialWidth) * 100;
            const newRightChildWidth = 100 - newLeftChildWidth;

            document.querySelector(".resizable-left-child").style.flexBasis = `${newLeftChildWidth}%`;
            document.querySelector(".resizable-right-child").style.flexBasis = `${newRightChildWidth}%`;
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            overlay.remove();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    return (
        <div className="wrapper-container">
            {
                rightShown && (
                    <div className="toggle-button left-toggle" onClick={toggleLeftVisible}>
                        <FontAwesomeIcon icon={leftShown ? faAngleLeft : faAngleRight} />
                    </div>
                )
            }

            <div className="resizable-container" ref={containerRef}>
                <div className="resizable-left-child">
                    {leftChild}
                </div>
                <div className="resizer" onMouseDown={handleMouseDown}></div>
                <div className="resizable-right-child">
                    {rightChild}
                </div>
            </div>
            {
                leftShown && (
                    <div className="toggle-button right-toggle" onClick={toggleRightVisible}>
                        <FontAwesomeIcon icon={rightShown ? faAngleRight : faAngleLeft} />
                    </div>
                )
            }

        </div>

    );
};

export default Resizable;