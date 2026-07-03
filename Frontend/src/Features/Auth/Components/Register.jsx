import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useAuth from '../Hooks/useAuth.js';
import { useNavigate, Link } from 'react-router';

// ─── Validation helpers (mirrors backend registerValidator) ───
function validateUsername(username) {
    const trimmed = username.trim();
    if (!trimmed) return 'Username is required';
    if (trimmed.length < 3 || trimmed.length > 20) {
        return 'Username must be between 3 and 20 characters';
    }
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmed)) {
        return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return '';
}

function validateEmail(email) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return 'Please provide a valid email address';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Please provide a valid email address';
    if (trimmed.length > 100) return 'Email must not exceed 100 characters';
    return '';
}

function validatePassword(password) {
    if (password.length < 6 || password.length > 50) return 'Password must be between 6 and 50 characters';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return '';
}

const Register = () => {
    const { registerHandler } = useAuth();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Clear error on change
    function handleUsernameChange(value) {
        setUsername(value);
        setFormError('');
        setErrors(prev => ({ ...prev, username: '' }));
    }

    // Clear error on change
    function handleEmailChange(value) {
        setEmail(value);
        setFormError('');
        setErrors(prev => ({ ...prev, email: '' }));
    }

    function handlePasswordChange(value) {
        setPassword(value);
        setFormError('');
        setErrors(prev => ({ ...prev, password: '' }));
    }

    async function submitHandler(e) {
        e.preventDefault();

        // Force-validate everything
        const usernameErr = validateUsername(username);
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        setErrors({ username: usernameErr, email: emailErr, password: passwordErr });

        if (usernameErr || emailErr || passwordErr) return;

        setFormError('');
        setSuccessMessage('');

        try {
            const res = await registerHandler(username.trim(), email.trim().toLowerCase(), password);
            if (res && res.success) {
                setSuccessMessage(res.message || 'Registration successful! Please check your email to verify your account.');
                // Clear form fields
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setFormError(res?.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setFormError('Something went wrong. Please try again.');
        }
    }


    return (
        <div className="w-full min-h-screen flex bg-[#0A0A0A] text-white select-none">
            {/* ── LEFT PANEL ── */}
            <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-16 bg-[#0A0A0A] z-10 relative">
                <div className="flex flex-col items-center w-full max-w-[420px]">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-24">
                        <img className="h-35 w-45 m-[-17%] ml-[-10%]" src="../../../../public/images/AppLogo.png" alt="App Logo" />
                        <span className="text-5xl font-extrabold tracking-tight text-white">AskBase</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl md:text-[32px] font-semibold tracking-tight text-white mb-2 leading-tight">Create your account</h1>
                    <p className="text-base text-[#888887] mb-8 leading-relaxed">Join us today to get started</p>

                    {/* Form-level success banner */}
                    {successMessage && (
                        <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded p-3.5 mb-4 flex items-center gap-2.5">
                            <i className="ri-checkbox-circle-line text-emerald-400 text-[18px] mt-0.5"></i>
                            <span className="text-xs text-emerald-400 leading-normal">{successMessage}</span>
                        </div>
                    )}

                    {/* Form-level error banner */}
                    {formError && (
                        <div className="w-full bg-[#FF6B6B]/8 border border-[#FF6B6B]/20 rounded p-3.5 mb-4 flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-[#FF6B6B] text-[18px]">error</span>
                            <span className="text-xs text-[#FF6B6B]">{formError}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form className="flex flex-col gap-4 w-full" onSubmit={submitHandler} noValidate>
                        {/* Username */}
                        <div className="relative flex flex-col gap-1">
                            <input
                                id="register-username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] text-white placeholder-[#888887] outline-none transition-all duration-200 focus:border-[#F5FF3A] focus:ring-1 focus:ring-[#F5FF3A] ${errors.username ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]' : 'border-[#3c3c3c]'
                                    }`}
                                autoComplete="username"
                            />
                            {errors.username && (
                                <span className="text-[11px] font-medium text-[#FF6B6B] tracking-wide pt-1 pl-0.5">{errors.username}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="relative flex flex-col gap-1">
                            <input
                                id="register-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] text-white placeholder-[#888887] outline-none transition-all duration-200 focus:border-[#F5FF3A] focus:ring-1 focus:ring-[#F5FF3A] ${errors.email ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]' : 'border-[#3c3c3c]'
                                    }`}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <span className="text-[11px] font-medium text-[#FF6B6B] tracking-wide pt-1 pl-0.5">{errors.email}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative flex flex-col gap-1">
                            <input
                                id="register-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                className={`w-full border rounded-xl px-4 py-3.5 text-[15px] text-white placeholder-[#888887] outline-none transition-all duration-200 focus:border-[#F5FF3A] focus:ring-1 focus:ring-[#F5FF3A] ${errors.password ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]' : 'border-[#3c3c3c]'
                                    }`}
                                autoComplete="new-password"
                                style={{ paddingRight: '48px' }}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-4 -translate-y-1/2 bg-none border-none text-[#A1A1AA] cursor-pointer p-0 flex items-center hover:text-[#F5FF3A] transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                style={{ top: errors.password ? 'calc(50% - 10px)' : '50%' }}
                            >
                                <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                            </button>
                            {errors.password && (
                                <span className="text-[11px] font-medium text-[#FF6B6B] tracking-wide pt-1 pl-0.5">{errors.password}</span>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-[#F5FF3A] text-[#0A0A0A] border-none rounded-xl py-3.5 font-semibold text-base cursor-pointer flex items-center justify-center gap-2 mt-2 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_12px_rgba(205,255,0,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-[18px] h-[18px] border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mt-8 before:content-[''] before:flex-1 before:h-[1px] before:bg-[#27272A] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#27272A]">
                        <span className="text-xs font-medium text-[#A1A1AA] tracking-widest uppercase whitespace-nowrap">Or Sign up with</span>
                    </div>

                    {/* Social buttons */}
                    <div className="grid grid-cols-2 w-40 gap-4 mt-4">
                        <button className="flex items-center justify-center h-12 bg-[#1A1A1A] border border-[#27272A] rounded cursor-pointer transition-colors duration-200 hover:bg-[#201f1f]" type="button" aria-label="Sign up with Google">
                            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                            </svg>
                        </button>
                        <button className="flex items-center justify-center h-12 bg-[#1A1A1A] border border-[#27272A] rounded cursor-pointer transition-colors duration-200 hover:bg-[#201f1f]" type="button" aria-label="Sign up with GitHub">
                            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-[#888887]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#F5FF3A] font-medium hover:text-[#ABD600] transition-colors duration-200">Sign in</Link>
                    </p>
                </div>
            </section>

            {/* ── RIGHT PANEL — Hero ── */}
            <section className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#0A0A0A]">
                <img
                    src='../../../../public/images/Login_Hero.png'
                    alt="Futuristic VR experience"
                    className="absolute top-1/2 left-1/2 w-full h-full max-w-[45vw] max-h-[95vh] object-cover object-bottom rounded-2xl -translate-x-1/2 -translate-y-1/2"
                />

                {/* Floating analytics card */}
                <div className="absolute bottom-10 right-10 max-w-[300px] bg-[#1A1A1A]/40 backdrop-blur-md border border-[#F5FF3A]/20 rounded-lg p-5 transition-transform duration-500 hover:scale-[1.02] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#F5FF3A] before:to-transparent before:opacity-50">
                    <div className="text-lg font-semibold text-white mb-1.5">Scale Up</div>
                    <div className="text-xs text-[#A1A1AA] leading-relaxed">
                        Innovate your business with our AI made to fetch analysis that aligns with your business goals and vision.
                    </div>
                    <svg className="mt-3.5 h-[60px]" viewBox="0 0 260 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 55 Q30 50 50 42 T100 30 T150 18 T200 8 T260 2"
                            stroke="#F5FF3A"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <path
                            d="M0 55 Q30 50 50 42 T100 30 T150 18 T200 8 T260 2 V60 H0 Z"
                            fill="url(#chartGradient)"
                            opacity="0.15"
                            defaultValue=""
                        />
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F5FF3A" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        {/* Data points */}
                        <circle cx="50" cy="42" r="3" fill="#F5FF3A" />
                        <circle cx="100" cy="30" r="3" fill="#F5FF3A" />
                        <circle cx="150" cy="18" r="3" fill="#F5FF3A" />
                        <circle cx="200" cy="8" r="3" fill="#F5FF3A" />
                    </svg>
                </div>
            </section>
        </div>
    );
};

export default Register;
