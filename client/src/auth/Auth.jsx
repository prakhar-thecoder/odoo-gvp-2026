import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from './authApi';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDemoCreds, setShowDemoCreds] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (isLogin) {
                const data = await login({ email, password });
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                const data = await register({ name, email, password });
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            {/* Logo placeholder - optional, but nice for SaaS look */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Fleet<span className="text-blue-500">Master</span></h1>
                <p className="mt-2 text-slate-400">Manage your operations with precision</p>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>

                {isLogin && (
                    <div className="mb-6 rounded-lg border border-blue-200 overflow-hidden shadow-sm">
                        <button 
                            type="button"
                            onClick={() => setShowDemoCreds(!showDemoCreds)}
                            className="w-full flex items-center justify-between bg-blue-50 px-4 py-3 text-blue-800 font-medium hover:bg-blue-100 transition focus:outline-none"
                        >
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Jury Demo Credentials
                            </span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transform transition-transform duration-200 ${showDemoCreds ? 'rotate-180' : ''}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        <div className={`px-4 py-3 bg-white border-t border-blue-100 transition-all duration-300 ${showDemoCreds ? 'block' : 'hidden'}`}>
                            <div className="flex flex-col space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-500">Email:</span>
                                    <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded select-all">jury@hackathon.odoo.com</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-500">Password:</span>
                                    <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded select-all">odoo@123</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setEmail('jury@hackathon.odoo.com');
                                        setPassword('odoo@123');
                                    }}
                                    className="mt-2 w-full text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded transition"
                                >
                                    Auto-fill Credentials
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                placeholder="Your Name"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2"
                    >
                        {isSubmitting ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition focus:outline-none"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
