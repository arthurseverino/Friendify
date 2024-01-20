
import {Link} from "react-router-dom";
import { useState } from "react";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const { name, email, password } = form;
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post("/auth/signup", form);
        console.log(res.data);
        setForm({ name: "", email: "", password: "" });
        setError("");
        } catch (err) {
        setError(err.response.data.error);
        setForm({ ...form, password: "" });
        }
    };
    
    return (
        <div className="signup">
        <div className="signup__wrapper">
            <div className="signup__left">
            <h3 className="signup__logo">Lamasocial</h3>
            <span className="signup__desc">
                Connect with friends and the world around you on Lamasocial.
            </span>
            </div>
            <div className="signup__right">
            <form onSubmit={handleSubmit} className="signup__box">
                <input
                type="text"
                placeholder="Username"
                className="signup__input"
                name="name"
                value={name}
                onChange={handleChange}
                />
                <input
                type="email"
                placeholder="Email"
                className="signup__input"
                name="email"
                value={email}
                onChange={handleChange}
                />
                <input
                type="password"
                placeholder="Password"
                className="signup__input"
                name="password"
                value={password}
                onChange={handleChange}
                />
                <button className="signup__button">Sign Up</button>
                <span className="signup__error">{error}</span>
                <Link to="/login" className="signup__loginLink">
                Already have an account?
                </Link>
            </form>
            </div>
        </div>
        </div>
    );
};

export default Signup;