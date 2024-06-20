import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  console.log("formData",formData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("error",error);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full'>
        <div className='text-center mb-8'>
          <Link to='/' className='font-bold text-4xl dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Aman's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5 dark:text-gray-300'>
            This is a demo project. You can sign in with your email and password or with Google.
          </p>
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label className='dark:text-gray-300' value='Your email' />
            <TextInput
              type='email'
              placeholder='name@company.com'
              id='email'
              onChange={handleChange}
              className='dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
          <div>
            <Label className='dark:text-gray-300' value='Your password' />
            <TextInput
              type='password'
              placeholder='Password'
              id='password'
              onChange={handleChange}
              className='dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
          <Button
            gradientDuoTone='purpleToPink'
            type='submit'
            disabled={loading}
            className='mt-4'
          >
            {loading ? (
              <>
                <Spinner size='sm' />
                <span className='pl-3'>Loading...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <OAuth />
        </form>
        <div className='flex gap-2 text-sm mt-5 dark:text-gray-300 justify-center'>
          <span>Don't have an account?</span>
          <Link to='/sign-up' className='text-blue-500'>
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SignIn;
