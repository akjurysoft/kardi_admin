"use client";
import axios from "../../../axios";
import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useSnackbar } from "../SnackbarProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post("/api/login-admin", {
        email: email,
        password: password,
      });
      console.log(response.data);
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        localStorage.setItem("onlineKingToken", response.data.token);
        router.push("/");
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-wrapper-left">
          <h1>OnlineKing</h1>
        </div>
        <div className="auth-wrapper-right">
          <div className="auth-wrapper-form">
            <div className="auth-header">
              <div className="mb-5">
                <h2 className="text-[28px] font-[800]">
                  Login <span className="text-[14px]">(Admin)</span>
                </h2>
                <span className="text-[14px] font-[400] text-slate-400">
                  Welcome back!
                </span>
              </div>

              <div className="flex flex-col space-y-2 mb-5">
                <label className="text-[#334257] capitalize text-[0.875rem]">
                  Your Email
                </label>
                <input
                  className="border border-slate-300 p-2 rounded-[5px] h-[40px] bg-[#e8f0fe] text-black outline-none focus-none"
                  name="email"
                  type="email"
                  placeholder="email@address.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[#334257] capitalize text-[0.875rem]">
                  Password
                </label>
                <div className="flex items-center border border-slate-300 p-2 rounded-[5px] h-[40px] bg-[#e8f0fe]">
                  <input
                    className="text-black w-full bg-[#e8f0fe] outline-none focus-none"
                    name="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FaRegEyeSlash className="cursor-pointer text-slate-400 text-[14px]" />
                </div>
              </div>

              <button
                className="bg-[#ebc25b] p-2 rounded-[5px] text-black text-[14px] font-bold w-full mt-5 hover:bg-[#ebc25b]/70"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
