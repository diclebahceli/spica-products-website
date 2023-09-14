"use client"; // This is a client component 👈🏽

import { login } from '@/functions/login';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import Home from './home/page';
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken';

const loginn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const handleLogin = async() => {
    // Handle login logic here (e.g., API request, user authentication)
    console.log('Email:', email);
    console.log('Password:', password);
    // axios
    //   .post('https://master.spicaengine.com/api/fn-execute/logintre', {
    //     password: password,
    //     identifier: email,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //   });
    const response = await login({ data: { identifier: email, password: password } });
    localStorage.setItem('token', response.jwt);
    console.log(response);
    const decodedToken = jwt.decode(response.jwt);
    console.log(decodedToken.attributes.user);
    localStorage.setItem('userId', decodedToken.attributes.user);
    console.log(localStorage.getItem('token'));
    if (response) {
      router.push('/home');
    }
    // console.log(user);
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="button" onClick={handleLogin}>Login</button>
        <Link href="/register" style={{
          color: 'purple',
        }}>New here?</Link>
      </form>
    </div>
  );
}

export default loginn;