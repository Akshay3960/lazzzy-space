import { Fragment } from "react";

import styles from './Navbar.module.css';

const Navbar = (props) => {

    return (
        <Fragment>
            <nav className=" flex px-8 bg-indigo-500 justify-between h-14 drop-shadow-xl">
                <div className="flex items-center space-x-3">
                <img
                className="h-8 w-8"
                src="https://www.logo.wine/a/logo/Trello/Trello-White-Dark-Background-Logo.wine.svg"
                alt="trello"
                />   
                </div>

                <div className="flex items-center space-x-3">
                    <div className = {styles['profile']}>
                        
                    </div>
                </div>

            </nav>




        </Fragment>
    )

}

export default Navbar;