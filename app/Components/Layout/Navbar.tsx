"use client";
import type { Metadata } from "next";
import Image from "next/image";
import "../../globals.scss";
import { AuthHandler, useAuth } from "../AuthHandler";
import AuthButton from "./loginbutton";



const Navbar = () => {

  return (<nav>
    <div className="nav-left">
    <Image onClick={() => window.location.href = '/'} src="/urbanp2.jpeg" alt="Logo" width={100} height={100} />
    <h1 onClick={() => window.location.href = '/'}>Urban P2: The Archives</h1>
    </div>
    <div className="nav-right">
      <a href="/">Home</a>
      <a href="/projects">Projects</a>
      <a href="/about">About</a>
      
      <AuthButton />
    </div>
  </nav>)

}

export default Navbar;