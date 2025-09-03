import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../component/Button";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const navigate=useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            console.log("Form submitted:", formData);

            const res = await axios.post("http://localhost:3000/signup",{
                username:formData.username,
                email:formData.email,
                password: formData.password
            })
            console.log("user sign up successfully")

            // If backend returns token on signup, log the user in and go home  but this will not be used as we are not creating any token 
            //when user do signup. 
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                login(res.data.token, res.data.user);
                navigate("/");
                return;
            }
            // Otherwise, go to signin page
            navigate("/signin")
            
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Error creating account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                        <svg 
                            className="h-8 w-8 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join our chat community today</p>
                </div>

                {/* Signup Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                    errors.username 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 hover:border-green-400'
                                }`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                    errors.email 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 hover:border-green-400'
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                    errors.password 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 hover:border-green-400'
                                }`}
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                                    errors.confirmPassword 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 hover:border-green-400'
                                }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button isLoading={isLoading} text="Create Account" />

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link 
                                to="/signin" 
                                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Terms and Privacy */}
                <div className="text-center text-xs text-gray-500">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
}