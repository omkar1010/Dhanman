import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import logo from "../Logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const dispatches = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  // useEffect(() => {
  //   // if (user || isSuccess) {
  //   //     navigate("/dashboard");
  //   // }
  //   if(isSuccess) {
  //     if(user.role == "admin"){
  //       navigate("/dashboard");
  //     } else if (user.role == "dispatch"){
  //       navigate("/dispatch");
  //     }  else if (user.role == "melting"){
  //       navigate("/production");
  //     }
  //   }
  //   dispatches(reset());
  // }, [user, isSuccess,dispatches, navigate]);

  // navigate to user as per role and give access permission to role

  useEffect(() => {
    if (isSuccess) {
      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "dispatch") {
        navigate("/dispatch");
      } else if (user.role === "melting") {
        navigate("/production");
      } else if (user.role === "quality") {
        navigate("/rejection1");
      } else if (user.role === "fettling") {
        navigate("/rejection2");
      }
      dispatches(reset());
    }
  }, [isSuccess, user, dispatches, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatches(LoginUser({ email, password }));
  };

  return (
    <>
      <section
        className="hero is-fullheight is-fullwidth"
        style={{
          backgroundColor: "#E9FCF7",
        }}
      >
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-4">
                <form className="box" onSubmit={Auth}>
                  {isError && <p className="has-text-centered">{message}</p>}
                  <img
                    src={logo}
                    alt=""
                    style={{
                      marginBottom: "20px",
                    }}
                  />
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div
                    className="field"
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        type="password"
                        className="input"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPass(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <button
                      type="submit"
                      className="button is-success is-fullwidth"
                    >
                      {isLoading ? "Loading..." : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
