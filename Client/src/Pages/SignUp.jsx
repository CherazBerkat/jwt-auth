import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { BiHide, BiShow } from "react-icons/bi";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import gmail from "../assets/gmail.svg";
import fb from "../assets/facebook.svg";
import git from "../assets/github.svg";
import insta from "../assets/instagram.svg";
import axios from "axios";
export default function SignUp() {
  useEffect(() => {
    axios
      .get("http://localhost:3000/signUp", { withCredentials: true })
      .then((res) => {
        if (res.data === "Signed Up") {
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [data, setData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [gmailS, setGmailS] = useState(false);
  const [fbS, setFbS] = useState(false);
  const [gitS, setGitS] = useState(false);
  const [instaS, setInstaS] = useState(false);
  const [showPW, setShowPw] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [success, setSuccess] = useState(false);
  const [exist, setExist] = useState(false);
  const [message, setMessage] = useState("");
  const mailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRegx = /^[a-zA-Z]+([a-zA-Z_ ]*[a-zA-Z]+)?$/;
  const navigate = useNavigate();
  const gglSuccess = (res) => {
    axios
      .post("http://localhost:3000/signUp/google", res, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message == "User registered successfully") {
          setSuccess(true);
          localStorage.setItem("userId", res.data.userId);
          navigate("/home");
        } else {
          setExist(true);
          if (res.data) setMessage(res.data);
          else setMessage("internal Server Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const gglError = (err) => {
    console.log(err);
  };

  const gitSignUp = () => {
    window.location.href = "http://localhost:3000/signUp/gitHub";
  };

  const gglSignUp = useGoogleLogin({
    onSuccess: gglSuccess,
    onError: gglError,
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validatePW = () => {
    if (data.password.length < 8) {
      return false;
    } else if (!/[A-Z]/.test(data.password)) {
      return false;
    } else if (!/[a-z]/.test(data.password)) {
      return false;
    } else if (!/[0-9]/.test(data.password)) {
      return false;
    } else if (!/[!@#$%^&*()_+?]/.test(data.password)) {
      return false;
    } else {
      return true;
    }
  };

  const dataVoid = () => {
    if (!data.email && !data.password && !data.username) return true;
    else return false;
  };

  const dataNotFilled = () => {
    !(data.email && data.password && data.username);
  };

  const validation = () => {
    if (dataVoid() || dataNotFilled()) {
      return false;
    } else if (!mailRegx.test(data.email)) {
      return false;
    } else if (!nameRegx.test(data.username)) {
      return false;
    } else if (!validatePW()) {
      return false;
    } else return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmited(true);
    if (validation()) {
      axios
        .post("http://localhost:3000/signUp", data, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.message == "User registered successfully") {
            setSuccess(true);
            localStorage.setItem("userId", res.data.userId);
            navigate("/home");
          } else {
            setExist(true);
            if (res.data) setMessage(res.data);
            else setMessage("internal Server Error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center w-[500px] gap-10 font-sans">
        <h1 className="text-3xl font-bold">Sign Up</h1>

        <form className="flex flex-col w-full gap-2 ">
          <div className="flex flex-col gap-0">
            <input
              type="text"
              placeholder="Username"
              className="p-2 my-2 border-b-2 border-gray-300 outline-none"
              value={data.username}
              onChange={handleChange}
              onFocus={() => {
                setSubmited(false);
                setExist(false);
              }}
              name="username"
            />
            {submited && !data.username && !dataVoid() && (
              <p className="text-red-600">please fill this field</p>
            )}
            {submited && data.username && !nameRegx.test(data.username) && (
              <p className="text-red-600">
                Username can&apos;t contain numbers or special caracters except
                &quot;_&quot; or &quot; &quot;
              </p>
            )}
          </div>
          <div className="flex flex-col gap-0 w-full">
            <div className="relative">
              <MdOutlineMailOutline className=" absolute top-1/2 transform -translate-y-1/2 left-3 text-[#808080] " />
              <input
                type="email"
                placeholder="Email"
                className="p-2 pl-8 my-2 border-b-2 border-gray-300 outline-none w-full"
                value={data.email}
                onChange={handleChange}
                onFocus={() => {
                  setSubmited(false);
                  setExist(false);
                }}
                name="email"
              />
            </div>
            {submited && !data.email && !dataVoid() && (
              <p className="text-red-600">please fill this field</p>
            )}
            {submited && data.email && !mailRegx.test(data.email) && (
              <p className="text-red-600">mail expression not valide</p>
            )}
          </div>
          <div className="flex flex-col w-full gap-0">
            <div className="relative">
              <FiLock className=" absolute top-1/2 transform -translate-y-1/2 left-3  text-[#808080]" />
              <input
                type={showPW ? "text" : "password"}
                placeholder="Password"
                className="p-2 pl-8 w-full my-2 border-b-2 border-gray-300 outline-none"
                value={data.password}
                onChange={handleChange}
                onFocus={() => {
                  setSubmited(false);
                  setExist(false);
                }}
                name="password"
                autoComplete="password"
              />
              {showPW ? (
                <BiShow
                  className=" absolute top-1/2 transform -translate-y-1/2 right-4 text-[#808080] cursor-pointer"
                  onClick={() => setShowPw(false)}
                />
              ) : (
                <BiHide
                  className=" absolute top-1/2 transform -translate-y-1/2 right-4 text-[#808080] cursor-pointer"
                  onClick={() => setShowPw(true)}
                />
              )}
            </div>
            {submited && !data.password && !dataVoid() && (
              <p className="text-red-600">please fill this field</p>
            )}
            {submited && data.password && data.password.length < 8 && (
              <p className="text-red-600">
                password must contain at least 8 caracters
              </p>
            )}
            {submited && data.password && !/[A-Z]/.test(data.password) && (
              <p className="text-red-600">
                password must contain at least one capital letter
              </p>
            )}
            {submited && data.password && !/[a-z]/.test(data.password) && (
              <p className="text-red-600">
                password must contain at least one small letter
              </p>
            )}
            {submited &&
              data.password &&
              !/[!@#$%^&*()_+?]/.test(data.password) && (
                <p className="text-red-600">
                  password must contain at least one special Character
                </p>
              )}
            {submited && data.password && !/[0-9]/.test(data.password) && (
              <p className="text-red-600">
                password must contain at least one number
              </p>
            )}
            {submited && dataVoid() && (
              <p className="text-red-600">please fill all the fields above</p>
            )}
            {submited && validation() && success && (
              <p className="text-green-600">Account created successfully</p>
            )}
            {exist && <p className="text-red-600"> {message} </p>}
          </div>
          <div className="flex flex-col gap-0 ">
            <button
              type="submit"
              className="p-2 my-2 bg-[#28f7b6] font-bold text-lg shadow-md rounded text-white hover:scale-[1.02] hover:duration-300  active:scale-95 active:duration-300"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
            <p className="pl-2 text-[#808080]">
              Have an account?{" "}
              <span
                className="cursor-pointer hover:underline hover:text-blue-700"
                onClick={() => navigate("/logIn")}
              >
                Log In
              </span>
            </p>
          </div>
        </form>
        <div className=" flex flex-col w-full gap-6">
          <div className="flex flex-row items-center w-full justify-center gap-2">
            <hr className=" ml-10 mt-[2px] w-[10%] border-b-1 border-gray-500" />
            <p>Or</p>
            <hr className=" mr-10 w-[10%] mt-[2px] border-b-1 border-gray-500" />
          </div>
          <div className="flex flex-row gap-10 items-center justify-center">
            <div
              onMouseEnter={() => setGmailS(true)}
              onMouseLeave={() => setGmailS(false)}
            >
              {gmailS ? (
                <button onClick={gglSignUp} className="w-[25px] h-[25px]">
                  <img src={gmail} alt="gmail icon" />
                </button>
              ) : (
                <SiGmail size={20} />
              )}
            </div>
            <div
              onMouseEnter={() => setFbS(true)}
              onMouseLeave={() => setFbS(false)}
            >
              {fbS ? <img src={fb} alt="fb icon" /> : <FaFacebook size={20} />}
            </div>
            <div
              onMouseEnter={() => setInstaS(true)}
              onMouseLeave={() => setInstaS(false)}
            >
              {instaS ? (
                <img src={insta} alt="insta icon" />
              ) : (
                <FaInstagram size={20} />
              )}
            </div>
            <div
              onMouseEnter={() => setGitS(true)}
              onMouseLeave={() => setGitS(false)}
            >
              {gitS ? (
                <button className="w-[25px] h-[25px]" onClick={gitSignUp}>
                  <img src={git} alt="git icon" />{" "}
                </button>
              ) : (
                <FaGithub size={20} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
