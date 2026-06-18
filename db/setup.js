import { prisma } from "../lib/prisma.js";

async function main() {
  const missionRows = await prisma.mission.findMany();
  if (missionRows.length > 0) return console.log("Database already set up!");

  // Panda Mission
  const pandaMission = await prisma.mission.create({
    data: {
      image:
        "https://wl-brightside.cf.tsp.li/resize/728x/webp/bc7/1e0/ee75f05dbeb672d491c06f8c2f.jpg.webp",
      mission: "Find the panda among the raccoons",
      type: "single",
    },
  });
  console.log(`Created mission: ${JSON.stringify(pandaMission)}`);

  const pandaTarget = await prisma.target.create({
    data: {
      name: "Panda",
      locations:
        "[[[165.5,115],[205.5,154]],[[247,115],[284,149]],[[182,129],[269,171]],[[188,172],[245,231]]]",
      missionId: pandaMission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(pandaTarget)}`);

  // Crocs Mission
  const crocsMission = await prisma.mission.create({
    data: {
      image:
        "https://preview.redd.it/find-both-crocs-v0-wdsa4yue626g1.jpeg?width=1080&crop=smart&auto=webp&s=620982e9d2765d40bec1bdfed76b68e98ff9c201",
      mission: "Find both crocs",
      type: "multiple unique",
    },
  });
  console.log(`Created mission: ${JSON.stringify(crocsMission)}`);

  const crocAnimalTarget1 = await prisma.target.create({
    data: {
      name: "Croc (animal)",
      locations:
        "[[[349, 249],[435,305]],[[416,270],[480,320]],[[455,288],[574,360]]]",
      missionId: crocsMission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(crocAnimalTarget1)}`);

  const crocAnimalTarget2 = await prisma.target.create({
    data: {
      name: "Croc (shoe)",
      locations: "[[[398,1070],[418.5,1092]]]",
      missionId: crocsMission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(crocAnimalTarget2)}`);

  // Gymnasts Mission
  const gymnastsMission = await prisma.mission.create({
    data: {
      image:
        "https://preview.redd.it/find-the-3-gymnasts-v0-ihi87vu0yk8f1.jpeg?width=1080&crop=smart&auto=webp&s=fc3adf6a8735bb7bf05e90105355bf1206fa33e5",
      mission: "Find the 3 gymnasts",
      type: "multiple same",
    },
  });
  console.log(`Created mission: ${JSON.stringify(gymnastsMission)}`);

  const gymnastTarget1 = await prisma.target.create({
    data: {
      name: "Gymnast",
      locations:
        "[[[962.5,388],[977.5,413]],[[1032.5,380],[1045.5,396]],[[973.5,424],[977.5,432]]]",
      missionId: gymnastsMission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(gymnastTarget1)}`);

  const gymnastTarget2 = await prisma.target.create({
    data: {
      name: "Gymnast",
      locations: "[[[35.5,745],[55.5,755]]]",
      missionId: gymnastsMission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(gymnastTarget2)}`);

  const gymnastTarget3 = await prisma.target.create({
    data: {
      name: "Gymnast",
      locations:
        "[[[765,1032],[817.5,1058.5]],[[851.5,1031],[985.5,1082]],[[968.5,1080],[1082,1118]]]",
      missionId: gymnastsMission.id,
    },
  });
  console.log(`Created target: ${JSON.stringify(gymnastTarget3)}`);
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
