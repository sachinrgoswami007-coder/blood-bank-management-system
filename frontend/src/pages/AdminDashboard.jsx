import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import StatCard from '../components/UI/StatCard';
import StatusBadge from '../components/UI/StatusBadge';
import Modal from '../components/UI/Modal';
import api from '../services/api';
import {
  Users,
  Building2,
  Package,
  Clock,
  CheckCircle2,
  CheckCheck,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  X,
  AlertTriangle,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
  const [data, setData] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
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

  // Filters & Search
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState('');
  const [hospitalStatusFilter, setHospitalStatusFilter] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('');

  // Modals state
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({ bloodGroup: 'O+', units: 5, collectionDate: new Date().toISOString().split('T')[0] });
  const [actionRemark, setActionRemark] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestActionType, setRequestActionType] = useState(null); // 'approve' | 'reject' | 'fulfill'

  const [notification, setNotification] = useState({ type: '', message: '' });

  const bloodGroupsList = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, hospRes, donorRes, invRes, reqRes] = await Promise.all([
        api.get('/dashboard/admin'),
        api.get('/hospitals'),
        api.get('/donors'),
        api.get('/inventory'),
        api.get('/requests'),
      ]);

      if (dashRes.data.success) setData(dashRes.data.data);
      if (hospRes.data.success) setHospitals(hospRes.data.data);
      if (donorRes.data.success) setDonors(donorRes.data.data);
      if (invRes.data.success) setInventory(invRes.data.data);
      if (reqRes.data.success) setRequests(reqRes.data.data);
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Hospital Handlers
  const handleApproveHospital = async (id) => {
    try {
      const res = await api.put(`/hospitals/${id}/approve`);
      if (res.data.success) {
        showNotify('success', 'Hospital approved successfully!');
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  const handleRejectHospital = async (id) => {
    try {
      const res = await api.put(`/hospitals/${id}/reject`);
      if (res.data.success) {
        showNotify('success', 'Hospital registration rejected');
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  const handleToggleHospital = async (id) => {
    try {
      const res = await api.put(`/hospitals/${id}/toggle-status`);
      if (res.data.success) {
        showNotify('success', res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  // Donor Handlers
  const handleToggleDonor = async (id) => {
    try {
      const res = await api.put(`/donors/${id}/toggle-status`);
      if (res.data.success) {
        showNotify('success', res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  // Inventory Handlers
  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/inventory', newBatch);
      if (res.data.success) {
        showNotify('success', 'Blood batch added to inventory!');
        setIsAddInventoryOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  const handleDeleteInventory = async (id) => {
    if (!window.confirm('Are you sure you want to remove this blood batch?')) return;
    try {
      const res = await api.delete(`/inventory/${id}`);
      if (res.data.success) {
        showNotify('success', 'Inventory batch deleted');
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  // Request Handlers
  const handleProcessRequest = async () => {
    if (!selectedRequest || !requestActionType) return;
    try {
      const url = `/requests/${selectedRequest.id}/${requestActionType}`;
      const res = await api.put(url, { adminRemarks: actionRemark });
      if (res.data.success) {
        showNotify('success', res.data.message);
        setSelectedRequest(null);
        setRequestActionType(null);
        setActionRemark('');
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  // Filtered Donors
  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.city.toLowerCase().includes(donorSearch.toLowerCase());
    const matchesGroup = !donorGroupFilter || d.bloodGroup === donorGroupFilter;
    return matchesSearch && matchesGroup;
  });

  // Filtered Hospitals
  const filteredHospitals = hospitals.filter((h) => {
    return !hospitalStatusFilter || h.approvalStatus === hospitalStatusFilter;
  });

  // Filtered Requests
  const filteredRequests = requests.filter((r) => {
    return !requestStatusFilter || r.status === requestStatusFilter;
  });

  // Emergency Triage Requests (Urgent & Emergency)
  const emergencyRequests = requests.filter(r => (r.urgency === 'EMERGENCY' || r.urgency === 'URGENT') && r.status !== 'FULFILLED');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-serif">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 space-y-6 overflow-x-hidden animate-fade-in">
          {/* Notification Banner */}
          {notification.message && (
            <div
              className={`p-3 rounded border text-xs font-bold flex items-center justify-between animate-fade-in ${
                notification.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <span>{notification.message}</span>
              <button onClick={() => setNotification({ type: '', message: '' })}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Banner */}
              <div className="relative rounded-xl overflow-hidden h-36 sm:h-40 border border-gray-200 shadow-xs">
                <img
                  src="/assets/hero-donation.jpg"
                  alt="Lifeline Blood Management"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent flex items-center p-6 text-white">
                  <div className="max-w-xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-red-600 px-2.5 py-0.5 rounded shadow-xs">
                      System Command Center
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                      Regional Blood Bank Network Administration
                    </h2>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Live coordination between voluntary donor registries, verified clinical hospitals, and cold-chain inventory supplies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
                  <p className="text-xs text-gray-500 font-medium">Real-time statistics & system metrics</p>
                </div>
                <button
                  onClick={fetchAdminData}
                  className="btn-secondary text-xs active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Donors" value={data?.totalDonors ?? 0} icon={Users} />
                <StatCard title="Total Hospitals" value={data?.totalHospitals ?? 0} icon={Building2} />
                <StatCard title="Available Blood Units" value={data?.availableBloodUnits ?? 0} icon={Package} subtitle="Non-expired units" />
                <StatCard title="Pending Requests" value={data?.pendingRequests ?? 0} icon={Clock} />
                <StatCard title="Approved Requests" value={data?.approvedRequests ?? 0} icon={CheckCircle2} />
                <StatCard title="Fulfilled Requests" value={data?.fulfilledRequests ?? 0} icon={CheckCheck} />
              </div>

              {/* NEW UI FEATURE: Emergency Request Triage Panel */}
              {emergencyRequests.length > 0 && (
                <div className="card bg-red-50/50 border border-red-200 p-4">
                  <div className="flex items-center justify-between mb-3 border-b border-red-200 pb-2">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Emergency Triage Queue ({emergencyRequests.length})</h3>
                    </div>
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                      HIGH PRIORITY
                    </span>
                  </div>

                  <div className="space-y-2">
                    {emergencyRequests.map((req) => (
                      <div key={req.id} className="p-3 bg-white border border-gray-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                        <div>
                          <span className="font-bold text-gray-900">#REQ-{req.id} • {req.hospitalName}</span>
                          <p className="text-gray-600 mt-0.5">
                            Group: <strong className="text-red-700">{req.bloodGroup}</strong> ({req.requiredUnits} Units) • Needed By: {req.requiredDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={req.urgency} />
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setRequestActionType(req.status === 'PENDING' ? 'approve' : 'fulfill');
                            }}
                            className="btn-primary text-xs py-1 px-3"
                          >
                            Action
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blood Group Breakdown */}
              <div className="card">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-600" />
                  Blood Inventory & Donor Breakdown
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {data?.bloodGroupStats?.map((stat) => (
                    <div key={stat.bloodGroup} className="p-3 rounded bg-gray-50 border border-gray-200 text-center hover:border-gray-300 transition-all">
                      <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold mb-1">
                        {stat.bloodGroup}
                      </span>
                      <p className="text-xl font-bold text-gray-900">{stat.availableUnits} <span className="text-xs font-normal text-gray-500">units</span></p>
                      <p className="text-[11px] text-gray-500">{stat.donorCount} Donors</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOSPITALS */}
          {activeTab === 'hospitals' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Hospital Approvals & Management</h1>
                  <p className="text-xs text-gray-500">Review registrations and update statuses</p>
                </div>

                <select
                  value={hospitalStatusFilter}
                  onChange={(e) => setHospitalStatusFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-xs font-bold text-gray-700"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                    <tr>
                      <th className="py-3 px-4">Hospital Name</th>
                      <th className="py-3 px-4">Reg Number</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHospitals.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-500">
                          No hospitals found.
                        </td>
                      </tr>
                    ) : (
                      filteredHospitals.map((h) => (
                        <tr key={h.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {h.hospitalName}
                            <div className="text-[11px] text-gray-500 font-normal">{h.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono">{h.registrationNumber}</td>
                          <td className="py-3 px-4">{h.phone}</td>
                          <td className="py-3 px-4">{h.city}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={h.approvalStatus} />
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {h.approvalStatus === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApproveHospital(h.id)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold active:scale-95"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectHospital(h.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold active:scale-95"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleToggleHospital(h.id)}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-[11px] font-bold active:scale-95"
                            >
                              {h.enabled ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DONORS */}
          {activeTab === 'donors' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
                  <p className="text-xs text-gray-500">Search registered donors</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search name or city..."
                      value={donorSearch}
                      onChange={(e) => setDonorSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-900"
                    />
                  </div>

                  <select
                    value={donorGroupFilter}
                    onChange={(e) => setDonorGroupFilter(e.target.value)}
                    className="bg-white border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroupsList.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                    <tr>
                      <th className="py-3 px-4">Donor Name</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Availability</th>
                      <th className="py-3 px-4">Donations</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDonors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-500">
                          No donors found.
                        </td>
                      </tr>
                    ) : (
                      filteredDonors.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {d.name}
                            <div className="text-[11px] text-gray-500 font-normal">{d.email} • {d.phone}</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-red-700">{d.bloodGroup}</td>
                          <td className="py-3 px-4">{d.city}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={d.availabilityStatus} />
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">{d.donationCount}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleToggleDonor(d.id)}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-[11px] font-bold active:scale-95"
                            >
                              {d.enabled ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Cold-Chain Vault Visual Banner */}
              <div className="relative rounded-xl overflow-hidden h-36 border border-gray-200 shadow-xs">
                <img
                  src="/assets/blood-lab.jpg"
                  alt="Blood Bank Vault"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent flex items-center p-6 text-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-600 px-2.5 py-0.5 rounded shadow-xs">
                      Automated Cold-Chain Vault
                    </span>
                    <h3 className="text-lg font-bold mt-1 text-white">
                      Central Blood Bank Stock & Quality Control
                    </h3>
                    <p className="text-xs text-gray-200 max-w-lg mt-0.5 leading-relaxed">
                      Real-time tracking of collection dates, 42-day automatic shelf-life expiry audits, and FIFO dispatch allocation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Blood Inventory</h1>
                  <p className="text-xs text-gray-500">Manage collected batches</p>
                </div>

                <button
                  onClick={() => setIsAddInventoryOpen(true)}
                  className="btn-primary text-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Blood Batch
                </button>
              </div>

              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                    <tr>
                      <th className="py-3 px-4">Batch ID</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">Units</th>
                      <th className="py-3 px-4">Collection Date</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-6 text-center text-gray-500">
                          No blood batches found.
                        </td>
                      </tr>
                    ) : (
                      inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono">#BATCH-{item.id}</td>
                          <td className="py-3 px-4 font-bold text-red-700">{item.bloodGroup}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{item.units} Units</td>
                          <td className="py-3 px-4">{item.collectionDate}</td>
                          <td className="py-3 px-4">{item.expiryDate}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteInventory(item.id)}
                              className="p-1 rounded text-red-600 hover:bg-red-50 active:scale-90"
                              title="Delete Batch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Hospital Requests</h1>
                  <p className="text-xs text-gray-500">Process blood requests</p>
                </div>

                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-xs font-bold text-gray-700"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="FULFILLED">FULFILLED</option>
                </select>
              </div>

              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase">
                    <tr>
                      <th className="py-3 px-4">Request Details</th>
                      <th className="py-3 px-4">Hospital</th>
                      <th className="py-3 px-4">Group & Units</th>
                      <th className="py-3 px-4">Urgency</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-500">
                          No requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            #REQ-{req.id}
                            <div className="text-[11px] text-gray-500 font-normal">Date: {req.requiredDate}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{req.hospitalName}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-red-700 mr-1">{req.bloodGroup}</span>
                            <span>({req.requiredUnits} Units)</span>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={req.urgency} />
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={req.status} />
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {req.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setRequestActionType('approve');
                                  }}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold active:scale-95"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setRequestActionType('reject');
                                  }}
                                  className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-bold active:scale-95"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {(req.status === 'APPROVED' || req.status === 'PENDING') && (
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setRequestActionType('fulfill');
                                }}
                                className="px-2 py-1 bg-red-700 text-white rounded text-[11px] font-bold active:scale-95"
                              >
                                Fulfill
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Inventory Modal */}
          <Modal
            isOpen={isAddInventoryOpen}
            onClose={() => setIsAddInventoryOpen(false)}
            title="Add Blood Batch"
          >
            <form onSubmit={handleAddInventory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                <select
                  value={newBatch.bloodGroup}
                  onChange={(e) => setNewBatch({ ...newBatch, bloodGroup: e.target.value })}
                  className="w-full"
                >
                  {bloodGroupsList.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Units</label>
                <input
                  type="number"
                  min="1"
                  value={newBatch.units}
                  onChange={(e) => setNewBatch({ ...newBatch, units: parseInt(e.target.value) || 1 })}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Collection Date</label>
                <input
                  type="date"
                  value={newBatch.collectionDate}
                  onChange={(e) => setNewBatch({ ...newBatch, collectionDate: e.target.value })}
                  className="w-full"
                  required
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn-primary py-2 active:scale-95">
                  Save Inventory Batch
                </button>
              </div>
            </form>
          </Modal>

          {/* Request Action Modal */}
          <Modal
            isOpen={!!selectedRequest}
            onClose={() => {
              setSelectedRequest(null);
              setRequestActionType(null);
            }}
            title={`${requestActionType?.toUpperCase()} Request #${selectedRequest?.id}`}
          >
            {selectedRequest && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                  <p><strong className="text-gray-900">Hospital:</strong> {selectedRequest.hospitalName}</p>
                  <p><strong className="text-gray-900">Group:</strong> {selectedRequest.bloodGroup} ({selectedRequest.requiredUnits} Units)</p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Admin Remarks</label>
                  <textarea
                    rows="2"
                    value={actionRemark}
                    onChange={(e) => setActionRemark(e.target.value)}
                    placeholder="Optional remarks..."
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setRequestActionType(null);
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessRequest}
                    className={`flex-1 py-2 font-bold text-white rounded active:scale-95 ${
                      requestActionType === 'reject' ? 'bg-red-700' : 'bg-emerald-600'
                    }`}
                  >
                    Confirm {requestActionType?.toUpperCase()}
                  </button>
                </div>
              </div>
            )}
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
