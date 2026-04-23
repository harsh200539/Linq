"use client";
import React, { useState } from "react";
// Removed unused toast import
import "react-toastify/dist/ReactToastify.css";
export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);

   

    // Simulate API call
    setTimeout(() => {
      alert("Thank you for your message! We will get back to you soon.");

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 linq-card">
      <h3 className="h4 fw-bold text-linq-dark mb-4">Send us a message</h3>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
        />
        {errors.name && (
          <p className="text-danger mt-1 mb-0" style={{ fontSize: "0.875rem" }}>
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@example.com"
        />
        {errors.email && (
          <p className="text-danger mt-1 mb-0" style={{ fontSize: "0.875rem" }}>
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="subject" className="form-label">
          Subject <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.subject ? "is-invalid" : ""}`}
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject of your inquiry"
        />
        {errors.subject && (
          <p className="text-danger mt-1 mb-0" style={{ fontSize: "0.875rem" }}>
            {errors.subject}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          className="form-control"
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          rows="2"
        />
      </div>

      <button
        type="submit"
        className="btn btn-lg btn-linq-primary w-100"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
