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
                                placeholder="John Doe"
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
