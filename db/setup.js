import { prisma } from "../lib/prisma.js";

async function main() {
  // Create the panda mission!
  const mission = await prisma.mission.create({
    data: {
      image:
        "https://wl-brightside.cf.tsp.li/resize/728x/webp/bc7/1e0/ee75f05dbeb672d491c06f8c2f.jpg.webp",
      mission: "Find the panda among the raccoons",
      type: "single",
    },
  });
  console.log(`Created mission: ${JSON.stringify(mission)}`);

  const target = await prisma.target.create({
    data: {
      name: "Panda",
      locations: [
        // ears (left, right)
        [
          [166, 203],
          [118, 152],
        ],
        [
          [251, 286],
          [116, 152],
        ],
        // face
        [
          [185, 271],
          [127, 156],
        ],
        [
          [176, 244],
          [155, 233],
        ],
      ],
      missionId: mission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(target)}`);

  const leaderboardEntries = await prisma.leaderboardEntry.createMany({
    data: [
      { name: "Vinsonius", time: 1.0, missionId: mission.id },
      { name: "Waldinho", time: 1.0, missionId: mission.id },
      { name: "Pirate King", time: 1.0, missionId: mission.id },
    ],
  });
  console.log(`Leaderboard entries: ${JSON.stringify(leaderboardEntries)}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
