import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {NativeSignIn, signInWithGooglePopup, auth} from "../firebase/firebase";
import FormInput from "./FormInput";
import Button from "./Button";
import "../styles/Signin.scss";

const defaultFormFields = {
    email: "",
    password: "",
};

const Signin = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {email, password} = formFields;
    const history = useNavigate();

    const SignInWithGoogle = async () => {
        await signInWithGooglePopup();
        const user = auth.currentUser;

        const url = `http://localhost:4000/users/profile`;
        const {data} = await axios.post(url, {data: user.email});

        if (data === null) {
            let dataBody = {email: user.email, flag: "G"};
            axios
                .post("http://localhost:4000/users/signup", {
                    data: dataBody,
                })
                .then(function (response) {
                    console.log(response.data);
                    history("/", {replace: true});
                });
        } else {
            history("/", {replace: true});
        }
    };

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormFields({...formFields, [name]: value});
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        try {
            await NativeSignIn(email, password);
            resetFormFields();
        } catch (error) {
            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                alert("Invalid email or password");
            }
            console.log("Error signing in", error);
        }
    };

    return (
        <div className='sign-up-container'>
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleOnSubmit}>
                <FormInput
                    label='Email'
                    type='email'
                    required
                    onChange={handleChange}
                    value={email}
                    name='email'
                />
                <FormInput
                    label='Password'
                    type='password'
                    required
                    onChange={handleChange}
                    value={password}
                    name='password'
                />
                <div className='buttons-container'>
                    <Button type='submit'>Sign In</Button>
                    <Button
                        type='button'
                        buttonType='google'
                        onClick={SignInWithGoogle}
                    >
                        Google sign in
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Signin;
