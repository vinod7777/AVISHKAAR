import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone, Droplets } from "lucide-react";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", formData);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (<div className="min-h-screen bg-background">
    <SEO
      title="Register - Join Avishkaar Season 4"
      description="Register your team for Avishkaar Season 4. Free registration for national hackathon by AITAM with ₹1,00,000+ prize pool."
      canonicalPath="/register"
    />
    <Navbar />
    <div className="pt-20 min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="bg-card border border-primary/20 rounded-2xl p-8 shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient-water">Join AVISHKAAR</h1>
            <p className="text-muted-foreground mt-2">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="name" name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="pl-10 bg-muted border-primary/20 focus:border-primary" />
              </div>
            </div>

            <Button type="submit" className="w-full" variant="water">
              Register
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>);
};
export default RegisterPage;
