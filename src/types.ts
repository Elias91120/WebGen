
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface GeneratedImage {
  id: string;
  data: string;
  prompt: string;
}

export interface SearchResultItem {
  title: string;
  url: string;
}

export type ServiceType = 'starter' | 'custom' | 'redesign' | 'maintenance_only' | null;

export interface ClientRequest {
  id: string;
  date: string;
  status: 'new' | 'contacted' | 'signed' | 'archived';
  serviceId: ServiceType;
  serviceName: string;
  hasMaintenance: boolean;
  totalEstimate: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  message: string;
  preferredDate?: string;
}
