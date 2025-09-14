'use client';

import React, { useState } from 'react';
import { Observation, Patient } from '../../lib/types';
import { mockEHRService } from '../../lib/services/mockEHRService';
import { HealthcareCard } from '../../components/ui/HealthcareCard';
import { SearchInput } from '../../components/ui/SearchInput';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';

export default function ClinicalPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [newObservation, setNewObservation] = useState({
    type: '',
    value: '',
    notes: ''
  });

  const loadPatients = async (query: string = "") => {
    try {
      setSearchLoading(true);
      const patientData = await mockEHRService.searchPatients(query);
      setPatients(patientData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadObservations = async (patientId: string) => {
    try {
      setLoading(true);
      const observationData = await mockEHRService.getObservations(patientId);
      setObservations(observationData);
    } catch (error) {
      console.error('Error loading observations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    await loadObservations(patient.id);
  };

  const handleAddObservation = async () => {
    if (!selectedPatient || !newObservation.type || !newObservation.value) return;

    try {
      const observationData = {
        status: 'final' as const,
        code: { text: newObservation.type },
        subject: { reference: `Patient/${selectedPatient.id}` },
        effectiveDateTime: new Date().toISOString(),
        valueString: newObservation.value
      };

      await mockEHRService.createObservation(observationData);
      await loadObservations(selectedPatient.id);
      setShowObservationModal(false);
      setNewObservation({ type: '', value: '', notes: '' });
    } catch (error) {
      console.error('Error creating observation:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const observationTypes = [
    'Blood Pressure',
    'Heart Rate', 
    'Temperature',
    'Weight',
    'Height',
    'Blood Sugar',
    'Oxygen Saturation',
    'Respiratory Rate'
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Clinical Operations</h1>
                <p className="text-sm text-gray-500">Patient clinical data and vital signs management</p>
              </div>
            </div>
            <StatusBadge status="active">
              Clinical System Online
            </StatusBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <HealthcareCard title="Select Patient" icon={<span>👥</span>}>
              <div className="space-y-4">
                <SearchInput
                  placeholder="Search patients..."
                  onSearch={loadPatients}
                  loading={searchLoading}
                />
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPatient?.id === patient.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="font-medium text-gray-900">
                        {patient.name[0].given.join(' ')} {patient.name[0].family}
                      </div>
                      <div className="text-sm text-gray-500">{patient.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </HealthcareCard>
          </div>

          {/* Clinical Data */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <HealthcareCard 
                title={`Clinical Data - ${selectedPatient.name[0].given.join(' ')} ${selectedPatient.name[0].family}`}
                icon={<span>📋</span>}
                actions={
                  <Button onClick={() => setShowObservationModal(true)}>
                    Add Observation
                  </Button>
                }
              >
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : observations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No clinical observations recorded</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setShowObservationModal(true)}
                    >
                      Record First Observation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {observations.map((observation) => (
                      <div
                        key={observation.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {observation.code.text}
                          </h4>
                          <StatusBadge status="success">
                            {observation.status}
                          </StatusBadge>
                        </div>
                        <div className="text-lg font-semibold text-blue-600 mb-1">
                          {observation.valueString}
                        </div>
                        <div className="text-sm text-gray-500">
                          Recorded: {formatDateTime(observation.effectiveDateTime || '')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </HealthcareCard>
            ) : (
              <HealthcareCard title="Clinical Data" icon={<span>📋</span>}>
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🩺</div>
                  <p className="text-gray-500">Select a patient to view clinical data</p>
                </div>
              </HealthcareCard>
            )}
          </div>
        </div>
      </main>

      {/* Add Observation Modal */}
      <Modal
        isOpen={showObservationModal}
        onClose={() => setShowObservationModal(false)}
        title="Add Clinical Observation"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observation Type
            </label>
            <select
              value={newObservation.type}
              onChange={(e) => setNewObservation(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select observation type...</option>
              {observationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              value={newObservation.value}
              onChange={(e) => setNewObservation(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Enter measurement value (e.g., 120/80 mmHg, 98.6°F)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={newObservation.notes}
              onChange={(e) => setNewObservation(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional clinical notes..."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setShowObservationModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddObservation}
              disabled={!newObservation.type || !newObservation.value}
            >
              Add Observation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
