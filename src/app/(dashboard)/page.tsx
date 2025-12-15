import { prisma } from '@/shared/databases/prisma'

const DashboardPage = async () => {
  const user = await prisma.user.findMany()

  console.log(user)

  return <div>Dashboard</div>
}

export default DashboardPage
