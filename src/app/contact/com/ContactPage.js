'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center pt-20 pb-24">
      
      {/* Page Header */}
      <div className="text-center mb-16 px-4">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
          We're here to help
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-black uppercase tracking-tight">
          Get In Touch
        </h1>
        <div className="w-12 h-[2px] bg-black mx-auto mt-6"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-16">
        
        {/* Left Section - Contact Information */}
        <div className="w-full lg:w-5/12 flex flex-col space-y-10 bg-[#f9f9f9] p-10 md:p-14 rounded-sm">
          <div>
            <h3 className="text-2xl font-extrabold text-black uppercase tracking-tight mb-2">
              Contact Information
            </h3>
            <p className="text-sm text-gray-500">
              Have a question about a drop, order, or just want to say hi? Reach out to us.
            </p>
          </div>

          <div className="space-y-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-black uppercase tracking-wide mb-1">Our Headquarters</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  123 Viazo Street, Sneaker District<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-black uppercase tracking-wide mb-1">Email Us</h4>
                <p className="text-sm text-gray-600">support@viazo.com</p>
                <p className="text-sm text-gray-600">partnerships@viazo.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-black uppercase tracking-wide mb-1">Call Us</h4>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-black uppercase tracking-wide mb-1">Working Hours</h4>
                <p className="text-sm text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM (EST)</p>
                <p className="text-sm text-gray-600">Sat - Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Subject
              </label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Order Inquiry / Support / Partnership"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Message
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="How can we help you?"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="group flex items-center justify-center gap-2 w-full md:w-auto bg-black text-white font-bold text-xs tracking-widest uppercase py-4 px-10 rounded-sm hover:bg-gray-900 transition-colors"
            >
              Send Message
              <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}