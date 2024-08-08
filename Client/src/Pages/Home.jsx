import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    axios
      .get("http://localhost:3000/home", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "No token, authorization denied") {
          window.location.href = "/";
        } else if (res.data.message === "Token is not valid") {
          return <h1 className="font-bold text-3xl">Access Denied </h1>;
        }
      });
  }, []);
  const LogOut = () => {
    localStorage.removeItem("userId");
    axios
      .get("http://localhost:3000/logOut", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
      });
    window.location.href = "/LogIn";
  };
  return (
    <div className="flex flex-col justify-center items-center mt-36">
      <h1>Home</h1>
      <button
        className="p-2 my-2 bg-[#28f7b6] font-bold text-lg shadow-md rounded text-white hover:scale-[1.02] hover:duration-300  active:scale-95 active:duration-300"
        onClick={LogOut}
      >
        Log Out
      </button>
    </div>
  );
}
