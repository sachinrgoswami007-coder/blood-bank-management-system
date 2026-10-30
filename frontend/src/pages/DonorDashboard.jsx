import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import StatCard from '../components/UI/StatCard';
import StatusBadge from '../components/UI/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, Calendar, UserCheck, History, ToggleLeft, ToggleRight, Edit2 } from 'lucide-react';

const DonorDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [donorDetails, setDonorDetails] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for Dashboard navigation button click
  useEffect(() => {
    const handleReset = (e) => {
      setActiveTab(e.detail || 'overview');
    };
    window.addEventListener('reset-dashboard-tab', handleReset);
    return () => window.removeEventListener('reset-dashboard-tab', handleReset);
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    lastDonationDate: '',
  });

  const [notification, setNotification] = useState({ type: '', message: '' });
  const { user, updateUserState } = useAuth();

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchDonorData = async () => {
    if (!user?.donorId) return;
    try {
      setLoading(true);
      const [dashRes, donorRes, donRes] = await Promise.all([
        api.get(`/dashboard/donor?donorId=${user.donorId}`),
        api.get(`/donors/${user.donorId}`),
        api.get(`/donors/${user.donorId}/donations`),
      ]);

      if (dashRes.data.success) setDashboardData(dashRes.data.data);
      if (donorRes.data.success) {
        setDonorDetails(donorRes.data.data);
        setProfileForm({
          name: donorRes.data.data.name || '',
          phone: donorRes.data.data.phone || '',
          address: donorRes.data.data.address || '',
          city: donorRes.data.data.city || '',
          lastDonationDate: donorRes.data.data.lastDonationDate || '',
        });
      }
      if (donRes.data.success) setDonations(donRes.data.data);
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!user?.donorId || !donorDetails) return;
    const newStatus =
      donorDetails.availabilityStatus === 'AVAILABLE'
        ? 'TEMPORARILY_UNAVAILABLE'
        : 'AVAILABLE';

    try {
      const res = await api.put(`/donors/${user.donorId}/availability`, {
        availabilityStatus: newStatus,
      });
      if (res.data.success) {
        showNotify('success', `Status updated to ${newStatus}`);
        fetchDonorData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.donorId) return;
    try {
      const res = await api.put(`/donors/${user.donorId}`, profileForm);
      if (res.data.success) {
        showNotify('success', 'Profile updated successfully!');
        updateUserState({ name: profileForm.name });
        fetchDonorData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-serif">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 space-y-6 overflow-x-hidden">
          {notification.message && (
            <div
              className={`p-3 rounded border text-xs font-bold ${
                notification.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <span>{notification.message}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Banner */}
              <div className="relative rounded-xl overflow-hidden h-40 sm:h-44 border border-gray-200 shadow-xs">
                <img
                  src="/assets/hero-donation.jpg"
                  alt="Donor Life Saver"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent flex items-center p-6 text-white">
                  <div className="max-w-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-red-600 px-2.5 py-0.5 rounded shadow-xs">
                      Lifesaver Recognition
                    </span>
                    <h2 className="text-xl font-bold mt-1 text-white">
                      Thank You for Giving the Gift of Life!
                    </h2>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Every single donation can save up to 3 lives. Keep your contact info and availability up to date for emergency alerts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card bg-white border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">Donor Dashboard</span>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {dashboardData?.donorName || user?.name}!
                  </h1>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">
                    Blood Group: <strong className="text-red-700">{dashboardData?.bloodGroup || donorDetails?.bloodGroup}</strong>
                  </p>
                </div>

                <button
                  onClick={handleToggleAvailability}
                  className={`btn text-xs ${
                    donorDetails?.availabilityStatus === 'AVAILABLE'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {donorDetails?.availabilityStatus === 'AVAILABLE' ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                  <span>Status: {donorDetails?.availabilityStatus?.replace('_', ' ')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Donations" value={dashboardData?.donationCount ?? 0} icon={Heart} />
                <StatCard title="Last Donation Date" value={dashboardData?.lastDonationDate || 'Not Recorded'} icon={Calendar} />
                <StatCard title="Availability" value={donorDetails?.availabilityStatus?.replace('_', ' ') || 'AVAILABLE'} icon={UserCheck} />
              </div>

              <div className="card">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-red-600" />
                  Recent Donation Log
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Blood Group</th>
                        <th className="py-2.5 px-3">Units</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashboardData?.recentDonations?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-4 text-center text-gray-500">
                            No donation history found.
                          </td>
                        </tr>
                      ) : (
                        dashboardData?.recentDonations?.map((don) => (
                          <tr key={don.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-bold text-gray-900">{don.donationDate}</td>
                            <td className="py-2.5 px-3 font-bold text-red-700">{don.bloodGroup}</td>
                            <td className="py-2.5 px-3">{don.units} Unit</td>
                            <td className="py-2.5 px-3">{don.location}</td>
                            <td className="py-2.5 px-3">
                              <StatusBadge status={don.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Donor Profile</h1>
                <p className="text-xs text-gray-500">Update your details</p>
              </div>

              <div className="card max-w-xl">
                <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Last Donation Date</label>
                    <input
                      type="date"
                      value={profileForm.lastDonationDate || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, lastDonationDate: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="w-full btn-primary py-2">
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
                <p className="text-xs text-gray-500">Historical donation logs</p>
              </div>

              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Donation ID</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Blood Group</th>
                      <th className="py-2.5 px-3">Units</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-500">
                          No donation records found.
                        </td>
                      </tr>
                    ) : (
                      donations.map((don) => (
                        <tr key={don.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-mono">#DON-{don.id}</td>
                          <td className="py-2.5 px-3 font-bold text-gray-900">{don.donationDate}</td>
                          <td className="py-2.5 px-3 font-bold text-red-700">{don.bloodGroup}</td>
                          <td className="py-2.5 px-3">{don.units} Unit</td>
                          <td className="py-2.5 px-3">{don.location}</td>
                          <td className="py-2.5 px-3">
                            <StatusBadge status={don.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;
