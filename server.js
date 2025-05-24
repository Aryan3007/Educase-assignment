import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import schoolRoutes from './routes/schoolRoutes.js';
import createSchoolsTable from './createTable.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
await createSchoolsTable(); 

app.use(bodyParser.json());
app.use('/', schoolRoutes);

app.get('/', (req, res) => {
  res.send('School Management API is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
