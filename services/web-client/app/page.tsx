import UserPanel from "./components/UserPanel";

export default function DispatchDashboard() {
  return (
    <div className="p-8">
      <h1>Dispatch Dashboard</h1>
      <br /> 
      <h2>Rider</h2>
      <UserPanel token={process.env.TEST_RIDER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0cmlkZXIxMjMifQ.K38SAgkNbixawbagxvlyMLlNlLWLSD3U7V3HNGPLnX0"} role="rider"/>
      <br />
      <h2>Driver</h2>
      <UserPanel token={process.env.TEST_DRIVER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiItMSJ9.CV4hUmQ4LxMFRfnf-NBHk2VNgY-vydmQver2M32fzwE"} role="driver" />
    </div>
  )
}