import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

// Lazy load components for better initial load performance
const Home = lazy(() => import("@/components/home"));
const Login = lazy(() => import("@/components/Login"));
const Register = lazy(() => import("@/components/Register"));
const About = lazy(() => import("@/components/About"));
const Profile = lazy(() => import("@/components/Profile"));
const Onboarding = lazy(() => import("@/components/Onboarding"));

// Minimal loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
        <Toaster />
        <Analytics />
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;