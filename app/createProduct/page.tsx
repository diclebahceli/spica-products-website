"use client";
import * as Bucket from "@spica-devkit/bucket";
import React, { useState } from "react";
import * as Identity from "@spica-devkit/identity";
import { useRouter } from "next/navigation";

const createProductPage = () => {    
    const router = useRouter();

    const [productName, setProductName] = useState("");
    const value = localStorage.getItem('token');
    let ident: any;
    if(value!=null){
        Identity.initialize({ identity: value , publicUrl: "https://master.spicaengine.com/api"});
        }
    console.log(ident);
    console.log(value)
    const handleAddProduct = () => {
        
        Bucket.initialize({apikey: "2s36n19lmg8mjwp", publicUrl: "https://master.spicaengine.com/api"});
        let document = {
            
                name: productName,
                owner: localStorage.getItem('userId'),
           
            
        }
        Bucket.data.insert("6501692b6095ae002d109f51",document);
        router.push("/home");
    }

    return (
        <div>
            <h2>Create Product Page</h2>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" placeholder="Enter your name" 
                    onChange={(e) => setProductName(e.target.value)}/>
                </div>
                
                <button type="button" onClick={handleAddProduct}>Create Product</button>
            </form>
        </div>
    );
}

export default createProductPage;