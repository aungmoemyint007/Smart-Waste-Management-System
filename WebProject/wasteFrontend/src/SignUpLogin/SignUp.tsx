import { useState, ChangeEvent, FormEvent } from "react";
import { Anchor, Button, Checkbox, PasswordInput, rem, TextInput } from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';  // Import react-hot-toast
import axios from 'axios';

// Type definition for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 7){
      toast.error("Password Length must be minimum 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Handle response success
      toast.success("Registration successful! Redirecting to login...");
      navigate("/login");

    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || "Registration failed");
    }
    setLoading(false);
  };

  

  return (
    <div className="w-1/2 px-20 flex flex-col justify-center gap-5">
      <div className="text-2xl font-semibold">Create account</div>
      {error && <div className="text-red-500">{error}</div>}

      <TextInput
        withAsterisk
        label="Full Name"
        placeholder="Your Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextInput
        withAsterisk
        leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
        label="Email"
        placeholder="Your email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <PasswordInput
        withAsterisk
        leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        label="Password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <PasswordInput
        withAsterisk
        leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        label="Confirm Password"
        placeholder="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      {/* <Checkbox
        autoContrast
        classNames={{ input: "checked:bg-green !border-green-500", label: "!text-green-500" }}
        label={
          <>
            I accept{' '}
            <Anchor className="!text-green-500">Terms and conditions</Anchor>
          </>
        }
      /> */}

      <Button
        autoContrast
        variant="filled"
        className="!bg-green-600 !text-mine-shaft-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      <div className="mx-auto">
        Have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
      </div>
    </div>
  );
};

export default SignUp;
