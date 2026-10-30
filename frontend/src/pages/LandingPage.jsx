import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import api from '../services/api';
import {
  Droplet,
  Heart,
  ShieldCheck,
  Building2,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  Search
} from 'lucide-react';

const LandingPage = () => {
  const [inventorySummary, setInventorySummary] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const [calcDate, setCalcDate] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Blood compatibility mapping
  const compatibilityMap = {
    'O-': { canGiveTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'] },
    'O+': { canGiveTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O+', 'O-'] },
    'A-': { canGiveTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
    'A+': { canGiveTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
    'B-': { canGiveTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
    'B+': { canGiveTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
    'AB-': { canGiveTo: ['AB+', 'AB-'], canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'] },
    'AB+': { canGiveTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/inventory/public/summary');
        if (res.data.success) {
          setInventorySummary(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load inventory summary:", err);
      }
    };
    fetchSummary();
  }, []);

  const handleCalculateEligibility = (e) => {
    e.preventDefault();
    if (!calcDate) return;
    const lastDate = new Date(calcDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 56); // 56 days donor interval

    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setEligibilityResult({
      nextEligibleDate: nextDate.toISOString().split('T')[0],
      daysRemaining: diffDays > 0 ? diffDays : 0,
      isEligible: diffDays <= 0
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-serif">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Main */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-xs">
              <Droplet className="w-4 h-4 text-red-600 fill-current" />
              <span>Verified Emergency Healthcare Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Connecting Donors, Hospitals & Blood Supplies in Real-Time.
            </h1>

            <p className="text-base text-gray-600 max-w-xl leading-relaxed">
              Lifeline Blood Bank Management System streamlines emergency requests, donor availability tracking, and automated stock allocations.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/register/donor" className="btn-primary text-xs px-5 py-2.5 shadow-sm hover:shadow-md">
                <UserPlus className="w-4 h-4" />
                <span>Become a Voluntary Donor</span>
              </Link>
              <Link to="/register/hospital" className="btn-secondary text-xs px-5 py-2.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Register Hospital</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200">
              <div className="p-3 bg-white rounded border border-gray-200 text-center shadow-xs">
                <span className="text-xl font-bold text-red-600 block">3 Lives</span>
                <span className="text-[11px] text-gray-500 font-semibold">Saved per Donation</span>
              </div>
              <div className="p-3 bg-white rounded border border-gray-200 text-center shadow-xs">
                <span className="text-xl font-bold text-gray-900 block">100%</span>
                <span className="text-[11px] text-gray-500 font-semibold">Verified Stock</span>
              </div>
              <div className="p-3 bg-white rounded border border-gray-200 text-center shadow-xs">
                <span className="text-xl font-bold text-emerald-600 block">24/7</span>
                <span className="text-[11px] text-gray-500 font-semibold">Emergency Triage</span>
              </div>
            </div>
          </div>

          {/* Right Live Inventory Grid */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md group">
              <img
                src="/assets/hero-donation.jpg"
                alt="Voluntary Blood Donation at Lifeline Center"
                className="w-full h-52 object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent flex items-end p-4">
                <div>
                  <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                    Safe & Certified
                  </span>
                  <h4 className="text-white font-bold text-sm sm:text-base mt-1 leading-snug">
                    Real People. Real Donors. Real Impact.
                  </h4>
                  <p className="text-gray-300 text-[11px] mt-0.5">
                    Every donation is processed under strict WHO and National Blood Bank safety standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Available Blood Inventory</h3>
                  <p className="text-[11px] text-gray-500">Live units in database</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  LIVE STATUS
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`p-2.5 rounded border text-center transition-all ${
                      selectedGroup === bg
                        ? 'bg-red-50 border-red-600 shadow-xs'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-red-700 block">{bg}</span>
                    <span className="text-lg font-extrabold text-gray-900 block mt-0.5">
                      {inventorySummary[bg] || 0}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">units</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW UI FEATURE 1: Blood Compatibility Matrix Widget */}
      <section className="py-10 bg-white border-y border-gray-200 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Blood Group Compatibility Guide</h2>
            <p className="text-xs text-gray-600 mt-1">Select a blood group to view matching donors and recipients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Blood Selector Buttons */}
            <div className="md:col-span-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Blood Group:</p>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`py-2 rounded text-xs font-bold border transition-all ${
                      selectedGroup === bg
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Compatibility Details Card */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-red-700">
                  <ArrowRight className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Can Donate Blood To:</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {compatibilityMap[selectedGroup]?.canGiveTo.map((target) => (
                    <span key={target} className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-900 font-bold text-xs">
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Can Receive Blood From:</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {compatibilityMap[selectedGroup]?.canReceiveFrom.map((src) => (
                    <span key={src} className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-900 font-bold text-xs">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW UI FEATURE 2: Donor Eligibility Calculator Widget */}
      <section className="py-12 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto card bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 rounded bg-red-50 text-red-600 border border-red-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Donor Eligibility Calculator</h3>
              <p className="text-xs text-gray-500">Check when you are next eligible to donate blood (56-day standard interval)</p>
            </div>
          </div>

          <form onSubmit={handleCalculateEligibility} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Enter Last Blood Donation Date:</label>
              <input
                type="date"
                value={calcDate}
                onChange={(e) => setCalcDate(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>
            <button type="submit" className="btn-primary py-2.5">
              Calculate Eligibility
            </button>
          </form>

          {eligibilityResult && (
            <div className={`mt-5 p-4 rounded border text-xs font-bold flex items-center justify-between ${
              eligibilityResult.isEligible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              <div>
                <p className="text-sm font-bold">
                  {eligibilityResult.isEligible
                    ? '🎉 You are eligible to donate blood today!'
                    : `⏳ Next eligible donation date: ${eligibilityResult.nextEligibleDate}`}
                </p>
                {!eligibilityResult.isEligible && (
                  <p className="text-xs font-normal mt-0.5 text-gray-600">
                    {eligibilityResult.daysRemaining} days remaining until your next donation window.
                  </p>
                )}
              </div>
              {eligibilityResult.isEligible && (
                <Link to="/register/donor" className="btn-success text-xs px-3 py-1.5">
                  Book Donation
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 px-4 text-center text-xs text-gray-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Lifeline Blood Bank Management System</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-gray-900">Sign In</Link>
            <Link to="/register/donor" className="hover:text-gray-900">Donor Portal</Link>
            <Link to="/register/hospital" className="hover:text-gray-900">Hospital Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
