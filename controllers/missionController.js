import { body, validationResult, matchedData } from "express-validator";
import {
  createLeaderboardEntryQuery,
  createMissionQuery,
  createTargetQuery,
  getAllLeaderboardEntriesQuery,
  getAllMissionsQuery,
  getMissionQuery,
  getTargetQuery,
} from "../db/mission.js";
import { getSession } from "./sessionController.js";
import { getRank, getTime } from "../utils.js";

const requiredErr = "is required";
const intError = "must be a positive integer or float ending in .5";
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

const validateTargetClickForm = [
  body("x")
    .notEmpty()
    .withMessage(`X coordinate ${requiredErr}`)
    .bail()
    .isNumeric()
    .withMessage(`X coordinate ${intError}`)
    .toFloat(),
  body("y")
    .notEmpty()
    .withMessage(`Y coordinate ${requiredErr}`)
    .bail()
    .isNumeric()
    .withMessage(`Y coordinate ${intError}`)
    .toFloat(),
];

const validateMultipleSameTargetClickForm = [
  body("x")
    .notEmpty()
    .withMessage(`X coordinate ${requiredErr}`)
    .bail()
    .isNumeric()
    .withMessage(`X coordinate ${intError}`)
    .toFloat(),
  body("y")
    .notEmpty()
    .withMessage(`Y coordinate ${requiredErr}`)
    .bail()
    .isNumeric()
    .withMessage(`Y coordinate ${intError}`)
    .toFloat(),
  body("targetIds")
    .custom((value) => {
      const parsedValue = JSON.parse(value);

      if (!Array.isArray(parsedValue))
        throw new Error("Locations must be an array");
      if (parsedValue.length <= 0)
        throw new Error("Locations must not be empty!");

      return true;
    })
    .withMessage("Locations must be a valid array!"),
];

const validateLeaderboardEntry = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`Name ${requiredErr}`)
    .bail()
    .isLength({ min: 1, max: 26 })
    .withMessage(`Name ${lengthError(1, 26)}`),
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

async function getMission(req, res, next) {
  // every time we load/reset a mission, we reset the stopwatch!
  req.session.stopwatchStart = Date.now();

  // make sure that the change is saved onto the database (sync)
  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

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
        error: {
          code: 400,
          message: "The form is invalid. Please try again.",
          errors: errors.array(),
        },
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
          "There was an error fetching the target. Please try again later.",
      },
    });
  }
}

const validateTargetClick = [
  validateTargetClickForm,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "The form is invalid. Please try again.",
          errors: errors.array(),
        },
      });
    }

    // return whether or not the click is inside of the target's locations!
    const { missionId, targetId } = req.params;
    const { x, y } = matchedData(req);

    try {
      const target = await getTargetQuery(missionId, targetId);
      if (!target) throw new Error("No target found!");

      let targetFound = false;
      const locations = JSON.parse(target.locations);
      locations.forEach((location) => {
        // check if the click is inside one of the target's box
        const isInsideX = location[0][0] <= x && x <= location[1][0];
        const isInsideY = location[0][1] <= y && y <= location[1][1];

        if (isInsideX && isInsideY) {
          targetFound = true;
        }
      });

      // get the time it took to find the target along with the rank
      const timeTaken = getTime(req.session.stopwatchStart);
      const rank = await getRank(missionId, req.session.stopwatchStart);
      req.session.timeTaken = Date.now() - req.session.stopwatchStart;

      return res.json({
        data: {
          updated: new Date(),
          totalItems: 1,
          startIndex: 1,
          itemsPerPage: 1,
          items: [
            {
              ...target,
              targetFound,
              timeTaken,
              rank,
            },
          ],
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
  },
];

const validateMultipleSameTargetClick = [
  validateMultipleSameTargetClickForm,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "The form is invalid. Please try again.",
          errors: errors.array(),
        },
      });
    }

    // return whether or not the click is inside of the target's locations!
    const { missionId } = req.params;
    const { x, y, targetIds } = matchedData(req);
    const targetIdsArray = JSON.parse(targetIds);

    try {
      let targetFound = false;

      for (const targetId of targetIdsArray) {
        const target = await getTargetQuery(missionId, targetId);
        if (!target) throw new Error("No target was found from targetId!");

        const locations = JSON.parse(target.locations);
        locations.forEach((location) => {
          // check if the click is inside one of the target's box
          const isInsideX = location[0][0] <= x && x <= location[1][0];
          const isInsideY = location[0][1] <= y && y <= location[1][1];

          if (isInsideX && isInsideY) {
            targetFound = true;
          }
        });

        if (targetFound) {
          // get the time it took to find the target along with the rank
          const timeTaken = getTime(req.session.stopwatchStart);
          const rank = await getRank(missionId, req.session.stopwatchStart);
          req.session.timeTaken = Date.now() - req.session.stopwatchStart;

          return res.json({
            data: {
              updated: new Date(),
              totalItems: 1,
              startIndex: 1,
              itemsPerPage: 1,
              items: [
                {
                  ...target,
                  targetFound,
                  timeTaken,
                  rank,
                },
              ],
            },
          });
        }
      }

      // no targets found
      return res.json({
        data: {
          updated: new Date(),
          totalItems: 1,
          startIndex: 1,
          itemsPerPage: 1,
          items: [
            {
              targetFound,
            },
          ],
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
  },
];

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
        error: {
          code: 400,
          message: "The form is invalid. Please try again.",
          errors: errors.array(),
        },
      });
    }

    const values = matchedData(req);
    try {
      const formattedValues = {
        ...values,
        time: Number(req.session.timeTaken),
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
  validateTargetClick,
  validateMultipleSameTargetClick,
  createTarget,
  getAllLeaderboardEntries,
  createLeaderboardEntry,
};
