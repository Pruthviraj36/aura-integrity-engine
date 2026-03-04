const express = require("express");
const prisma = require("../prisma");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/subjects
// @desc    Get all subjects (optionally filtered by faculty)
// @access  Admin, Faculty, Student
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { facultyId, courseId, page = 1, limit = 50 } = req.query;

    const where = {};
    if (facultyId) where.facultyId = parseInt(facultyId);
    if (courseId) where.courseId = parseInt(courseId);

    const skip = (page - 1) * limit;

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          course: true,
          faculty: {
            include: {
              facultyProfile: true,
            },
          },
          _count: {
            select: { students: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.subject.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        subjects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/subjects/:id
// @desc    Get subject by ID
// @access  Admin, Faculty, Student
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        course: true,
        faculty: {
          include: {
            facultyProfile: true,
          },
        },
        students: {
          include: {
            studentProfile: true,
          },
        },
        sessions: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    if (!subject) {
      const error = new Error("Subject not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
