import { GenericRepository } from './genericRepository';

export interface FormSchema {
  id: number;
  title: string;
  description?: string;
  schema_json: string;
  created_at: string;
  updated_at: string;
}

// Instance of GenericRepository for the form schemas
export const formRepository = new GenericRepository<FormSchema>('/api/forms');
