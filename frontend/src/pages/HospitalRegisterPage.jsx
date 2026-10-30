import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { Building2, PlusCircle, AlertCircle } from 'lucide-react';

const HospitalRegisterPage = () => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerHospital } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      await registerHospital(formData);
      navigate('/hospital');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-serif">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl card bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
          
          {/* Header Visual Banner */}
          <div className="relative rounded-xl overflow-hidden mb-6 h-40 border border-gray-200 shadow-xs">
            <img
              src="/assets/doctor-care.jpg"
              alt="Hospital Care Network"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent flex items-center p-6 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-600 px-2.5 py-0.5 rounded shadow-xs">
                  Institutional Healthcare Network
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                  Hospital & Trauma Center Onboarding
                </h3>
                <p className="text-xs text-gray-200 max-w-md mt-1 leading-relaxed">
                  Gain instant access to real-time blood group availability, priority emergency requests, and cold-chain dispatches.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hospital Registration</h2>
              <p className="text-xs text-gray-500 font-medium">Register medical institution for blood supply authorization</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Metro General Hospital"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">License / Reg Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="REG-994812"
                className="w-full bg-white border border-gray-300 text-gray-900 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@hospital.org"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0199"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Full Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Medical Center Way, Suite 100"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Register Hospital'}</span>
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-red-600 hover:underline font-bold">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegisterPage;
