'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Award, ShieldCheck, PackageOpen, Truck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Form and UI States
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState(''); // Changed from email to identifier
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Form Submission
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');
    setIsLoading(true);

    try {
      // Integrated your exact cURL request here
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6InN1cGVyX2FkbWluIiwiZXhwIjoxNzgwMjIzMDI1fQ.XMSzOp3oLfYkzU_OpyUBI69q44Ah6YsIelORyJHcWOI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: identifier, 
          password: password 
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 1. Save token to localStorage
        localStorage.setItem('token', result.data.token);
        
        // 2. Redirect to home page
        router.push('/');
      } else {
        // Handle failed login
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please check your server and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-white">
      
      {/* ========================================== */}
      {/* LEFT SIDE: BRANDING & IMAGE                */}
      {/* ========================================== */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex flex-col justify-between text-white p-8 md:p-12 overflow-hidden bg-black">
        
        <div className="absolute inset-0 z-0">
          <Image
            src="/login.png" 
            alt="Sneaker on stairs"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        </div>

        <div className="relative z-10 mt-10 md:mt-20">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-none mb-4">
            Welcome <br /> Back
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-sm font-medium">
            Login to your account and step into premium comfort.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/20 mt-12 md:mt-0">
          <div className="flex flex-col items-center text-center">
            <Award className="mb-3" size={28} strokeWidth={1.5} />
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">Premium Quality</h4>
            <p className="text-[10px] text-gray-400">Carefully crafted<br/>for you</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="mb-3" size={28} strokeWidth={1.5} />
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">Secure Shopping</h4>
            <p className="text-[10px] text-gray-400">100% secure<br/>payments</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <PackageOpen className="mb-3" size={28} strokeWidth={1.5} />
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">Easy Returns</h4>
            <p className="text-[10px] text-gray-400">Hassle free<br/>returns</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck className="mb-3" size={28} strokeWidth={1.5} />
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">Fast Delivery</h4>
            <p className="text-[10px] text-gray-400">Quick delivery<br/>at your door</p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: LOGIN FORM                     */}
      {/* ========================================== */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24">
        
        <div className="hidden md:flex justify-end w-full absolute top-8 right-12 text-sm">
          <span className="text-gray-500 mr-2">New to Viazo?</span>
          <Link href="/signup" className="font-bold text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition-colors">
            Create an account
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2">LOGIN</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">Welcome back! Please enter your details.</p>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            
            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200">
                {error}
              </div>
            )}

            {/* Identifier Input (Email or Phone) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Email or Phone Number</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                <input 
                  type="text" // Changed from email to text to support phone numbers
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or phone number" 
                  className="w-full border border-gray-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-1 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-500 select-none">
                <input type="checkbox" className="w-4 h-4 accent-black border-gray-300 rounded-sm cursor-pointer" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-xs font-bold text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <p className="text-xs text-gray-500 mt-8 font-medium">
            By continuing, you agree to our <Link href="/terms" className="text-black border-b border-black">Terms of Service</Link> and <Link href="/privacy" className="text-black border-b border-black">Privacy Policy</Link>.
          </p>

          {/* Mobile "Create Account" Link */}
          <div className="md:hidden mt-8 text-sm text-center">
            <span className="text-gray-500 mr-2">New to Viazo?</span>
            <Link href="/signup" className="font-bold text-black border-b border-black">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}