var prisma = require("../database/client");

async function updateStreakUser() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const yesterdayUTC = new Date(Date.UTC(year, month, day - 1, 0, 0, 0));

  const usersToUpdate = await prisma.user.findMany({
    where: {
      date_last_pray: {
        lt: yesterdayUTC,
      },
      streak: {
        gt: 0,
      },
    },
    select: {
      id: true,
    },
  });

  const userIdsToUpdate = usersToUpdate.map((user) => user.id);

  await prisma.user.updateMany({
    where: {
      id: {
        in: userIdsToUpdate,
      },
    },
    data: {
      streak: 0,
    },
  });
}

module.exports = updateStreakUser;
