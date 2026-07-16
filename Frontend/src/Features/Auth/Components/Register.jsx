import React, { useEffect, useRef, useState } from 'react';
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
    const { registerHandler, resendEmailHandler, getMeHandler } = useAuth();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);
    const user = useSelector((state) => state.auth.user);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [resendCountdown, setResendCountdown] = useState(0); // 0 = button visible, >0 = cooling down
    const countdownRef = useRef(null);


    useEffect(() => {
        async function getMe() {
            await getMeHandler();
        }
        getMe();
    }, [])

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user])


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

    function startResendCountdown() {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setResendCountdown(60);
        countdownRef.current = setInterval(() => {
            setResendCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    useEffect(() => {
        return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
    }, []);

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

        const normalizedEmail = email.trim().toLowerCase();
        setRegisteredEmail(normalizedEmail);

        try {
            const res = await registerHandler(username.trim(), normalizedEmail, password);
            if (res && res.success) {
                setSuccessMessage(res.message || 'Registration successful! Please check your email to verify your account.');
                // Clear form fields
                setUsername('');
                setEmail('');
                setPassword('');
                startResendCountdown();
            } else {
                setFormError(res?.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setFormError('Something went wrong. Please try again.');
        }
    }

    async function resendHandler(resendEmail = email) {
        if (resendCountdown > 0) return;
        startResendCountdown();
        const targetEmail = (resendEmail || registeredEmail || email).trim();
        const res = await resendEmailHandler(targetEmail);
        if (res && res.success) {
            setSuccessMessage(res.message || 'Resend successful! Please check your email to verify your account.');
        } else {
            setFormError(res?.error || 'Resend failed. Please try again.');
        }
    }


    return (
        <div className="w-full min-h-screen flex bg-[#0A0A0A] text-white select-none">
            {/* ── LEFT PANEL ── */}
            <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-10 bg-[#0A0A0A] z-10 relative">
                <div className="flex flex-col items-center w-full max-w-[360px]">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <img className="h-20 w-24 m-0" src="images/AppLogo.png" alt="App Logo" />
                        <span className="text-4xl font-extrabold tracking-tight text-white">AskBase</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-white mb-1.5 leading-tight">Create your account</h1>
                    <p className="text-sm text-[#888887] mb-6 leading-relaxed">Join us today to get started</p>

                    {/* Form-level success banner */}
                    {successMessage && (
                        <div className="w-full mb-4 flex flex-col gap-2.5">
                            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded p-3.5 flex items-center gap-2.5">
                                <i className="ri-checkbox-circle-line text-emerald-400 text-[18px] mt-0.5"></i>
                                <span className="text-xs text-emerald-400 leading-normal">{successMessage}</span>
                            </div>

                            {/* Resend button */}
                            <button
                                type="button"
                                onClick={() => resendHandler()}
                                disabled={resendCountdown > 0}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300"
                                style={resendCountdown > 0 ? {
                                    background: 'transparent',
                                    borderColor: '#3c3c3c',
                                    color: '#555',
                                    cursor: 'not-allowed',
                                } : {
                                    background: 'transparent',
                                    borderColor: '#F5FF3A40',
                                    color: '#F5FF3A',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 0 0 rgba(245,255,58,0)',
                                }}
                                onMouseEnter={e => { if (resendCountdown === 0) e.currentTarget.style.boxShadow = '0 0 10px rgba(245,255,58,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {resendCountdown > 0 ? (
                                    <>
                                        <span
                                            className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold"
                                            style={{
                                                background: 'conic-gradient(#F5FF3A ' + (resendCountdown / 10 * 360) + 'deg, #27272A 0deg)',
                                            }}
                                        >
                                            <span className="inline-flex items-center justify-center w-[12px] h-[12px] rounded-full bg-[#0A0A0A] text-[#888887] text-[8px]">
                                                {resendCountdown}
                                            </span>
                                        </span>
                                        <span className="text-[#555]">Resend email in {resendCountdown}s</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-mail-send-line text-[15px]"></i>
                                        <span>Resend verification email</span>
                                    </>
                                )}
                            </button>
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
                    <form className="flex flex-col gap-3 w-full" onSubmit={submitHandler} noValidate>
                        {/* Username */}
                        <div className="relative flex flex-col gap-1">
                            <input
                                id="register-username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                className={`w-full border rounded-xl px-3.5 py-3 text-[14px] text-white placeholder-[#888887] outline-none transition-all duration-200 focus:border-[#F5FF3A] focus:ring-1 focus:ring-[#F5FF3A] ${errors.username ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]' : 'border-[#3c3c3c]'
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
                                className={`w-full border rounded-xl px-3.5 py-3 text-[14px] text-white placeholder-[#888887] outline-none transition-all duration-200 focus:border-[#F5FF3A] focus:ring-1 focus:ring-[#F5FF3A] ${errors.email ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]' : 'border-[#3c3c3c]'
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
                                className={`w-full border rounded-xl px-3.5 py-3 text-[14px] text-white placeholder-[#888887] outline-none transition-all duration-200 focus:border-[#F5FF3A] focus:ring-1 focus:ring-[#F5FF3A] ${errors.password ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]' : 'border-[#3c3c3c]'
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
                            className="w-full bg-linear-to-r from-[#F5FF3A] to-[#ABD600] text-[#0A0A0A] border-none rounded-xl py-3 font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 mt-1 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_12px_rgba(205,255,0,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
                    <div className="flex items-center gap-4 mt-6 before:content-[''] before:flex-1 before:h-[1px] before:bg-[#27272A] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#27272A]">
                        <span className="text-[11px] font-medium text-[#A1A1AA] tracking-widest uppercase whitespace-nowrap">Or Sign up with</span>
                    </div>

                    {/* Social buttons */}
                    <div className="grid grid-cols-2 w-36 gap-3 mt-3">
                        <button className="flex items-center justify-center h-11 bg-[#1A1A1A] border border-[#27272A] rounded cursor-pointer transition-colors duration-200 hover:bg-[#201f1f]" type="button" aria-label="Sign up with Google">
                            <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                            </svg>
                        </button>
                        <button className="flex items-center justify-center h-11 bg-[#1A1A1A] border border-[#27272A] rounded cursor-pointer transition-colors duration-200 hover:bg-[#201f1f]" type="button" aria-label="Sign up with GitHub">
                            <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-[#888887]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#F5FF3A] font-medium hover:text-[#ABD600] transition-colors duration-200">Sign in</Link>
                    </p>
                </div>
            </section>

            {/* ── RIGHT PANEL — Hero ── */}
            <section className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#0A0A0A]">
                <img
                    src='images/Register_Hero.png'
                    alt="Futuristic VR experience"
                    className="absolute top-1/2 left-1/2 w-full h-full max-w-[42vw] max-h-[90vh] object-cover object-bottom rounded-2xl -translate-x-1/2 -translate-y-1/2"
                />

                {/* Floating analytics card */}
                <div className="absolute bottom-8 right-8 max-w-[260px] bg-[#1A1A1A]/40 backdrop-blur-md border border-[#F5FF3A]/20 rounded-lg p-4 transition-transform duration-500 hover:scale-[1.02] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#F5FF3A] before:to-transparent before:opacity-50">
                    <div className="text-base font-semibold text-white mb-1">Scale Up</div>
                    <div className="text-[11px] text-[#A1A1AA] leading-relaxed">
                        Innovate your business with our AI made to fetch analysis that aligns with your business goals and vision.
                    </div>
                    <svg className="mt-2.5 h-[50px]" viewBox="0 0 260 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
