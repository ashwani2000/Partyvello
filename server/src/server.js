import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureDefaultAdmin } from './utils/seedAdmin.js';

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();
  await ensureDefaultAdmin();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();
