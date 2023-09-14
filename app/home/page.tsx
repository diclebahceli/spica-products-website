"use client"; // This is a client component 👈🏽

import { UsersProducts, initialize, products, usersproducts } from '@/bucket/bucket';
import React, { useEffect, useState } from 'react';
import * as Bucket from "@spica-devkit/bucket";
import * as Identity from "@spica-devkit/identity";
import router from 'next/router';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [allProducts, setAllProducts] = useState<UsersProducts[]>([]);
  Bucket.initialize({apikey: "2s36n19lmg8mjwp", publicUrl: "https://master.spicaengine.com/api"})
  console.log("AAAAAAAAAA");
  let tokenPayload: any;
  const router = useRouter();

  useEffect(() => {
    // Call showProducts when the component mounts
    showProducts();
  }, []);

  const showProducts = async() => {
    const value = localStorage.getItem('token');
    
    console.log(value);
    if(value!=null){
      tokenPayload = await Identity.verifyToken(value, "https://master.spicaengine.com/api");
      console.log(tokenPayload);
      console.log(value);
      try {
        Identity.initialize({ identity: value , publicUrl: "https://master.spicaengine.com/api"});
        console.log("Identity initialized");
      } catch (error) {
        console.error("Error initializing Identity:", error);
      }

    }
    const allProducts: UsersProducts[] = await usersproducts.getAll();
  // Filter products to include only those owned by the current user
  console.log(allProducts);
  console.log(tokenPayload)

  console.log(tokenPayload.attributes.user)

  const currentUserProducts = allProducts.filter(
    (usersproducts) => usersproducts.owner === tokenPayload.attributes.user  
    
  );

  if(currentUserProducts.length === 0) {
    return;}

  setAllProducts(currentUserProducts);

  };

  const handleProduct = () => {
    router.push("/createProduct");
  }

  const handleLogOut = () => {
    router.push("/");
  }

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>
        This is the home page of your React app with Next.js. You can add your
        content, features, and functionality here.
      </p>
      <h3>All Products</h3>
      <ul>
        {allProducts.map((product) => (
          <li key={product.name}>{product.name}</li>
        ))}
      </ul>
          <button onClick={handleProduct}>Create Product</button>
          <button onClick={handleLogOut}>Log out</button>
    </div>
  );
}

export default Home;