// app/page.tsx — redirects root "/" to "/patient"
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/patient");
}
