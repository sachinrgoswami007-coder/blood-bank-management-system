import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  AlertCircle,
  ChevronDown,
  ShieldCheck,
  Heart,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  Droplet,
  PhoneCall,
  ArrowUp,
  ArrowRight,
  Activity,
  FileCheck2,
  Sparkles,
  Lock
} from 'lucide-react';

// Reusable Scroll Reveal Animation Wrapper
const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-98 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const LoginPage = () => {
  const [role, setRole] = useState('ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setSubmitting(true);
      const data = await login(email, password, role);

      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'DONOR') navigate('/donor');
      else if (data.role === 'HOSPITAL') navigate('/hospital');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'ADMIN') {
      setEmail('admin@bloodbank.org');
      setPassword('Admin@123');
    } else if (demoRole === 'DONOR') {
      setEmail('donor1@example.com');
      setPassword('Donor@123');
    } else if (demoRole === 'HOSPITAL') {
      setEmail('hospital1@example.com');
      setPassword('Hospital@123');
    }
    setError('');
  };

  const scrollToInfo = () => {
    document.getElementById('portal-info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-serif">
      <Navbar />

      {/* Main Login Screen */}
      <section className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-8 sm:pt-12 animate-fade-in">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all duration-300 hover:shadow-2xl">
          
          {/* Left Column: Visual Image Banner */}
          <div className="hidden md:flex md:col-span-6 relative bg-gray-900 overflow-hidden flex-col justify-between p-8 text-white">
            <img
              src="/assets/doctor-care.jpg"
              alt="Medical Team & Hospital Care"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-45 transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/45 to-gray-900/30" />

            {/* Top Tag */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs">
                <Droplet className="w-3.5 h-3.5 fill-current" />
                Emergency Response
              </span>
            </div>

            {/* Bottom Quote & Stats */}
            <div className="relative z-10 space-y-4">
              <blockquote className="text-lg font-bold leading-snug">
                "Every 2 seconds, a patient in urgent trauma or surgery requires safe, compatible blood."
              </blockquote>
              <p className="text-xs text-gray-300 leading-relaxed">
                Lifeline connects voluntary donors directly to hospital emergency intensive care units.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15 text-xs">
                <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 border border-white/10">
                  <span className="text-sm font-bold text-red-400 block">100% Tested</span>
                  <span className="text-[10px] text-gray-300">Safe cold-chain custody</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 border border-white/10">
                  <span className="text-sm font-bold text-emerald-400 block">Instant Match</span>
                  <span className="text-[10px] text-gray-300">8 blood groups live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center">
            <div className="text-center md:text-left mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-xs text-gray-500 mt-1">Sign in to your Lifeline portal</p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-gray-100 border border-gray-200 mb-4">
              <button
                type="button"
                onClick={() => { setRole('ADMIN'); setError(''); }}
                className={`py-1.5 rounded-md text-xs font-bold transition-all duration-150 active:scale-95 ${
                  role === 'ADMIN' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => { setRole('DONOR'); setError(''); }}
                className={`py-1.5 rounded-md text-xs font-bold transition-all duration-150 active:scale-95 ${
                  role === 'DONOR' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => { setRole('HOSPITAL'); setError(''); }}
                className={`py-1.5 rounded-md text-xs font-bold transition-all duration-150 active:scale-95 ${
                  role === 'HOSPITAL' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hospital
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2.5 text-xs transition-all duration-150 focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2.5 text-xs transition-all duration-150 focus:border-red-600"
                  required
                />
              </div>

              <button type="submit" disabled={submitting} className="w-full btn-primary py-2.5 mt-2 active:scale-95 transition-transform duration-150">
                {submitting ? 'Authenticating...' : `Login as ${role}`}
              </button>
            </form>

            {/* Presets */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center md:text-left">
                Quick 1-Click Demo Accounts
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemo('ADMIN')}
                  className="py-1 rounded bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all font-bold"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('DONOR')}
                  className="py-1 rounded bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all font-bold"
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('HOSPITAL')}
                  className="py-1 rounded bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all font-bold"
                >
                  Hospital
                </button>
              </div>
            </div>

            <div className="mt-4 text-center md:text-left text-xs text-gray-600">
              Need an account?{' '}
              <Link to="/register/donor" className="text-red-600 hover:underline font-bold active:scale-95 inline-block transition-transform">
                Sign Up Donor
              </Link>
              {' • '}
              <Link to="/register/hospital" className="text-sky-600 hover:underline font-bold active:scale-95 inline-block transition-transform">
                Register Hospital
              </Link>
            </div>
          </div>
        </div>

        {/* Bouncing Scroll Down Animation Indicator */}
        <div className="mt-8 mb-4 flex flex-col items-center justify-center animate-bounce-down">
          <button
            type="button"
            onClick={scrollToInfo}
            className="group flex flex-col sm:flex-row items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white border border-gray-200 shadow-md hover:shadow-lg text-xs font-bold text-gray-700 hover:text-red-600 transition-all duration-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              Scroll down to explore blood donation journey & safety standards
            </span>
            <ChevronDown className="w-4 h-4 text-red-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* SCROLL-DOWN INFORMATION SECTIONS */}
      <div id="portal-info-section" className="border-t border-gray-200 bg-white">

        {/* Section: The Journey of Every Blood Donation */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Transparent Medical Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2.5">
                The Journey of Every Blood Donation
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                From a compassionate donor to emergency clinical transfusion in under 24 hours.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <ScrollReveal delay={100}>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src="/assets/hero-donation.jpg"
                    alt="Voluntary Blood Donation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md">
                    Step 1 • Donation
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Voluntary Donation & Screening</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Voluntary donors undergo quick health screenings in sanitized, comfortable donation suites with certified phlebotomists.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-red-600 font-bold">
                    <span>Quick 15-minute process</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={200}>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src="/assets/blood-lab.jpg"
                    alt="Cold-Chain Laboratory Storage"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-sky-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md">
                    Step 2 • Testing & Storage
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Cold-Chain Preservation</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Every bag is rigorously tested for blood type and pathogens, barcoded, and stored in state-of-the-art climate-controlled vaults.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-sky-600 font-bold">
                    <span>Automated expiry management</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={300}>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src="/assets/doctor-care.jpg"
                    alt="Emergency Hospital Delivery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md">
                    Step 3 • Life Saved
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Hospital Emergency Dispatch</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Surgeons and critical trauma teams submit urgent requests that are fulfilled with instant batch reservations and fast dispatch.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-600 font-bold">
                    <span>Direct emergency courier dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Laboratory Cold-Chain Standards with Visual Image */}
        <section className="py-14 bg-gray-50 border-t border-gray-200 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <ScrollReveal className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md group">
                <img
                  src="/assets/blood-lab.jpg"
                  alt="Automated Cold-Chain Blood Laboratory"
                  className="w-full h-80 object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent flex items-end p-6 text-white">
                  <div>
                    <span className="bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs">
                      ISO-15189 Certified Storage
                    </span>
                    <h4 className="font-bold text-lg text-white mt-1">
                      Validated Cold-Chain Preservation (2°C – 6°C)
                    </h4>
                    <p className="text-gray-300 text-xs mt-0.5">
                      Temperature sensors continuously record inventory conditions to ensure medical viability.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Safety & Quality Assurance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Every Blood Unit is Rigorously Tested and Tracked
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Before any donated unit enters the available inventory pool, our automated biochemical protocols conduct comprehensive screening:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Infection Free Guarantee</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Mandatory multi-marker screening for Hepatitis B/C, HIV 1 & 2, Malaria, and Syphilis.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex items-center gap-2 text-sky-700 font-bold text-xs mb-1">
                    <Clock className="w-4 h-4" />
                    <span>42-Day Expiry Tracking</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Automated system exclusion prevents allocation of batches beyond the 42-day shelf-life.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                    <Lock className="w-4 h-4" />
                    <span>Donor Anonymity</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Cryptographic barcoding ensures patient and donor identities remain strictly confidential.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                    <Activity className="w-4 h-4" />
                    <span>FIFO Dispatching</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    First-In, First-Out allocation algorithm prioritizes older verified stock to minimize waste.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Section 3: Emergency Helpline & Back to Login Button */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-600 text-white text-xs font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24/7 Emergency Triage Hotline</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Critical Surgery or Trauma Emergency?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                  Contact our regional dispatch officers immediately at <strong className="text-red-700">+1 (800) 555-BLOOD</strong> for expedited hospital courier delivery.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="btn-primary text-xs px-5 py-3 shadow-md flex items-center gap-2 active:scale-95"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Return to Login Form</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 px-4 text-center text-xs text-gray-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Lifeline Blood Bank Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={scrollToTop} className="hover:text-gray-900 cursor-pointer">Back to Top ↑</button>
            <Link to="/" className="hover:text-gray-900">Home Page</Link>
            <Link to="/register/donor" className="hover:text-gray-900">Register as Donor</Link>
            <Link to="/register/hospital" className="hover:text-gray-900">Register Hospital</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
