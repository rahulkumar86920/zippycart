import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto p-4 text-center flex flex-col  gap-2 lg:flex-row lg:justify-between">
        <p> © All Right Reserved 2025</p>
        <div className="flex items-center gap-4 justify-center text-2xl ">
          <a href="">
            <FaLinkedin className="hover:bg-yellow-600 hover:duration-500 hover:rounded-full" />
          </a>
          <a href="">
            <FaInstagramSquare className="hover:bg-yellow-600 hover:duration-500 hover:rounded-full" />
          </a>
          <a href="">
            <FaFacebook className="hover:bg-yellow-600 hover:duration-500 hover:rounded-full" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
