import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, Paper, Typography, Chip } from "@mui/material";

import ListChecksIcon from "@mui/icons-material/Checklist";
import CalendarIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

import { getActivityStatusLabel, getActivityStatusColor } from "../../constants/activityOptions";
import { getVisitStatusLabel, getVisitStatusColor } from "../../constants/visitOptions";
import { getContractStatusLabel, getContractStatusColor } from "../../constants/contractOptions";

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

const TYPE_CONFIG = {
    activity: { icon: ListChecksIcon, color: "#0E7C86", label: "فعالیت" },
    visit: { icon: CalendarIcon, color: "#1F3B57", label: "بازدید" },
    contract: { icon: DescriptionIcon, color: "#8B3A3A", label: "قرارداد" },
};

export default function CustomerTimeline({ customerId }) {

    const navigate = useNavigate();

    const { data: activities, isLoading: loadingActivities } = useQuery({
        queryKey: ["activities", "list", { customer: customerId, timeline: true }],
        queryFn: async () => {
            const response = await api.get("activities/", {
                params: { customer: customerId, page_size: 100, ordering: "-follow_date" },
            });
            return response.data.results ?? [];
        },
    });

    const { data: visits, isLoading: loadingVisits } = useQuery({
        queryKey: ["visits", "list", { customer: customerId, timeline: true }],
        queryFn: async () => {
            const response = await api.get("visits/", {
                params: { customer: customerId, page_size: 100, ordering: "-visit_date" },
            });
            return response.data.results ?? [];
        },
    });

    const { data: contracts, isLoading: loadingContracts } = useQuery({
        queryKey: ["contracts", "list", { customer: customerId, timeline: true }],
        queryFn: async () => {
            const response = await api.get("contracts/", {
                params: { customer: customerId, page_size: 100, ordering: "-created_at" },
            });
            return response.data.results ?? [];
        },
    });

    const isLoading = loadingActivities || loadingVisits || loadingContracts;

    const timelineItems = useMemo(() => {

        const items = [];

        for (const activity of activities ?? []) {
            items.push({
                type: "activity",
                id: activity.id,
                date: activity.follow_date,
                title: activity.title,
                statusLabel: getActivityStatusLabel(activity.status),
                statusColor: getActivityStatusColor(activity.status),
                description: activity.description,
                href: `/admin/activities/${activity.id}`,
            });
        }

        for (const visit of visits ?? []) {
            items.push({
                type: "visit",
                id: visit.id,
                date: visit.visit_date,
                title: `بازدید از ${visit.property_title}`,
                statusLabel: getVisitStatusLabel(visit.status),
                statusColor: getVisitStatusColor(visit.status),
                description: visit.notes,
                href: `/admin/visits/${visit.id}`,
            });
        }

        for (const contract of contracts ?? []) {
            items.push({
                type: "contract",
                id: contract.id,
                date: contract.created_at,
                title: `قرارداد ${contract.property_title}`,
                statusLabel: getContractStatusLabel(contract.status),
                statusColor: getContractStatusColor(contract.status),
                description: contract.description,
                href: `/admin/contracts/${contract.id}`,
            });
        }

        return items.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

    }, [activities, visits, contracts]);

    if (isLoading) {
        return <Loading />;
    }

    if (timelineItems.length === 0) {

        return (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                هنوز هیچ فعالیت، بازدید یا قراردادی برای این مشتری ثبت نشده است.
            </Typography>
        );

    }

    return (

        <Box sx={{ position: "relative", pr: 3 }}>

            <Box
                sx={{
                    position: "absolute",
                    top: 6,
                    bottom: 6,
                    right: 15,
                    width: "2px",
                    bgcolor: "divider",
                }}
            />

            {timelineItems.map(item => {

                const config = TYPE_CONFIG[item.type];
                const Icon = config.icon;

                return (

                    <Box
                        key={`${item.type}-${item.id}`}
                        sx={{
                            position: "relative",
                            display: "flex",
                            gap: 2,
                            mb: 2.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: config.color,
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                zIndex: 1,
                            }}
                        >
                            <Icon sx={{ fontSize: 17 }} />
                        </Box>

                        <Paper
                            elevation={0}
                            onClick={() => navigate(item.href)}
                            sx={{
                                flex: 1,
                                p: 2,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                cursor: "pointer",
                                transition: ".15s",
                                "&:hover": {
                                    borderColor: "secondary.main",
                                    boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
                                },
                            }}
                        >

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>

                                <Box sx={{ minWidth: 0 }}>

                                    <Typography variant="caption" color="text.secondary">
                                        {config.label} · {formatDateTime(item.date)}
                                    </Typography>

                                    <Typography fontWeight={700} noWrap>
                                        {item.title}
                                    </Typography>

                                </Box>

                                <Chip size="small" color={item.statusColor} label={item.statusLabel} />

                            </Box>

                            {item.description && (

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {item.description}
                                </Typography>

                            )}

                        </Paper>

                    </Box>

                );

            })}

        </Box>

    );

}