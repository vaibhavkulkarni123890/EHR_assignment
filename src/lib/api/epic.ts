/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { 
  Patient, 
  Appointment, 
  Observation, 
  Bundle, 
  AuthToken, 
  APIError, 
  SearchParams 
} from '../types';

// Define types for better compatibility
interface AxiosRequestConfig {
  headers?: any;
  [key: string]: any;
}

interface AxiosError extends Error {
  config?: AxiosRequestConfig;
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
  request?: any;
  isAxiosError: boolean;
}

export class EpicAPIClient {
  private client: ReturnType<typeof axios.create>;
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor() {
    this.baseURL = process.env.EPIC_BASE_URL || '';
    this.clientId = process.env.EPIC_CLIENT_ID || '';
    this.clientSecret = process.env.EPIC_CLIENT_SECRET || '';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: any) => {
        if (this.shouldRefreshToken()) {
          await this.authenticate();
        }
        
        if (this.accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          await this.authenticate();
          if (error.config) {
            return this.client.request(error.config);
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private shouldRefreshToken(): boolean {
    if (!this.accessToken) return true;
    if (!this.tokenExpiry) return true;
    
    // Refresh if token expires in less than 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return this.tokenExpiry <= fiveMinutesFromNow;
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post<AuthToken>(
        `${this.baseURL}/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'system/Patient.read system/Patient.write system/Appointment.read system/Appointment.write system/Observation.read',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    } catch (error: unknown) {
      console.error('Epic authentication failed:', error);
      throw new Error('Failed to authenticate with Epic FHIR API');
    }
  }

  private handleError(error: any): APIError {
    if (error.response) {
      return {
        code: `HTTP_${error.response.status}`,
        message: error.response.statusText || 'Request failed',
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'No response received from server',
        details: error.message,
      };
    } else {
      return {
        code: 'REQUEST_ERROR',
        message: error.message || 'Request setup failed',
        details: error,
      };
    }
  }

  // Patient Management APIs
  async searchPatients(params: SearchParams = {}): Promise<Patient[]> {
    try {
      const response = await this.client.get<Bundle<Patient>>('/Patient', {
        params: {
          _count: 50,
          ...params,
        },
      });
      
      return response.data.entry?.map(entry => entry.resource!).filter(Boolean) || [];
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }

  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await this.client.get<Patient>(`/Patient/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await this.client.put<Patient>(`/Patient/${id}`, {
        resourceType: 'Patient',
        id,
        ...patientData,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  async createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
    try {
      const response = await this.client.post<Patient>('/Patient', {
        resourceType: 'Patient',
        ...patientData,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  // Appointment Management APIs
  async searchAppointments(params: SearchParams = {}): Promise<Appointment[]> {
    try {
      const response = await this.client.get<Bundle<Appointment>>('/Appointment', {
        params: {
          _count: 50,
          ...params,
        },
      });

      return response.data.entry?.map(entry => entry.resource!).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response = await this.client.get<Appointment>(`/Appointment/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> {
    try {
      const response = await this.client.post<Appointment>('/Appointment', {
        resourceType: 'Appointment',
        ...appointmentData,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await this.client.put<Appointment>(`/Appointment/${id}`, {
        resourceType: 'Appointment',
        id,
        ...appointmentData,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  // Clinical Operations APIs
  async getObservations(patientId: string): Promise<Observation[]> {
    try {
      const response = await this.client.get<Bundle<Observation>>('/Observation', {
        params: {
          patient: patientId,
          _count: 100,
          _sort: '-date',
        },
      });

      return response.data.entry?.map(entry => entry.resource!).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching observations:', error);
      throw error;
    }
  }

  async createObservation(observationData: Omit<Observation, 'id'>): Promise<Observation> {
    try {
      const response = await this.client.post<Observation>('/Observation', {
        resourceType: 'Observation',
        ...observationData,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating observation:', error);
      throw error;
    }
  }

  // System Health Check
  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/metadata');
      return response.status === 200;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  // Get API metadata for discovery
  async getMetadata(): Promise<unknown> {
    try {
      const response = await this.client.get('/metadata');
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }

  // Manual token setting for testing
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.tokenExpiry = new Date(Date.now() + 3600 * 1000); // Assume 1 hour expiry
  }

  // Get current token status
  getTokenStatus(): { hasToken: boolean; isExpired: boolean; expiresAt?: Date } {
    return {
      hasToken: !!this.accessToken,
      isExpired: this.shouldRefreshToken(),
      expiresAt: this.tokenExpiry,
    };
  }
}

// Export singleton instance
export const epicAPI = new EpicAPIClient();
