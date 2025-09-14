'use client';

import React, { useState, useEffect } from 'react';
import { Patient } from '../../lib/types';
import { mockEHRService } from '../../lib/services/mockEHRService';
import { HealthcareCard } from '../../components/ui/HealthcareCard';
import { SearchInput } from '../../components/ui/SearchInput';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load initial patients
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async (query: string = "") => {
    try {
      setSearchLoading(true);
      const patientData = await mockEHRService.searchPatients(query);
      setPatients(patientData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditMode(false);
    setShowPatientModal(true);
  };

  const handleEditPatient = () => {
    setEditMode(true);
  };

  const handleSavePatient = async (patientData: Partial<Patient>) => {
    if (!selectedPatient) return;

    try {
      const updatedPatient = await mockEHRService.updatePatient(selectedPatient.id, patientData);
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
      setSelectedPatient(updatedPatient);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
                <p className="text-sm text-gray-500">Search and manage patient records</p>
              </div>
            </div>
            <StatusBadge status="active">
              System Online
            </StatusBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <HealthcareCard title="Patient Search" className="mb-8">
          <SearchInput
            placeholder="Search patients by name or ID..."
            onSearch={loadPatients}
            loading={searchLoading}
            className="w-full"
          />
        </HealthcareCard>

        {/* Patient List */}
        <HealthcareCard 
          title="Patient Records" 
          icon={<span>👥</span>}
          actions={
            <div className="text-sm text-gray-500">
              {patients.length} patient{patients.length !== 1 ? 's' : ''} found
            </div>
          }
        >
          {patients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No patients found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePatientClick(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {patient.name[0].given[0]?.[0]}{patient.name[0].family[0]}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {patient.name[0].given.join(' ')} {patient.name[0].family}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>ID: {patient.id}</span>
                            <span>Age: {calculateAge(patient.birthDate)}</span>
                            <span>Gender: {patient.gender}</span>
                            <span>DOB: {formatDate(patient.birthDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={patient.active ? "active" : "inactive"}>
                        {patient.active ? "Active" : "Inactive"}
                      </StatusBadge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </HealthcareCard>
      </main>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title={selectedPatient ? `${selectedPatient.name[0].given.join(' ')} ${selectedPatient.name[0].family}` : 'Patient Details'}
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-semibold">
                    {selectedPatient.name[0].given[0]?.[0]}{selectedPatient.name[0].family[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPatient.name[0].given.join(' ')} {selectedPatient.name[0].family}
                  </h2>
                  <p className="text-gray-500">Patient ID: {selectedPatient.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={selectedPatient.active ? "active" : "inactive"}>
                  {selectedPatient.active ? "Active" : "Inactive"}
                </StatusBadge>
                {!editMode && (
                  <Button onClick={handleEditPatient} size="sm">
                    Edit Patient
                  </Button>
                )}
              </div>
            </div>

            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demographics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Demographics</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Date of Birth:</span>
                    <span>{formatDate(selectedPatient.birthDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Age:</span>
                    <span>{calculateAge(selectedPatient.birthDate)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gender:</span>
                    <span className="capitalize">{selectedPatient.gender}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {selectedPatient.address?.[0] && (
                    <div>
                      <span className="font-medium">Address:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedPatient.address[0].line.join(', ')}<br/>
                        {selectedPatient.address[0].city}, {selectedPatient.address[0].state} {selectedPatient.address[0].postalCode}
                      </div>
                    </div>
                  )}
                  {selectedPatient.telecom?.map((contact, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium capitalize">{contact.system}:</span>  
                      <span>{contact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
                Close
              </Button>
              {editMode && (
                <>
                  <Button variant="secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSavePatient({})}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
