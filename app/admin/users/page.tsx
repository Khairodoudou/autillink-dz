"use client";
// app/admin/users/page.tsx
import { useState, useEffect } from "react";
import { Users, Search, ToggleLeft, ToggleRight, Trash2, AlertTriangle, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

const roleColors: Record<string, { bg: string; text: string; label: string }> = {
  parent:       { bg: "#E97F6B15", text: "#E97F6B", label: "ولي أمر" },
  specialist:   { bg: "#1D5B7915", text: "#1D5B79", label: "أخصائي" },
  admin:        { bg: "#6B4C9315", text: "#6B4C93", label: "مشرف" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  نشط:      { bg: "#2E8B7E15", text: "#2E8B7E" },
  "غير نشط": { bg: "#9CA3AF15", text: "#9CA3AF" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const pageSize = 4;

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setUsers(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const roles = ["الكل", "ولي أمر", "أخصائي"];

  const filtered = users.filter((u) => {
    if (u.role === "admin" || u.role === "ADMIN") return false;
    const matchSearch = u.name.includes(search) || u.email.includes(search) || u.wilaya.includes(search);
    const matchRole = filterRole === "الكل" || u.roleLabel === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newActive = currentStatus !== "نشط";
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: newActive ? "نشط" : "غير نشط" } : u))
        );
      }
    } catch (e) {
      console.error("Failed to toggle status", e);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        setDeleteError(data.error || "حدث خطأ أثناء حذف المستخدم");
      }
    } catch (e) {
      console.error("Failed to delete user", e);
      setDeleteError("تعذر الاتصال بالسيرفر");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="المستخدمون"
        subtitle={`${users.filter(u => u.role !== "admin" && u.role !== "ADMIN").length} مستخدم مسجل في المنصة`}
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
                const role = roleColors[user.role] ?? roleColors.parent;
                const sts = statusColors[user.status] ?? statusColors["نشط"];
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(user.id, user.status)}
                          className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl border border-[#E5D9F2] hover:bg-[#F0EBF8] transition-colors text-[#6B7280]"
                        >
                          {user.status === "نشط" ? (
                            <ToggleRight className="w-4 h-4 text-[#2E8B7E]" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-[#9CA3AF]" />
                          )}
                          {user.status === "نشط" ? "تعطيل" : "تفعيل"}
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(user); setDeleteError(null); }}
                          className="flex items-center gap-1.5 text-xs font-600 px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف المستخدم"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span>حذف</span>
                        </button>
                      </div>
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5D9F2] shadow-2xl max-w-md w-full p-6 text-right space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F5F0FA] pb-3">
              <div className="flex items-center gap-2 text-red-600 font-800 text-base">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>تأكيد حذف المستخدم</span>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-[#9CA3AF] hover:text-[#1F2937] p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <p className="text-sm text-[#4B5563] leading-relaxed">
                هل أنت تأكد من رغبتك في حذف المستخدم <strong className="text-[#1F2937] font-700">{deleteTarget.name}</strong> ({deleteTarget.email})؟
              </p>
              <p className="text-xs text-red-500 mt-2 font-600">
                ⚠️ هذا الإجراء نهائي ولا يمكن التراجع عنه.
              </p>

              {deleteError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-600">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-600 border border-[#E5D9F2] text-[#6B7280] hover:bg-[#F5F0FA] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-700 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {deleting ? "جاري الحذف..." : "حذف المستخدم"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
