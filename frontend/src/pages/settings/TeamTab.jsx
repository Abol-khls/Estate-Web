import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Switch,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InboxIcon from "@mui/icons-material/Inbox";

import AppButton from "../../components/common/AppButton";
import DeleteDialog from "../../components/common/DeleteDialog";
import TableSkeleton from "../../components/common/skeletons/TableSkeleton";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";
import useResourceList from "../../hooks/queries/useResourceList";
import useDeleteResource from "../../hooks/queries/useDeleteResource";
import { getRoleLabel, getRoleColor } from "../../constants/userOptions";

import TeamMemberDialog from "./TeamMemberDialog";

const GRID_COLUMNS = "1fr 140px 200px 170px 110px 130px";

export default function TeamTab() {

    const { user: currentUser } = useAuth();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useResourceList("team", {});

    const members = data?.results ?? data ?? [];

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const deleteMutation = useDeleteResource("team");

    if (isError) {

        showSnackbar("خطا در دریافت لیست اعضای تیم", "error");

    }

    function openCreateDialog() {
        setSelectedMember(null);
        setDialogOpen(true);
    }

    function openEditDialog(member) {
        setSelectedMember(member);
        setDialogOpen(true);
    }

    async function toggleActive(member) {

        try {

            await api.patch(`team/${member.id}/`, {
                is_active: !member.is_active,
            });

            queryClient.invalidateQueries({ queryKey: ["team", "list"] });

            showSnackbar(
                !member.is_active ? "عضو فعال شد." : "عضو غیرفعال شد.",
                "success"
            );

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "تغییر وضعیت عضو انجام نشد."
            );

            showSnackbar(message, "error");

        }

    }

    function handleDeleteClick(member) {
        setMemberToDelete(member);
        setDeleteOpen(true);
    }

    function handleDelete() {

        deleteMutation.mutate(memberToDelete.id, {

            onSuccess: () => {

                showSnackbar("عضو تیم با موفقیت حذف شد.", "success");

                setDeleteOpen(false);
                setMemberToDelete(null);

            },

            onError: (mutationError) => {

                const message = getErrorMessage(
                    mutationError,
                    "حذف عضو تیم انجام نشد."
                );

                showSnackbar(message, "error");

            },

        });

    }

    return (

        <Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2.5 }}>
                <AppButton startIcon={<AddIcon />} onClick={openCreateDialog}>
                    افزودن عضو
                </AppButton>
            </Box>

            {isLoading ? (

                <TableSkeleton gridColumns={GRID_COLUMNS} columnsCount={6} rows={4} />

            ) : members.length === 0 ? (

                <Box
                    sx={{
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                        color: "text.secondary",
                    }}
                >
                    <InboxIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                    <Typography variant="body2">
                        هنوز عضوی اضافه نشده است.
                    </Typography>
                </Box>

            ) : (

                <Box
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >

                    {members.map((member, index) => (

                        <Box
                            key={member.id}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: GRID_COLUMNS,
                                columnGap: 2,
                                alignItems: "center",
                                px: 2.5,
                                py: 2,
                                bgcolor: index % 2 === 1 ? "rgba(31, 59, 87, 0.02)" : "transparent",
                                borderBottom: index === members.length - 1 ? "none" : "1px solid",
                                borderColor: "divider",
                            }}
                        >

                            <Box>
                                <Typography fontWeight={700}>
                                    {member.first_name || member.last_name
                                        ? `${member.first_name} ${member.last_name}`.trim()
                                        : member.username}
                                    {member.id === currentUser?.id && (
                                        <Typography component="span" variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                            (شما)
                                        </Typography>
                                    )}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    <bdi>{member.username}</bdi>
                                </Typography>
                            </Box>

                            <Chip
                                size="small"
                                color={getRoleColor(member.role)}
                                label={getRoleLabel(member.role)}
                            />

                            <Typography variant="body2" color="text.secondary" noWrap>
                                {member.email || "—"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                <bdi>{member.phone || "—"}</bdi>
                            </Typography>

                            <Tooltip title={member.is_active ? "فعال" : "غیرفعال"}>
                                <span>
                                    <Switch
                                        size="small"
                                        checked={member.is_active}
                                        disabled={member.id === currentUser?.id}
                                        onChange={() => toggleActive(member)}
                                    />
                                </span>
                            </Tooltip>

                            <Box sx={{ display: "flex", gap: 1 }}>

                                <Tooltip title="ویرایش">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => openEditDialog(member)}
                                        sx={{
                                            borderRadius: 2,
                                            border: "1px solid",
                                            borderColor: "primary.main",
                                            "&:hover": { bgcolor: "primary.main", color: "#fff" },
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="حذف">
                                    <span>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={member.id === currentUser?.id}
                                            onClick={() => handleDeleteClick(member)}
                                            sx={{
                                                borderRadius: 2,
                                                border: "1px solid",
                                                borderColor: "error.main",
                                                "&:hover": { bgcolor: "error.main", color: "#fff" },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>

                            </Box>

                        </Box>

                    ))}

                </Box>

            )}

            <TeamMemberDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                member={selectedMember}
            />

            <DeleteDialog
                open={deleteOpen}
                title="حذف عضو تیم"
                message={`آیا از حذف "${memberToDelete?.username ?? ""}" مطمئن هستید؟`}
                onClose={() => {
                    setDeleteOpen(false);
                    setMemberToDelete(null);
                }}
                onConfirm={handleDelete}
            />

        </Box>

    );

}