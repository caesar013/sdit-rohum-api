import Comment from "../models/Comment.js";

// Get comments for a news article (public: approved only, admin: all)
export const getCommentsByNewsId = async (req, res) => {
  try {
    const { newsId } = req.params;
    const showAll = req.user ? true : false; // Show all if authenticated admin

    const comments = await Comment.getByNewsId(newsId, showAll);

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

// Submit a comment (public)
export const createComment = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { name, email, comment } = req.body;

    // Validation
    if (!name || !email || !comment) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and comment are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const commentData = {
      news_id: newsId,
      author_name: name,
      author_email: email,
      comment,
    };

    const newComment = await Comment.create(commentData);

    res.status(201).json({
      success: true,
      message:
        "Comment submitted successfully. It will be visible after approval.",
      data: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating comment",
      error: error.message,
    });
  }
};

// Get all comments (admin only)
export const getAllComments = async (req, res) => {
  try {
    const { page, limit, status, news_id } = req.query;

    const result = await Comment.getAll({
      page,
      limit,
      status,
      news_id,
    });

    res.json({
      success: true,
      data: result.comments,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

// Get comment by ID (admin only)
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.getById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comment",
      error: error.message,
    });
  }
};

// Update comment status (admin only)
export const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    const validStatuses = ["pending", "approved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, approved, or rejected",
      });
    }

    const comment = await Comment.getById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const updatedComment = await Comment.updateStatus(id, status);

    res.json({
      success: true,
      message: "Comment status updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating comment status",
      error: error.message,
    });
  }
};

// Delete comment (admin only)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.getById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await Comment.delete(id);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};

// Get status counts for a news article (admin only)
export const getCommentStatusCounts = async (req, res) => {
  try {
    const { newsId } = req.params;

    const counts = await Comment.getStatusCounts(newsId);

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching comment counts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comment counts",
      error: error.message,
    });
  }
};
