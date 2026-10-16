import { appData } from '../utils/store.js';

export const createInquiry = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const inquiry = { id: `inq-${Date.now()}`, name, email, phone: phone || '', subject: subject || 'General inquiry', message, createdAt: new Date().toISOString() };
  appData.inquiries.push(inquiry);

  res.status(201).json({ message: 'Your inquiry has been submitted successfully.' });
};

export const getInquiries = (req, res) => {
  res.json({ inquiries: appData.inquiries });
};
