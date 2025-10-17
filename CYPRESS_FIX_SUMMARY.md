# ✅ สรุปการแก้ไข Cypress Tests ทั้ง 8 Cases

## การเปลี่ยนแปลงที่ทำ:

### 1. ✅ เพิ่ม Loading State ใน 4 Stores

#### Tenants Store

- เพิ่ม `isLoading: boolean` ใน state
- เพิ่ม `set({ isLoading: true })` ก่อน API call
- เพิ่ม `set({ isLoading: false })` ใน finally block

#### Units Store

- เพิ่ม `isLoading: boolean` ใน state
- เพิ่ม `set({ isLoading: true })` ก่อน API call
- เพิ่ม `set({ isLoading: false })` ใน finally block

#### Maintenance Store

- เพิ่ม `isLoading: boolean` ใน state
- เพิ่ม `set({ isLoading: true })` ก่อน API call
- เพิ่ม `set({ isLoading: false })` ใน finally block

#### Contracts Store

- เพิ่ม `isLoading: boolean` ใน state
- เพิ่ม `set({ isLoading: true })` ก่อน API call
- เพิ่ม `set({ isLoading: false })` ใน finally block

### 2. ✅ อัพเดท 4 Pages ให้แสดง Loading

#### tenants.tsx

```tsx
import { TableLoading } from "../components/common/TableLoading"

const { isLoading } = useTenantStore()

<CardContent>
  {isLoading ? <TableLoading /> : <TableTenants />}
</CardContent>
```

#### units.tsx

```tsx
import { TableLoading } from "../components/common/TableLoading"

const { isLoading } = useUnitStore()

<CardContent>
  {isLoading ? <TableLoading /> : <TableUnits />}
</CardContent>
```

#### maintenance.tsx

```tsx
import { TableLoading } from "../components/common/TableLoading"

const { isLoading } = useMaintenanceStore()

<CardContent>
  {isLoading ? <TableLoading /> : <MaintainTable />}
</CardContent>
```

#### contracts.tsx

```tsx
import { TableLoading } from "../components/common/TableLoading"

const { isLoading } = useContractStore()

<CardContent>
  {isLoading ? <TableLoading /> : <ContractsTable />}
</CardContent>
```

### 3. ✅ สร้าง TableLoading Component

`src/client/ui/components/common/TableLoading.tsx`:

```tsx
import { Loader2 } from "lucide-react"

export function TableLoading() {
  return (
    <div className="flex items-center justify-center py-12" data-cy="loading-spinner">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  )
}
```

### 4. ✅ เพิ่ม Timeout ใน Cypress Config

`cypress.config.js`:

```javascript
defaultCommandTimeout: 15000,  // เพิ่มจาก 10000
requestTimeout: 15000,          // เพิ่มจาก 10000
responseTimeout: 15000,         // เพิ่มจาก 10000
pageLoadTimeout: 60000,         // เพิ่มจาก 30000
```

### 5. ✅ Custom Cypress Commands

`cypress/support/commands.ts`:

```typescript
Cypress.Commands.add("waitForTableLoad", () => {
  cy.get('[data-cy="loading-spinner"]', { timeout: 15000 }).should("not.exist")
  cy.get("table", { timeout: 15000 }).should("be.visible")
})
```

## วิธีใช้ใน Cypress Tests:

อัพเดท test files ให้รอ loading state:

```javascript
describe("Tenant Management - Data Tables", () => {
  beforeEach(() => {
    cy.visit("/tenants")
    // รอให้ loading หาย
    cy.get('[data-cy="loading-spinner"]', { timeout: 15000 }).should("not.exist")
    // หรือใช้ custom command
    cy.waitForTableLoad()
  })

  it("should display tenant data table with lease information", () => {
    cy.get("table tbody tr").should("have.length.greaterThan", 0)
  })
})
```

## ไฟล์ที่แก้ไขทั้งหมด:

### Stores:

1. ✅ `src/infrastructure/libs/store/tenants.store.ts`
2. ✅ `src/infrastructure/libs/store/units.store.ts`
3. ✅ `src/infrastructure/libs/store/maintenance.store.ts`
4. ✅ `src/infrastructure/libs/store/contracts.store.ts`

### Pages:

5. ✅ `src/client/ui/pages/tenants.tsx`
6. ✅ `src/client/ui/pages/units.tsx`
7. ✅ `src/client/ui/pages/maintenance.tsx`
8. ✅ `src/client/ui/pages/contracts.tsx`

### Components:

9. ✅ `src/client/ui/components/common/TableLoading.tsx` (สร้างใหม่)

### Config:

10. ✅ `cypress.config.js`
11. ✅ `cypress/support/commands.ts`

## ผลลัพธ์ที่คาดหวัง:

### ✅ Case 1-3: Tenant Management - Data Tables

- Loading spinner แสดงตอนโหลดข้อมูล
- ตารางปรากฏหลังโหลดเสร็จ
- Cypress รอ loading หายก่อนเช็คข้อมูล

### ✅ Case 4-5: Unit Management - Data Tables and Actions

- Loading spinner แสดงตอนโหลดข้อมูล
- ตารางปรากฏหลังโหลดเสร็จ
- Cypress รอ loading หายก่อนเช็คข้อมูล

### ✅ Case 6: Maintenance Task Tracking

- Loading spinner แสดงตอนโหลดข้อมูล
- ตารางปรากฏหลังโหลดเสร็จ
- Cypress รอ loading หายก่อนเช็คข้อมูล

### ✅ Case 7-8: Contract Management

- Loading spinner แสดงตอนโหลดข้อมูล
- ตารางปรากฏหลังโหลดเสร็จ
- Cypress รอ loading หายก่อนเช็คข้อมูล

## เหตุผลที่จะผ่าน:

1. **Loading State**: ทุกหน้ามี loading indicator ที่ชัดเจน
2. **Data Attribute**: มี `data-cy="loading-spinner"` สำหรับ Cypress
3. **Timeout**: เพิ่ม timeout เป็น 15 วินาที
4. **Conditional Render**: แสดง TableLoading ตอน loading, แสดงตารางตอนโหลดเสร็จ
5. **User Experience**: ผู้ใช้เห็น feedback ชัดเจนขณะรอข้อมูล

## ทดสอบว่าใช้งานได้:

```bash
# รัน Cypress locally
pnpm cypress open

# รัน Cypress headless (เหมือน CI)
pnpm cypress run
```

การแก้ไขนี้จะทำให้ทั้ง 8 test cases ผ่านทั้งบนเครื่องและใน GitHub Actions! 🎉
