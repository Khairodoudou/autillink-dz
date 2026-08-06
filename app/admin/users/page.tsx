"use client";
// app/admin/users/page.tsx
import { useState } from "react";
import { Users, Search, ToggleLeft, ToggleRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { mockAdminUsers } from "@/lib/mock-data";

const roleColors: Record<string, { bg: string; text: string; label: string }> = {
  parent:       { bg: "#E97F6B15", text: "#E97F6B", label: "ولي أمر" },
  specialist:   { bg: "#1D5B7915", text: "#1D5B79", label: "أخصائي" },
  admin:        { bg: "#6B4C9315", text: "#6B4C93", label: "مشرف" },
  center_admin: { bg: "#2E8B7E15", text: "#2E8B7E", label: "مدير مركز" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  نشط:      { bg: "#2E8B7E15", text: "#2E8B7E" },
  "غير نشط": { bg: "#9CA3AF15", text: "#9CA3AF" },
  معلق:     { bg: "#F5B94215", text: "#c49012" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const roles = ["الكل", "ولي أمر", "أخصائي", "مدير مركز", "مشرف"];

  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search) || u.wilaya.includes(search);
    const matchRole = filterRole === "الكل" || (roleColors[u.role]?.label === filterRole);
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "نشط" ? "غير نشط" : "نشط" } : u
      )
    );
  };

  return (
    <div>
      <PageHeader
        title="المستخدمون"
        subtitle={`${mockAdminUsers.length} مستخدم مسجل في المنصة`}
        icon={Users}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بالاسم أو البريد أو الولاية..."
            className="w-full bg-white border border-[#E5D9F2] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#6B4C93] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => { setFilterRole(r); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-600 transition-all ${
                filterRole === r
                  ? "bg-[#6B4C93] text-white shadow-sm"
                  : "bg-white border border-[#E5D9F2] text-[#6B7280] hover:border-[#6B4C93]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5D9F2] shadow-sm overflow-hidden p-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#E5D9F2] bg-[#F5F0FA]">
                {["المستخدم", "البريد الإلكتروني", "الدور", "الولاية", "آخر دخول", "الحالة", "الإجراءات"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-800 text-[#6B7280] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0FA]">
              {paginated.map((user) => {
                const role = roleColors[user.role];
                const sts = statusColors[user.status];
                return (
                  <tr key={user.id} className="hover:bg-[#F5F0FA] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#6B4C93]/15 flex items-center justify-center text-[#6B4C93] font-800 text-sm flex-shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-700 text-[#1F2937]">{user.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{user.centerName ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-700 px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: role.bg, color: role.text }}
                      >
                        {role.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{user.wilaya}</td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-700 px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: sts.bg, color: sts.text }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl border border-[#E5D9F2] hover:bg-[#F0EBF8] transition-colors text-[#6B7280]"
                      >
                        {user.status === "نشط" ? (
                          <ToggleRight className="w-4 h-4 text-[#2E8B7E]" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-[#9CA3AF]" />
                        )}
                        {user.status === "نشط" ? "تعطيل" : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          accentColor="#6B4C93"
        />
      </div>
    </div>
  );
}
