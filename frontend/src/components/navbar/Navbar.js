import { Fragment } from "react";


const Navbar = (props) => {

    return (
        <Fragment>
            <nav className=" flex px-8 bg-purple-800 justify-between h-12">
                <div className="flex items-center space-x-3">
                <img
                className="h-8 w-8"
                src="https://www.logo.wine/a/logo/Trello/Trello-White-Dark-Background-Logo.wine.svg"
                alt="trello"
                />   
                </div>

                <div className="flex items-center space-x-3">
                <button onClick={props.onLogin} className="border border-green-500 shadow hover:shadow-xl rounded p-2 
                text-sm text-green-500">Login</button>
                <button onClick={props.onRegister} className="border border-green-500 shadow hover:shadow-xl rounded p-2 text-sm text-green-500">Register</button>
                </div>

            </nav>




        </Fragment>
    )

}

export default Navbar;