"use client";
import { handleUserGatewayCall } from "@/ctaApiLogics/userGateway";
import React, { useRef, useState } from "react";
import ResponseAnimation from "./components/ResponseAnimation";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import { AxiosError } from "axios";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import handleError from "@/utils/handleError";
import ToastNotification from "@/components/global_compns/ToastNotification";

interface Res {
  success: boolean,
  message: string
}

const Authenticate = () => {
  const apiRes = useRef<any | null>(null);

  const [otpRequested, setOtpRequested] = useState<boolean>(false);
  const [otpVerified, setOtpVerfied] = useState<boolean | null>(null);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  // Add Later
  const [showPass, setShowPass] = useState<boolean>(false);

  const [emailInUse, setEmailInUse] = useState<boolean | null>(false);
  const [invalidCreds, setInvalidCreds] = useState<boolean>(false)
  const [authSuccess, setAuthSuccess] = useState<boolean | null>(null);
  const [afterAuthMsg, setAfterAuthMsg] = useState<string | null>(null);

  const { showToastMsg } = useToastMsgContext();

  // Handling the main form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //Call Backend API
    try {
      const response = await handleUserGatewayCall(e, email, setEmail, isUser);
      apiRes.current = response.data;
    } catch (error) {
      // Exception for this page because of high dependency on error statements.
      apiRes.current = error;
      showToastMsg({ text: handleError(error, "axios") as string, type: "error" });
    }

    const res = apiRes.current;
    const err = (res as any as AxiosError)?.response?.data as Res;

    //If everything went all right then
    if (res?.success) {
      // Login Case Special isUser + otpVerified.
      if (isUser && res.message == "OTP Verfied Successfully.") {
        setAuthSuccess(true);
        setAfterAuthMsg(res.message);
      }
      //Rest of the success cases
      switch (res.message) {
        case "OTP sent successfully.":
          setOtpRequested(true);
          break;
        case "OTP Verified Successfully.":
          setOtpVerfied(true);
          setOtpRequested(false);
          break;
        default:
          setAuthSuccess(true);
          setAfterAuthMsg(res.message);
          break;
      }
    }

    // If any error occured
    else if (err?.success == false) {
      showToastMsg({ text: err.message || "Something Went Wrong !", type: 'error' })
      switch (err.message) {
        case "Cannot send OTP try again later!":
          // Considering it as a traffic/system failure and revoke/delay authentication
          setAuthSuccess(false);
          setAfterAuthMsg(err.message);
          break;
        case "Invalid OTP!":
          setOtpVerfied(false);
          break;
        case "User already exists!":
          setEmailInUse(true);
          break;
        case "User doesn't exist!":
          setEmailInUse(false);
          break;
        case "Invalid Credentials!":
          setInvalidCreds(true)
          break;
        default:
          break;
      }
    }
  };


  return (
    <>
      <ToastNotification />
      <div className="h-screen w-full pt-20">
        <center className="mb-10">
          <h1 className="text-6xl text-texts-primary font-bold">
            {isUser ? "WELCOME BACK TO" : "JOIN"}
            <span className="text-buttons">&nbsp; WORKHIVE</span>
          </h1>
        </center>
        {authSuccess !== null ? (
          <ResponseAnimation
            authSuccess={authSuccess}
            afterAuthMsg={afterAuthMsg}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-2 z-50 w-1/2 m-auto bg-ui-secondary/70 p-8 rounded-4xl border border-ui-tertiary/10"
          >
            {otpRequested ? (
              <>
                <h1 className="text-2xl font-semibold text-texts-primary">
                  Enter Otp
                </h1>
                <p className="text-sm text-texts-secondary">
                  Sent to your email address
                </p>
                <input
                  type="number"
                  name="otp"
                  className="form-ip text-center w-10/12"
                  placeholder="_ _ _ _ _ _"
                  required
                />
                {otpVerified == false && <p className="text-red-400 text-xs">Invalid OTP !</p>}
              </>
            ) : isUser ? (
              <SignInForm emailInUse={emailInUse} invalidCreds={invalidCreds} />
              // Render SIGNUP form if not user
            ) : otpVerified == true ? (
              <SignUpForm email={email} />
              // Firstly otp verification for mail if new user.
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-texts-primary">SignUp</h1>
                <span className="w-10/12">
                  <p className={`${emailInUse == true ? "text-red-400" : ""} text-sm`}>
                    {emailInUse == true ? "Email already in use!" : "Enter your email"}
                  </p>
                  <input
                    type="email"
                    name="email"
                    className="form-ip w-full"
                    placeholder="youremail@example.com"
                    required
                  />
                </span>
              </>
            )}
            <br />
            {/* Switch between signup and signin if otp still not requested */}
            {
              !otpRequested &&
              <p className="text-texts-secondary text-sm">
                {isUser ? "New to Workhive ? " : "Already a Workhive user ? "}
                <span
                  className="text-buttons hover:text-buttons/40 ease-in-out duration-200 cursor-pointer"
                  onClick={() => {
                    setIsUser(!isUser);
                    setEmailInUse(null);
                    setInvalidCreds(false)
                  }}
                >
                  {isUser ? "SignUp" : "SignIn"}
                </span>
              </p>
            }
            <input
              type="submit"
              value={otpRequested ? "Continue" : isUser ? "SignIn" : "SignUp"}
              className="w-1/3 py-3 rounded-2xl bg-buttons text-ui-main font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-300 mt-2"
            />
          </form>
        )}
      </div>
    </>
  );
};

export default Authenticate;