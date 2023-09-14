"use client"; // This is a client component 👈🏽

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/functions/register';
import router from 'next/router';


const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const handleRegister = async() => {
    console.log('Name:');
    // Handle registration logic here (e.g., API request, user creation)
    console.log(email);
    // await fetch('/api/fn-execute/registerr', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       'password': password,
    //       'name': name,
    //       'email': {email},
    //     }),
    //     headers: {
    //       'Content-type': 'application/json; charset=UTF-8',
    //     },
    //   })
    //      .then((response) => response.json())
    //      .then((data) => {
    //         console.log(data);
    //         // Handle data
    //      })
    //      .catch((err) => {
    //         console.log(err.message);
    //      });
    // axios
    //   .post('/api/fn-execute/registerr', {
    //     password: password,
    //     name: name,
    //     email: email,
    //   })
    //   .then((response) => {
    //     setPost(response.data);
    //   });
    const value = await register({data: {password:password, name: name,identifier: email}});
    if(value){
      router.push('/');
    }
  };
  
  return (
    <div>
      <h2>Register Page</h2>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
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
        <button type="button" onClick={handleRegister}>Register</button>
        <Link href="/" style={{
          color: 'purple',
        }}>Already have an acococo?</Link>       
         </form>
    </div>
  );
}

export default Register;