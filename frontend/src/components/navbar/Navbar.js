import { Fragment } from "react";


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
                <button onClick={props.onLogin} className="border border-lime-400 shadow-2xl hover:border-slate-400 shadow-blue-500/50 
                hover:shadow-indigo-500/40 rounded-full p-3 bg-green-400
                text-sm text-black">Login</button>
                <button onClick={props.onRegister} className=" border border-lime-400 hover:border-slate-400 shadow-2xl shadow-blue-500/50 
                hover:shadow-indigo-500/40 rounded-full p-3 bg-green-400
                text-sm text-black">Register</button>
                </div>

            </nav>




        </Fragment>
    )

}

export default Navbar;