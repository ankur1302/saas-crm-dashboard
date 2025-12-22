type WebhookPayload = {
    action: "create" | "update" | "delete";
    entity: "lead" | "log" | "task" | "lead_category" | "log_category" | "team_member" | "invitation";
    entityId: string;
};

export async function triggerWebhook(payload: WebhookPayload) {
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
        return;
    }

    const fullPayload = {
        ...payload,
        timestamp: new Date().toISOString(),
    };

    try {
        // Fire and forget - don't await the result to block the UI
        fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fullPayload),
        }).catch((err) => {
            console.error("Failed to trigger webhook", err);
        });
    } catch (error) {
        console.error("Failed to trigger webhook", error);
    }
}
