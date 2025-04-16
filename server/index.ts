import express, { Request, Response } from 'express';
import cors from 'cors';
import { openDb, migrate } from './db';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// On startup: check if DB exists, migrate, and load example if necessary
const DB_PATH = path.resolve(__dirname, '../form_builder.sqlite');
const EXAMPLE_SCHEMA_PATH = path.resolve(__dirname, '../exampleSchema/formscheme.json');

(async () => {
  await migrate();
  try {
    const db = await openDb();
    const row = await db.get('SELECT COUNT(*) as count FROM form_schemas');
    if (row.count === 0) {
      const raw = fs.readFileSync(EXAMPLE_SCHEMA_PATH, 'utf-8');
      const example = JSON.parse(raw);
      await db.run(
        'INSERT INTO form_schemas (title, description, schema_json) VALUES (?, ?, ?)',
        example.title,
        example.description || '',
        JSON.stringify(example)
      );
      console.log('Inserted example form schema from exampleSchema/formscheme.json');
    }
  } catch (err) {
    console.error('Failed to check/insert example schema:', err);
  }
})();

// API: Get all form schemas
app.get('/api/forms', async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const forms = await db.all('SELECT * FROM form_schemas ORDER BY created_at DESC');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Get a single form schema
app.get('/api/forms/:id', async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const form = await db.get('SELECT * FROM form_schemas WHERE id = ?', req.params.id);
    if (form) res.json(form);
    else res.status(404).json({ error: 'Form not found' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Create a new form schema
interface FormSchemaBody {
  title: string;
  description?: string;
  schema_json: string;
}

app.post('/api/forms', async (req: Request<{}, {}, FormSchemaBody>, res: Response) => {
  try {
    const { title, description, schema_json } = req.body;
    if (!title || !schema_json) {
      return res.status(400).json({ error: 'Title and schema_json are required' });
    }
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO form_schemas (title, description, schema_json) VALUES (?, ?, ?)',
      title, description, schema_json
    );
    const newForm = await db.get('SELECT * FROM form_schemas WHERE id = ?', result.lastID);
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Update a form schema
app.put('/api/forms/:id', async (req: Request<{ id: string }, {}, FormSchemaBody>, res: Response) => {
  try {
    const { title, description, schema_json } = req.body;
    const db = await openDb();
    await db.run(
      'UPDATE form_schemas SET title = ?, description = ?, schema_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      title, description, schema_json, req.params.id
    );
    const updatedForm = await db.get('SELECT * FROM form_schemas WHERE id = ?', req.params.id);
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Delete a form schema
app.delete('/api/forms/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const db = await openDb();
    await db.run('DELETE FROM form_schemas WHERE id = ?', req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Form Builder backend running on http://localhost:${PORT}`);
});
