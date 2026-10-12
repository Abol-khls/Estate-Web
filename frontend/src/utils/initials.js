export function getInitials(name) {

    const words = String(name || "").trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return "؟";

    return words
        .slice(0, 2)
        .map((word) => Array.from(word)[0])
        .join("‌");

}

export function getDisplayName(user) {

    const full = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

    return full || user?.username || "";

}

export function getRoleLabel(role) {

    if (role === "manager") return "مدیر آژانس";

    if (role === "agent") return "مشاور املاک";

    return "کاربر";

}

const AVATAR_TONES = ["emerald", "cyan", "amber", "indigo"];

export function getToneByName(name) {

    const sum = [...String(name || "")].reduce((total, char) => total + char.charCodeAt(0), 0);

    return AVATAR_TONES[sum % AVATAR_TONES.length];

}