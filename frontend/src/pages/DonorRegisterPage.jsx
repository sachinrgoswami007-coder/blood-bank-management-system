import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, UserPlus, AlertCircle } from 'lucide-react';

const DonorRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '1998-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    city: '',
    lastDonationDate: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerDonor } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        lastDonationDate: formData.lastDonationDate || null,
      };
      await registerDonor(payload);
      navigate('/donor');
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
              src="/assets/hero-donation.jpg"
              alt="Donor Community"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent flex items-center p-6 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-red-600 px-2.5 py-0.5 rounded shadow-xs">
                  Save Up to 3 Lives
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                  Join Lifeline's Voluntary Donor Network
                </h3>
                <p className="text-xs text-gray-200 max-w-md mt-1 leading-relaxed">
                  Join thousands of verified donors ready to support urgent hospital needs and medical emergencies.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Donor Registration</h2>
              <p className="text-xs text-gray-500 font-medium">Join our community of voluntary blood donors</p>
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
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
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
              <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0000"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 text-gray-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 text-gray-900"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
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
              <label className="block font-bold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full bg-white border border-gray-300 text-gray-900"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Last Donation Date (Optional)
              </label>
              <input
                type="date"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? 'Registering...' : 'Register as Donor'}</span>
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

export default DonorRegisterPage;
