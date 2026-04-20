import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from || "/";
  const isVerificationReturn = new URLSearchParams(location.search).get("verified") === "1";

  useEffect(() => {
    if (authLoading || !user) return;

    if (isVerificationReturn) {
      toast({
        title: "Email verified successfully",
        description: "Your account is now active. You can continue shopping.",
      });
    }

    navigate(from, { replace: true });
  }, [authLoading, from, isVerificationReturn, navigate, toast, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Login failed",
          description: error.message.includes("Email not confirmed")
            ? "Please verify your email from the link we sent, then try again."
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Welcome back!" });
        navigate(from, { replace: true });
      }
    } else {
      if (!fullName.trim()) {
        toast({ title: "Please enter your full name", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <h1 className="section-heading mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-center font-body text-muted-foreground mb-8">
              {isLogin ? "Sign in to your account" : "Join Tiara Collections"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-foreground mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-foreground mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-foreground mb-1 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-shop w-full text-center disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center font-body text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
