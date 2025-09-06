import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@client/ui/components/mock/card";

import Table, { type Column } from "@client/ui/components/Table";

interface Tenant {
  name: string;
  email: string;
  phone: string;
}

const tenantColumns: Column<Tenant>[] = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone", accessor: "phone" },
]

const tenantData: Tenant[] = [
  {
    name: "Tenant 1",
    email: "tenant1@gmail.com",
    phone: "08123456789",
  },
  {
    name: "Tenant 2",
    email: "tenant2@gmail.com",
    phone: "08123456789",
  },
  {
    name: "Tenant 3",
    email: "tenant3@gmail.com",
    phone: "08123456789",
  }
]

interface Contract {
  tenant_name: string;
  unit_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

const contractColumns: Column<Contract>[] = [
  { header: "Tenant Name", accessor: "tenant_name" },
  { header: "Unit Name", accessor: "unit_name" },
  { header: "Start Date", accessor: "start_date" },
  { header: "End Date", accessor: "end_date" },
  { header: "Status", accessor: "status" },
]

const contractData: Contract[] = [
  {
    tenant_name: "Tenant 1",
    unit_name: "Unit 1",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    status: "Active",
  },
  {
    tenant_name: "Tenant 2",
    unit_name: "Unit 2",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    status: "Active",
  },
  {
    tenant_name: "Tenant 3",
    unit_name: "Unit 3",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    status: "Active",
  }
]

export default function App() {
  return (
    <>
      <Card className="w-1/5">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main</p>
        </CardContent>
        <CardFooter>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            Some button
          </button>
        </CardFooter>
      </Card>
      <Table title="Tenant" columns={tenantColumns} data={tenantData} />
      <Table title="Contract" columns={contractColumns} data={contractData} />
    </>
  );
}
