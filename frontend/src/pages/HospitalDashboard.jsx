import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import StatCard from '../components/UI/StatCard';
import StatusBadge from '../components/UI/StatusBadge';
import Modal from '../components/UI/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  PlusCircle,
  Activity,
  Clock,
  CheckCircle2,
  CheckCheck,
  AlertTriangle,
  Package
} from 'lucide-react';

const HospitalDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [hospitalInfo, setHospitalInfo] = useState(null);
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

  // New Request Form state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    bloodGroup: 'O+',
    requiredUnits: 2,
    urgency: 'NORMAL',
    requiredDate: new Date().toISOString().split('T')[0],
    reason: '',
    notes: '',
  });

  const [notification, setNotification] = useState({ type: '', message: '' });
  const { user } = useAuth();

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchHospitalData = async () => {
    if (!user?.hospitalId) return;
    try {
      setLoading(true);
      const [dashRes, hospRes, reqRes] = await Promise.all([
        api.get(`/dashboard/hospital?hospitalId=${user.hospitalId}`),
        api.get(`/hospitals/${user.hospitalId}`),
        api.get(`/requests/hospital/${user.hospitalId}`),
      ]);

      if (dashRes.data.success) setDashboardData(dashRes.data.data);
      if (hospRes.data.success) setHospitalInfo(hospRes.data.data);
      if (reqRes.data.success) setRequests(reqRes.data.data);
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, [user]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/requests', requestForm);
      if (res.data.success) {
        showNotify('success', 'Blood request submitted successfully!');
        setIsRequestModalOpen(false);
        setRequestForm({
          bloodGroup: 'O+',
          requiredUnits: 2,
          urgency: 'NORMAL',
          requiredDate: new Date().toISOString().split('T')[0],
          reason: '',
          notes: '',
        });
        fetchHospitalData();
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
                  src="/assets/doctor-care.jpg"
                  alt="Hospital Care Network"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent flex items-center p-6 text-white">
                  <div className="max-w-md">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-600 px-2.5 py-0.5 rounded shadow-xs">
                      Emergency Dispatch Ready
                    </span>
                    <h2 className="text-xl font-bold mt-1 text-white">
                      Hospital Critical Care Portal
                    </h2>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Submit emergency requests, track approval statuses, and verify real-time blood group availability across our regional bank.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card bg-white border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">Medical Institution</span>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {hospitalInfo?.hospitalName || user?.name}
                  </h1>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    License Number: <span className="font-mono font-bold text-gray-900">{hospitalInfo?.registrationNumber}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={hospitalInfo?.approvalStatus} />
                  {hospitalInfo?.approvalStatus === 'APPROVED' && (
                    <button
                      onClick={() => setIsRequestModalOpen(true)}
                      className="btn-primary text-xs"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Request Blood
                    </button>
                  )}
                </div>
              </div>

              {hospitalInfo?.approvalStatus !== 'APPROVED' && (
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Your hospital account is currently <strong>{hospitalInfo?.approvalStatus}</strong>. You will be able to submit emergency requests once approved by Admin.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Requests" value={dashboardData?.totalRequests ?? 0} icon={Activity} />
                <StatCard title="Pending" value={dashboardData?.pendingRequests ?? 0} icon={Clock} />
                <StatCard title="Approved" value={dashboardData?.approvedRequests ?? 0} icon={CheckCircle2} />
                <StatCard title="Fulfilled" value={dashboardData?.fulfilledRequests ?? 0} icon={CheckCheck} />
              </div>

              <div className="card">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-sky-600" />
                  Live Available Inventory Units
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {dashboardData?.bloodGroupAvailability?.map((item) => (
                    <div key={item.bloodGroup} className="p-3 rounded bg-gray-50 border border-gray-200 text-center">
                      <span className="text-xs font-bold text-red-700 block">{item.bloodGroup}</span>
                      <p className="text-xl font-bold text-gray-900 mt-0.5">{item.availableUnits}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase">Units Available</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUEST BLOOD FORM */}
          {activeTab === 'new-request' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Submit Blood Request</h1>
                <p className="text-xs text-gray-500">Specify requirements and urgency</p>
              </div>

              {hospitalInfo?.approvalStatus !== 'APPROVED' ? (
                <div className="p-4 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  Only APPROVED hospital accounts can submit blood requests.
                </div>
              ) : (
                <div className="card max-w-xl">
                  <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                        <select
                          value={requestForm.bloodGroup}
                          onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                          className="w-full"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Required Units</label>
                        <input
                          type="number"
                          min="1"
                          value={requestForm.requiredUnits}
                          onChange={(e) => setRequestForm({ ...requestForm, requiredUnits: parseInt(e.target.value) || 1 })}
                          className="w-full"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Urgency</label>
                        <select
                          value={requestForm.urgency}
                          onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                          className="w-full"
                        >
                          <option value="NORMAL">NORMAL</option>
                          <option value="URGENT">URGENT</option>
                          <option value="EMERGENCY">EMERGENCY</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Required Date</label>
                        <input
                          type="date"
                          value={requestForm.requiredDate}
                          onChange={(e) => setRequestForm({ ...requestForm, requiredDate: e.target.value })}
                          className="w-full"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Reason</label>
                      <input
                        type="text"
                        value={requestForm.reason}
                        onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                        placeholder="e.g. Surgery or Trauma Care"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="w-full btn-primary py-2">
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACKING */}
          {activeTab === 'my-requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Request Tracking</h1>
                  <p className="text-xs text-gray-500">Track request status and admin remarks</p>
                </div>

                {hospitalInfo?.approvalStatus === 'APPROVED' && (
                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="btn-primary text-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Request
                  </button>
                )}
              </div>

              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Request ID</th>
                      <th className="py-2.5 px-3">Group</th>
                      <th className="py-2.5 px-3">Units</th>
                      <th className="py-2.5 px-3">Urgency</th>
                      <th className="py-2.5 px-3">Required Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Admin Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-6 text-center text-gray-500">
                          No requests submitted.
                        </td>
                      </tr>
                    ) : (
                      requests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-mono">#REQ-{req.id}</td>
                          <td className="py-2.5 px-3 font-bold text-red-700">{req.bloodGroup}</td>
                          <td className="py-2.5 px-3 font-bold text-gray-900">{req.requiredUnits} Units</td>
                          <td className="py-2.5 px-3">
                            <StatusBadge status={req.urgency} />
                          </td>
                          <td className="py-2.5 px-3">{req.requiredDate}</td>
                          <td className="py-2.5 px-3">
                            <StatusBadge status={req.status} />
                          </td>
                          <td className="py-2.5 px-3 text-gray-500 italic">
                            {req.adminRemarks || 'None'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Request Modal */}
          <Modal
            isOpen={isRequestModalOpen}
            onClose={() => setIsRequestModalOpen(false)}
            title="Create Blood Request"
          >
            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={requestForm.bloodGroup}
                    onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                    className="w-full"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Units</label>
                  <input
                    type="number"
                    min="1"
                    value={requestForm.requiredUnits}
                    onChange={(e) => setRequestForm({ ...requestForm, requiredUnits: parseInt(e.target.value) || 1 })}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Urgency</label>
                <select
                  value={requestForm.urgency}
                  onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                  className="w-full"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="URGENT">URGENT</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Required Date</label>
                <input
                  type="date"
                  value={requestForm.requiredDate}
                  onChange={(e) => setRequestForm({ ...requestForm, requiredDate: e.target.value })}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  placeholder="e.g. Surgery or Trauma Care"
                  className="w-full"
                  required
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn-primary py-2">
                  Submit Request
                </button>
              </div>
            </form>
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default HospitalDashboard;
