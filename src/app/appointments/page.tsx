/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '../../lib/types';
import { mockEHRService } from '../../lib/services/mockEHRService';
import { HealthcareCard } from '../../components/ui/HealthcareCard';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const appointmentData = await mockEHRService.searchAppointments(undefined, selectedDate);
      setAppointments(appointmentData);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'success';
      case 'pending': return 'warning';
      case 'arrived': return 'active';
      case 'cancelled': return 'error';
      default: return 'inactive';
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const updatedAppointment = await mockEHRService.updateAppointment(appointmentId, { 
        status: newStatus as any 
      });
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? updatedAppointment : apt
      ));
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment(updatedAppointment);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => window.history.back()}
                className="mr-4"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
                <p className="text-sm text-gray-500">Manage patient appointments and schedules</p>
              </div>
            </div>
            <StatusBadge status="active">
              Scheduling Online
            </StatusBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selector */}
        <HealthcareCard title="Schedule View" className="mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadAppointments} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </HealthcareCard>

        {/* Appointments List */}
        <HealthcareCard 
          title={`Appointments for ${formatDate(selectedDate)}`}
          icon={<span>📅</span>}
          actions={
            <div className="text-sm text-gray-500">
              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
            </div>
          }
        >
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No appointments scheduled for this date</p>
              <Button className="mt-4" onClick={() => {}}>
                Schedule New Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="text-2xl">
                            {appointment.status === 'booked' ? '📅' : 
                             appointment.status === 'arrived' ? '🏥' : 
                             appointment.status === 'pending' ? '⏰' : '❌'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {appointment.participant[0]?.actor?.display || 'Unknown Patient'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>⏰ {formatTime(appointment.start)} - {formatTime(appointment.end)}</span>
                            <span>📋 { 'No description'}</span>
                            <span>ID: {appointment.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={getStatusColor(appointment.status) as any}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </StatusBadge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </HealthcareCard>
      </main>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Appointment Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedAppointment.participant[0]?.actor?.display || 'Unknown Patient'}
                </h2>
                <p className="text-gray-500">Appointment ID: {selectedAppointment.id}</p>
              </div>
              <StatusBadge status={getStatusColor(selectedAppointment.status) as any}>
                {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
              </StatusBadge>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(selectedAppointment.start)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Start Time:</span>
                    <span>{formatTime(selectedAppointment.start)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">End Time:</span>
                    <span>{formatTime(selectedAppointment.end)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>
                      {Math.round((new Date(selectedAppointment.end).getTime() - new Date(selectedAppointment.start).getTime()) / (1000 * 60))} minutes
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {'No description provided'}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Patient Status:</span>
                    <span>{selectedAppointment.participant[0]?.status || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Status Management</h3>
              <div className="flex flex-wrap gap-2">
                {['pending', 'booked', 'arrived', 'fulfilled', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedAppointment.status === status ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate(selectedAppointment.id, status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
                Close
              </Button>
              <Button variant="outline">
                Reschedule
              </Button>
              <Button>
                Update Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
