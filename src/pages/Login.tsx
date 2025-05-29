// SignIn.tsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const { user, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect to /login after successful sign-in
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div>
      <button onClick={signInWithProvider}>Sign in</button>
    </div>
  );
};

export default SignIn;
