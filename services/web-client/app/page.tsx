import UserPanel from "./components/UserPanel";

export default function DispatchDashboard() {
  return (
    <div className="p-8">
      <div className="flex h-screen">
        <h1>Dispatch Dashboard</h1>
        <div className="w-1/2 p-8">
          <UserPanel token={process.env.NEXT_TEST_RIDER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0cmlkZXIxMjMifQ.K38SAgkNbixawbagxvlyMLlNlLWLSD3U7V3HNGPLnX0"} role="rider"/>
        </div>
        <div className="w-1/2 p-8">
          <UserPanel token={process.env.NEXT_TEST_DRIVER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiItMSJ9.CV4hUmQ4LxMFRfnf-NBHk2VNgY-vydmQver2M32fzwE"} role="driver" />
        </div>
      </div>
    </div>
  )
}