import ContactMessage from "../models/ContactMessage.js";

/**
 * Get all messages (admin)
 */
export const getAllMessages = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;

    const result = await ContactMessage.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get message by ID (admin)
 */
export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.getById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get status counts (admin)
 */
export const getStatusCounts = async (req, res, next) => {
  try {
    const counts = await ContactMessage.getStatusCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new contact message (public)
 */
export const createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan pesan harus diisi",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    const messageId = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    const newMessage = await ContactMessage.getById(messageId);

    res.status(201).json({
      success: true,
      message: "Pesan berhasil dikirim. Terima kasih!",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update message status (admin)
 */
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["unread", "read", "replied"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status harus salah satu dari: unread, read, replied",
      });
    }

    const existing = await ContactMessage.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    await ContactMessage.updateStatus(id, status);

    const updated = await ContactMessage.getById(id);

    res.json({
      success: true,
      message: "Status pesan berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete message (admin)
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.getById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    await ContactMessage.delete(id);

    res.json({
      success: true,
      message: "Pesan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
