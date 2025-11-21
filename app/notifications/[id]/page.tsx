import NotificationDetail from "@/components/NotificationDetail"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <NotificationDetail id={id} />
      </div>
    </div>
  )
}
