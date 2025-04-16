// A generic repository for CRUD operations using fetch and generics
export class GenericRepository<T> {
  constructor(private baseUrl: string) {}

  async getAll(): Promise<T[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  }

  async getById(id: string | number): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  }

  async create(data: Partial<T>): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
  }

  async delete(id: string | number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
  }
}
