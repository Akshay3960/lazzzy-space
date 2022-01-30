import { Fragment } from "react";
import axios from "axios";
import styles from './Navbar.module.css';



const Navbar = (props) => {

    const image = document.getElementById('profile')

    const profile_fetch = async (e) => {
        const BACKEND_URL = process.env.REACT_APP_API_URL;
        try {
            const result = await axios.get(BACKEND_URL + "api/users/61f44ed57b14260d22290851")
            console.log(result.data)
            let profile = new Promise(function (resolve) {
                resolve('http://localhost:5000/' + result.data)
            })
            document.getElementById("pic").src = await profile;
        }
        catch (err) {
            console.log(err)
        }
    }
    profile_fetch()
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
                    <div className={styles['profile']}>
                        <img id="pic"
                            alt="user pic" />
                    </div>
                </div>

            </nav>




        </Fragment>
    )

}

export default Navbar;
