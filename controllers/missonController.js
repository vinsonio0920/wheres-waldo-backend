import { body, validationResult, matchedData } from "express-validator";
import {
  createLeaderboardEntryQuery,
  createMissionQuery,
  createTargetQuery,
  getAllLeaderboardEntriesQuery,
  getAllMissionsQuery,
  getMissionQuery,
  getTargetQuery,
} from "../db/Mission.js";

const requiredErr = "is required";
const lengthError = (min, max) =>
  `must be between ${min} and ${max} characters`;

const validateMission = [
  body("image")
    .trim()
    .notEmpty()
    .withMessage(`Image ${requiredErr}`)
    .bail()
    .isLength({ min: 1, max: 264 })
    .withMessage(`Image ${lengthError(1, 264)}`),
  body("mission")
    .trim()
    .notEmpty()
    .withMessage(`Mission ${requiredErr}`)
    .bail()
    .isLength({ min: 1, max: 64 })
    .withMessage(`Mission ${lengthError(1, 64)}`),
  body("type")
    .trim()
    .notEmpty()
    .withMessage(`Type ${requiredErr}`)
    .bail()
    .custom((value) => {
      const validTypes = ["single", "multiple unique", "multiple same"];

      if (!validTypes.includes(value)) throw new Error("Not a valid type");

      return true;
    })
    .withMessage("Type is not valid"),
];

const validateTarget = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`Name ${requiredErr}`)
    .bail()
    .isLength({ min: 1, max: 16 })
    .withMessage(`Name ${lengthError(1, 16)}`),
  body("locations")
    .custom((value) => {
      const parsedValue = JSON.parse(value);

      if (!Array.isArray(parsedValue))
        throw new Error("Locations must be an array");
      if (parsedValue.length <= 0)
        throw new Error("Locations must not be empty!");

      return true;
    })
    .withMessage("Locations must be a valid array!"),
  body("missionId")
    .trim()
    .custom(async (value) => {
      const mission = await getMissionQuery(value);

      if (!mission) throw new Error("Invalid mission ID!");

      return true;
    })
    .withMessage("Mission ID is not valid"),
];

const validateLeaderboardEntry = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`Name ${requiredErr}`)
    .bail()
    .isLength({ min: 1, max: 26 })
    .withMessage(`Name ${lengthError(1, 26)}`),
  body("time")
    .custom((value) => {
      const timeFormat = /^\d+\.\d{2}$/;

      if (!timeFormat.test(String(value)))
        throw new Error("Time is not formatted correctly!");

      return true;
    })
    .withMessage("Time is not valid"),
  body("missionId")
    .trim()
    .custom(async (value) => {
      const mission = await getMissionQuery(value);

      if (!mission) throw new Error("Invalid mission ID!");

      return true;
    })
    .withMessage("Mission ID is not valid"),
];

async function getAllMissions(req, res) {
  try {
    const { missions, missionLength } = await getAllMissionsQuery();

    return res.json({
      data: {
        updated: new Date(),
        totalItems: missionLength,
        startIndex: 1,
        itemsPerPage: 10,
        items: missions,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: 500,
        message:
          "There was an error fetching the missions. Please try again later.",
      },
    });
  }
}

async function getMission(req, res) {
  const { missionId } = req.params;

  try {
    const mission = await getMissionQuery(missionId);

    return res.json({
      data: {
        updated: new Date(),
        totalItems: 1,
        startIndex: 1,
        itemsPerPage: 1,
        items: [mission],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: 500,
        message:
          "There was an error fetching the mission. Please try again later.",
      },
    });
  }
}

const createMission = [
  validateMission,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: "The form is invalid. Please try again.",
        errors: errors.array(),
      });
    }

    const values = matchedData(req);
    try {
      const mission = await createMissionQuery(values);

      return res.json({
        data: {
          updated: new Date(),
          totalItems: 1,
          startIndex: 1,
          itemsPerPage: 1,
          items: [mission],
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: {
          code: 500,
          message:
            "There was an error creating the mission. Please try again later.",
        },
      });
    }
  },
];

async function getTarget(req, res) {
  const { missionId, targetId } = req.params;

  try {
    const target = await getTargetQuery(missionId, targetId);

    return res.json({
      data: {
        updated: new Date(),
        totalItems: 1,
        startIndex: 1,
        itemsPerPage: 1,
        items: [target],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: 500,
        message:
          "There was an error validating the target. Please try again later.",
      },
    });
  }
}

const createTarget = [
  validateTarget,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: "The form is invalid. Please try again.",
        errors: errors.array(),
      });
    }

    const values = matchedData(req);
    try {
      const formattedValues = {
        ...values,
        missionId: Number(values.missionId),
      };
      const target = await createTargetQuery(formattedValues);

      return res.json({
        data: {
          updated: new Date(),
          totalItems: 1,
          startIndex: 1,
          itemsPerPage: 1,
          items: [target],
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: {
          code: 500,
          message:
            "There was an error creating the target. Please try again later.",
        },
      });
    }
  },
];

async function getAllLeaderboardEntries(req, res) {
  const { missionId } = req.params;
  const { cursor } = req.query;

  try {
    const { leaderboardEntries, leaderboardEntriesLength } =
      await getAllLeaderboardEntriesQuery(missionId, cursor);

    return res.json({
      data: {
        totalItems: leaderboardEntriesLength,
        startIndex: 1,
        itemsPerPage: 10,
        items: leaderboardEntries || [],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: 500,
        message:
          "There was an error fetching the leaderboard. Please try again later.",
      },
    });
  }
}

const createLeaderboardEntry = [
  validateLeaderboardEntry,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: "The form is invalid. Please try again.",
        errors: errors.array(),
      });
    }

    const values = matchedData(req);
    try {
      const formattedValues = {
        ...values,
        time: Number(values.time),
        missionId: Number(values.missionId),
      };
      const leaderboardEntry =
        await createLeaderboardEntryQuery(formattedValues);

      return res.json({
        data: {
          updated: new Date(),
          totalItems: 1,
          startIndex: 1,
          itemsPerPage: 1,
          items: [leaderboardEntry],
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: {
          code: 500,
          message:
            "There was an error creating the leaderboard entry. Please try again later.",
        },
      });
    }
  },
];

export {
  getAllMissions,
  getMission,
  createMission,
  getTarget,
  createTarget,
  getAllLeaderboardEntries,
  createLeaderboardEntry,
};
