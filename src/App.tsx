import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@client/ui/components/mock/card";
// import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Sidebar from "@client/ui/components/Sidebar";
import Dashboard from "@client/ui/pages/dashboard";
import Units from "@client/ui/pages/units";
export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={false} />
      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/units" element={<Units />} />
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