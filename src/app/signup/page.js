'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Award, Tag, Truck, Phone, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1 = Register Form, 2 = OTP Form
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: Register API Call
  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    if (formData.password.length < 8) {
      return alert("Password must be at least 8 characters long.");
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Registration successful, move to OTP step
        setUserId(result.data.userId);
        alert(result.data.message || "OTP sent successfully!");
        setStep(2);
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP API Call
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP.");

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          otp: otp,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save Token and Redirect
        localStorage.setItem('token', result.data.token);
        
        // Optional: Save user info if needed
        localStorage.setItem('user', JSON.stringify(result.data.user));

        alert("Account verified successfully!");
        router.push('/'); // Redirect to Home or Dashboard
      } else {
        alert(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Something went wrong. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-white">
      
      {/* ========================================== */}
      {/* LEFT SIDE: BRANDING & PERKS                */}
      {/* ========================================== */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex flex-col text-white p-8 md:p-12 lg:p-20 overflow-hidden bg-black">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/singup.png" // Apni image ka actual path yahan daalein
            alt="Viazo Sneaker"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Dark Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
            {step === 1 ? "CREATE YOUR \n VIAZO ACCOUNT" : "VERIFY YOUR \n ACCOUNT"}
          </h1>
          <div className="w-12 h-1 bg-white mb-6"></div>
          <p className="text-sm md:text-base text-gray-200 mb-12 font-medium">
            {step === 1 
              ? "Join the Viazo movement and enjoy exclusive drops, offers and much more."
              : "We have sent a One-Time Password to your email address."}
          </p>

          {/* Perks List (Only show on Step 1) */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
                  <Award size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 tracking-wide">Exclusive Access</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Be the first to know about<br />new drops and collections.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
                  <Tag size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 tracking-wide">Special Offers</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Get access to members-only<br />deals and discounts.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
                  <Truck size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 tracking-wide">Faster Experience</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Save your details and enjoy<br />a faster checkout.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: REGISTRATION / OTP FORM        */}
      {/* ========================================== */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24 relative">
        
        {/* Top Right "Login" Link (Desktop) */}
        {step === 1 && (
          <div className="hidden md:flex justify-end w-full absolute top-8 right-12 text-sm">
            <span className="text-gray-500 mr-2">Already have an account?</span>
            <Link href="/login" className="font-bold text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition-colors">
              Login
            </Link>
          </div>
        )}

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
            {step === 1 ? "REGISTER" : "VERIFY OTP"}
          </h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">
            {step === 1 
              ? "Create your account and start your journey with Viazo." 
              : `Please enter the OTP sent to ${formData.email}`}
          </p>

          {/* --- STEP 1: REGISTRATION FORM --- */}
          {step === 1 && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name" 
                    className="w-full border border-gray-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number Input (NEW) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number" 
                    className="w-full border border-gray-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address" 
                    className="w-full border border-gray-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Password</label>
                <div className="relative mb-1">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password" 
                    className="w-full border border-gray-300 py-3 pl-12 pr-12 text-sm outline-none focus:border-black transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">Password must be at least 8 characters long</p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password" 
                    className="w-full border border-gray-300 py-3 pl-12 pr-12 text-sm outline-none focus:border-black transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center mt-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600 select-none">
                  <input type="checkbox" required className="w-4 h-4 accent-black border-gray-300 rounded-sm cursor-pointer" />
                  <span>
                    I agree to the <Link href="/terms" className="font-bold text-black border-b border-black">Terms of Service</Link> and <Link href="/privacy" className="font-bold text-black border-b border-black">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors active:scale-[0.99] disabled:bg-gray-600"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}

          {/* --- STEP 2: OTP VERIFICATION FORM --- */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Enter OTP</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="123456" 
                    maxLength={6}
                    className="w-full border border-gray-300 py-3 px-4 text-center text-xl tracking-[0.5em] font-bold outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors active:scale-[0.99] disabled:bg-gray-600"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? "VERIFYING..." : "VERIFY OTP"}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs text-gray-500 hover:text-black font-semibold mt-2 underline"
              >
                Go back to registration
              </button>
            </form>
          )}

          {/* Divider & Social Logins (Only show on Step 1) */}
          {step === 1 && (
            <>
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full border border-gray-200 py-3 text-xs font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button className="w-full border border-gray-200 py-3 text-xs font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
                  Continue with Facebook
                </button>
                <button className="w-full border border-gray-200 py-3 text-xs font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M17.05 16.57c-.85 1.25-1.74 2.5-3.09 2.53-1.32.03-1.75-.78-3.26-.78-1.54 0-2.02.75-3.26.81-1.32.06-2.33-1.35-3.18-2.6-1.74-2.52-3.08-7.14-1.3-10.23.88-1.53 2.45-2.5 4.15-2.53 1.29-.03 2.5.87 3.29.87.78 0 2.22-1.08 3.77-1.05 1.55.03 2.97.72 3.84 1.89-3.21 1.95-2.67 6.69.57 7.95-.75 1.83-1.68 3.54-2.93 5.16zM15.1 4.65c.69-.84 1.14-2.01 1.02-3.15-1.05.03-2.31.69-3.03 1.53-.63.75-1.17 1.95-1.02 3.09 1.14.09 2.34-.63 3.03-1.47z"/></svg>
                  Continue with Apple
                </button>
              </div>

              {/* Mobile "Login" Link */}
              <div className="md:hidden mt-8 text-sm text-center">
                <span className="text-gray-500 mr-2">Already have an account?</span>
                <Link href="/login" className="font-bold text-black border-b border-black">
                  Login
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}