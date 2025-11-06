'use client';
import React, { useState } from 'react';

function Form() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setStatus(result.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Server error. Please try again later.');
    }
  };

  return (
    <form
      className="mt-10  space-y-5 md:space-y-10 font-Int text-sm text-black w-full"
      onSubmit={handleSubmit}
      aria-label="Contact Form"
    >
      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row gap-5">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border-b border-neutral-400 bg-transparent py-3 px-1 focus:border-black focus:outline-none placeholder:text-neutral-500 tracking-wide"
          autoComplete="given-name"
          aria-label="First Name"
          title="Enter your first name"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border-b border-neutral-400 bg-transparent py-3 px-1 focus:border-black focus:outline-none placeholder:text-neutral-500 tracking-wide"
          autoComplete="family-name"
          aria-label="Last Name"
          title="Enter your last name"
        />
      </div>

      {/* Contact Fields */}
      <div className="flex flex-col sm:flex-row gap-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border-b border-neutral-400 bg-transparent py-3 px-1 focus:border-black focus:outline-none placeholder:text-neutral-500 tracking-wide"
          autoComplete="email"
          aria-label="Email"
          title="Enter your email address"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone No."
          value={formData.phone}
          onChange={handleChange}
          className="w-full border-b border-neutral-400 bg-transparent py-3 px-1 focus:border-black focus:outline-none placeholder:text-neutral-500 tracking-wide"
          autoComplete="tel"
          aria-label="Phone Number"
          title="Enter your phone number"
        />
      </div>

      {/* Message Field */}
      <div>
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full h-32 border-b border-neutral-400 bg-transparent py-3 px-1 resize-none focus:border-black focus:outline-none placeholder:text-neutral-500 tracking-wide"
          aria-label="Your message"
          title="Enter your message"
          required
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="bg-[#1c1c1c] text-white uppercase tracking-wider font-medium px-8 py-3 transition-all duration-300 hover:bg-[#000] border border-black"
          aria-label="Send Message Button"
        >
          Send Message
        </button>
      </div>

      {/* Submission Status */}
      <div className="text-sm text-neutral-700 italic" aria-live="polite">
        {status}
      </div>
    </form>
  );
}

export default Form;
