/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { HealthcareCard } from '../components/ui/HealthcareCard';
import { StatusBadge } from '../components/ui/StatusBadge';
// If the Button component exists elsewhere, update the path accordingly, for example:
import { Button } from '../components/ui/Button';
// OR, if the file is missing, create it as shown below.
import { mockEHRService } from '../lib/services/mockEHRService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingTasks: 0,
    systemStatus: 'checking' as 'active' | 'error' | 'checking'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Load dashboard stats
    loadDashboardStats();

    return () => clearInterval(timer);
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Simulate loading stats from mock service
      const patients = await mockEHRService.searchPatients();
      const appointments = await mockEHRService.searchAppointments();
      const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.start).toDateString();
        const today = new Date().toDateString();
        return aptDate === today;
      });

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        pendingTasks: appointments.filter(apt => apt.status === 'pending').length,
        systemStatus: 'active'
      });
    } catch (error) {
      setStats(prev => ({ ...prev, systemStatus: 'error' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🏥</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  EHR Integration Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Electronic Health Records Management System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <StatusBadge status={stats.systemStatus}>
                {stats.systemStatus === 'checking' ? 'Connecting...' : 
                 stats.systemStatus === 'active' ? 'System Online' : 'System Error'}
              </StatusBadge>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <HealthcareCard 
            title="Total Patients" 
            icon={<span className="text-2xl">👥</span>}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalPatients}
            </div>
            <p className="text-sm text-gray-500 mt-1">Registered in system</p>
          </HealthcareCard>

          <HealthcareCard 
            title="Today's Appointments" 
            icon={<span className="text-2xl">📅</span>}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl font-bold text-green-600">
              {stats.todayAppointments}
            </div>
            <p className="text-sm text-gray-500 mt-1">Scheduled for today</p>
          </HealthcareCard>

          <HealthcareCard 
            title="Pending Tasks" 
            icon={<span className="text-2xl">⚡</span>}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl font-bold text-orange-600">
              {stats.pendingTasks}
            </div>
            <p className="text-sm text-gray-500 mt-1">Require attention</p>
          </HealthcareCard>
        </div>

        {/* Quick Actions */}
        <HealthcareCard title="Quick Actions" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex-col space-y-2" 
              onClick={() => window.location.href = '/patients'}
            >
              <span className="text-2xl">🔍</span>
              <span>Patient Management</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-20 flex-col space-y-2" 
              onClick={() => window.location.href = '/appointments'}
            >
              <span className="text-2xl">📅</span>
              <span>Appointments</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-20 flex-col space-y-2" 
              onClick={() => window.location.href = '/clinical'}
            >
              <span className="text-2xl">🩺</span>
              <span>Clinical Operations</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-20 flex-col space-y-2"
            >
              <span className="text-2xl">📊</span>
              <span>Reports</span>
            </Button>
          </div>
        </HealthcareCard>

        {/* Recent Activity */}
        <HealthcareCard title="Recent Activity">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Patient record updated</p>
                  <p className="text-xs text-gray-500">Sarah Johnson - Contact information updated</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">📅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
                  <p className="text-xs text-gray-500">Michael Chen - Tomorrow 2:00 PM</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">🩺</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Clinical observation recorded</p>
                  <p className="text-xs text-gray-500">Maria Rodriguez - Blood pressure reading</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">12 min ago</span>
            </div>
          </div>
        </HealthcareCard>
      </main>
    </div>
  );
}
