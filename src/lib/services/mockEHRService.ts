import { Patient, Appointment, Observation } from '../types';

export class MockEHRService {
  private mockPatients: Patient[] = [
    {
      id: "patient-001",
      name: [{ family: "Johnson", given: ["Sarah", "Marie"] }],
      gender: "female",
      birthDate: "1985-03-15",
      active: true,
      address: [{
        use: "home",
        type: "physical",
        line: ["123 Main Street", "Apt 4B"],
        city: "Boston",
        state: "MA",
        postalCode: "02101",
        country: "US"
      }],
      telecom: [
        { system: "phone", value: "(555) 123-4567", use: "home" },
        { system: "email", value: "sarah.johnson@email.com", use: "home" }
      ]
    },
    {
      id: "patient-002", 
      name: [{ family: "Chen", given: ["Michael", "David"] }],
      gender: "male",
      birthDate: "1978-11-22",
      active: true,
      address: [{
        use: "home",
        type: "physical",
        line: ["456 Oak Avenue"],
        city: "Cambridge",
        state: "MA", 
        postalCode: "02138",
        country: "US"
      }],
      telecom: [
        { system: "phone", value: "(555) 987-6543", use: "mobile" },
        { system: "email", value: "michael.chen@email.com", use: "work" }
      ]
    },
    {
      id: "patient-003",
      name: [{ family: "Rodriguez", given: ["Maria", "Elena"] }],
      gender: "female", 
      birthDate: "1992-07-08",
      active: true,
      address: [{
        use: "home",
        type: "physical",
        line: ["789 Elm Street"],
        city: "Somerville",
        state: "MA",
        postalCode: "02143", 
        country: "US"
      }],
      telecom: [
        { system: "phone", value: "(555) 456-7890", use: "home" },
        { system: "email", value: "maria.rodriguez@email.com", use: "home" }
      ]
    }
  ];

  private mockAppointments: Appointment[] = [
    {
      id: "appointment-001",
      status: "booked",
      start: "2025-09-15T10:00:00Z",
      end: "2025-09-15T10:30:00Z",
      participant: [{
        actor: { reference: "Patient/patient-001", display: "Sarah Johnson" },
        required: "required",
        status: "accepted"
      }],
    },
    {
      id: "appointment-002", 
      status: "pending",
      start: "2025-09-16T14:00:00Z",
      end: "2025-09-16T14:45:00Z",
      participant: [{
        actor: { reference: "Patient/patient-002", display: "Michael Chen" },
        required: "required", 
        status: "needs-action"
      }],
    },
    {
      id: "appointment-003",
      status: "arrived",
      start: "2025-09-14T09:15:00Z", 
      end: "2025-09-14T10:00:00Z",
      participant: [{
        actor: { reference: "Patient/patient-003", display: "Maria Rodriguez" },
        required: "required",
        status: "accepted" 
      }],
    }
  ];

  private mockObservations: Observation[] = [
    {
      id: "observation-001",
      status: "final",
      code: { text: "Blood Pressure" },
      subject: { reference: "Patient/patient-001" },
      effectiveDateTime: "2025-09-14T10:30:00Z",
      valueString: "120/80 mmHg"
    },
    {
      id: "observation-002",
      status: "final", 
      code: { text: "Heart Rate" },
      subject: { reference: "Patient/patient-001" },
      effectiveDateTime: "2025-09-14T10:30:00Z",
      valueString: "72 bpm"
    },
    {
      id: "observation-003",
      status: "final",
      code: { text: "Weight" },
      subject: { reference: "Patient/patient-002" },
      effectiveDateTime: "2025-09-13T15:00:00Z", 
      valueString: "75 kg"
    }
  ];

  // Simulate network delay
  private delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Patient Management APIs
  async searchPatients(query: string = ""): Promise<Patient[]> {
    await this.delay();
    
    if (!query.trim()) return this.mockPatients;
    
    const searchTerm = query.toLowerCase();
    return this.mockPatients.filter(patient => 
      patient.name[0].family.toLowerCase().includes(searchTerm) ||
      patient.name[0].given.join(" ").toLowerCase().includes(searchTerm) ||
      patient.id.includes(searchTerm)
    );
  }

  async getPatientById(id: string): Promise<Patient> {
    await this.delay();
    
    const patient = this.mockPatients.find(p => p.id === id);
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    await this.delay();
    
    const patientIndex = this.mockPatients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    
    this.mockPatients[patientIndex] = { ...this.mockPatients[patientIndex], ...patientData };
    return this.mockPatients[patientIndex];
  }

  async createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
    await this.delay();
    
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`,
    };
    
    this.mockPatients.push(newPatient);
    return newPatient;
  }

  // Appointment Management APIs
  async searchAppointments(patientId?: string, date?: string): Promise<Appointment[]> {
    await this.delay();
    
    let appointments = this.mockAppointments;
    
    if (patientId) {
      appointments = appointments.filter(apt => 
        apt.participant.some(p => p.actor?.reference?.includes(patientId))
      );
    }
    
    if (date) {
      const filterDate = new Date(date).toDateString();
      appointments = appointments.filter(apt => {
        const aptDate = new Date(apt.start).toDateString();
        return aptDate === filterDate;
      });
    }
    
    return appointments;
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    await this.delay();
    
    const appointment = this.mockAppointments.find(a => a.id === id);
    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> {
    await this.delay();
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `appointment-${Date.now()}`,
    };
    
    this.mockAppointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    await this.delay();
    
    const appointmentIndex = this.mockAppointments.findIndex(a => a.id === id);
    if (appointmentIndex === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    
    this.mockAppointments[appointmentIndex] = { ...this.mockAppointments[appointmentIndex], ...appointmentData };
    return this.mockAppointments[appointmentIndex];
  }

  // Clinical Operations APIs
  async getObservations(patientId: string): Promise<Observation[]> {
    await this.delay();
    
    return this.mockObservations.filter(obs => 
      obs.subject?.reference?.includes(patientId)
    );
  }

  async createObservation(observationData: Omit<Observation, 'id'>): Promise<Observation> {
    await this.delay();
    
    const newObservation: Observation = {
      ...observationData,
      id: `observation-${Date.now()}`,
    };
    
    this.mockObservations.push(newObservation);
    return newObservation;
  }

  // System Health Check
  async checkConnection(): Promise<boolean> {
    await this.delay(300);
    return true; // Mock service is always "connected"
  }
}

// Export singleton instance
export const mockEHRService = new MockEHRService();
