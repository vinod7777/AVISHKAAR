import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Droplets } from "lucide-react";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };
  return (<div className="min-h-screen bg-background">
    <SEO
      title="Login - Avishkaar Portal"
      description="Login to your Avishkaar Season 4 participant portal to access project submissions, hackathon guidelines, and team details."
      canonicalPath="/login"
    />
    <Navbar />
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="bg-card border border-primary/20 rounded-2xl p-8 shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient-water">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <Button type="submit" className="w-full" variant="water">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>);
};
export default LoginPage;
