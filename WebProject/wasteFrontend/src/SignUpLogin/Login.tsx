import { useState, ChangeEvent, FormEvent, useEffect } from "react"; // Add useEffect
import { Button, PasswordInput, rem, TextInput } from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setUser } from "@/Slices/UserSlice";
import { setJwt } from "@/Slices/JwtSlice";
import { loginUser } from "@/Services/UserService";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      toast.error("Please fill in both fields!");
      return;
    }

    const data = { email, password };

    setLoading(true);
    loginUser(data).then((res) => {
      toast.success("Login successful");
      dispatch(setUser(res.user));
      dispatch(setJwt(res.token));
      setTimeout(
        () => {
          setLoading(false);
          navigate("/");
        },
        3000
      )
    }).catch((error:any) => {
      setLoading(false);
      setError(error.message);
    });
  };

  
  return (
    <div className="w-1/2 px-20 flex flex-col justify-center gap-5">
      <div className="text-2xl font-semibold">Log in to Your Account</div>
      {error && <div className="text-red-500">{error}</div>}

      <TextInput
        withAsterisk
        leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
        label="Email"
        placeholder="Your email"
        name="email"
        value={email}
        onChange={handleChange}
      />

      <PasswordInput
        withAsterisk
        leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        label="Password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={handleChange}
      />

      <Button
        autoContrast
        variant="filled"
        className="!bg-green-600 !text-mine-shaft-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <div className="mx-auto">
        Don't have an account? <Link to="/signup" className="text-green-400 hover:underline">SignUp</Link>
      </div>
    </div>
  );
};

export default Login;