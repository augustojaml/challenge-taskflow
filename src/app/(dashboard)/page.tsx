import { prisma } from '@/shared/libs/prisma'

const DashboardPage = async () => {
  const user = await prisma.user.findMany()

  console.log(user)

  return <div>Dashboard</div>
}

export default DashboardPage
