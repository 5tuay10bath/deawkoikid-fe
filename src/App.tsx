import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@client/ui/components/mock/card";
import { Routes, Route } from 'react-router-dom';
import Sidebar from "@client/ui/components/Sidebar";
import Dashboard from "@client/ui/pages/dashboard";
import Units from "@client/ui/pages/units";
import { useState } from "react";
import { Separator } from "@client/ui/components/Separator";
import { PanelsTopLeft } from "lucide-react";
import Tenants from "@client/ui/pages/tenants";
import Payments from "@client/ui/pages/payments";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} />
      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <button
          className="md:block hidden"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <PanelsTopLeft className="color-grey-400 w-[20px]" />
        </button>
        <Separator className="md:block hidden"/>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/units" element={<Units />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/" element={
            <Card className="w-1/3">
              <CardHeader>
                <CardTitle>Title</CardTitle>
                <CardDescription>Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content</p>
              </CardContent>
              <CardFooter>
                <button className="px-3 py-1 bg-blue-500 text-white rounded">
                  Some button
                </button>
              </CardFooter>
            </Card>
          } />
        </Routes>
      </main>
    </div>
  );
}