import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';

const Login = () => {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                const response = await axios.post('/login', JSON.stringify({user, pwd}),
            {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            });
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({user, pwd, roles, accessToken});
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Server is offline');
            } else if (err?.response?.status === 401) {
                setErrMsg('Invalid username or password');
            } else if (err?.response?.status === 403) {
                setErrMsg('Forbidden');
            } else if (err?.response.status === 400) {
                setErrMsg('Bad request, missing username or password');
            } else {
                console.error(err);
                setErrMsg('An error occurred');
            }
            errorRef.current.focus();
        }
    }

    return (
        <>
            {success ?(
                <section>
                    <h1>You are logged in </h1>
                    <br/>
                    <p>
                        <a href='#'>Go to Home</a>
                    </p>
                </section>
            ) : (
        <div>
            <h1>Login</h1>
            <p ref={errorRef} className={errMsg? "errmsg" :
                "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" 
                id="username" 
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                />
                <label htmlFor="password">Password:</label>
                <input type="password" 
                id="password" 
                autoComplete='off'
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                />
                <button type="submit">Sign in</button>
            </form>
            <p>
                Need an account? <br/>
                <span className="offscreen">Register for an account</span>
                <a href="#">Register</a>
            </p>
        </div>
            )}
        </>
    );
    
}

export default Login;