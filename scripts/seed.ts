
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log("🌱 Starting seed...");

    // 1. Create Team
    const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .single();

    let teamId = team?.id;

    if (!teamId) {
        console.log("Creating demo team...");
        const { data: newTeam, error: createTeamError } = await supabase
            .from("teams")
            .insert({ name: "Demo Team" })
            .select("id")
            .single();

        if (createTeamError) throw createTeamError;
        teamId = newTeam.id;
    }

    // 2. Create Categories
    console.log("Ensuring categories...");
    const categories = ["Warm", "Cold", "Hot", "Qualified"];
    const categoryIds: string[] = [];

    for (const name of categories) {
        const { data: existing } = await supabase
            .from("lead_categories")
            .select("id")
            .eq("name", name)
            .maybeSingle();

        if (existing) {
            categoryIds.push(existing.id);
        } else {
            const { data: created } = await supabase
                .from("lead_categories")
                .insert({ name, color: faker.color.rgb() })
                .select("id")
                .single();
            if (created) categoryIds.push(created.id);
        }
    }

    // 3. Generate Leads
    console.log("Generating 10,000 leads...");
    const BATCH_SIZE = 1000;
    const TOTAL_LEADS = 10000;
    const STATUSES = [
        "new", "contacted", "qualified", "proposal",
        "negotiation", "closed_won", "closed_lost"
    ];

    for (let i = 0; i < TOTAL_LEADS; i += BATCH_SIZE) {
        const leads = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
            leads.push({
                team_id: teamId,
                category_id: faker.helpers.arrayElement(categoryIds),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                company: faker.company.name(),
                status: faker.helpers.arrayElement(STATUSES),
                priority: faker.helpers.arrayElement(["low", "medium", "high", "urgent"]),
                source: faker.helpers.arrayElement(["LinkedIn", "Website", "Referral", "Cold Call"]),
                notes: faker.lorem.sentence(),
                created_at: faker.date.past().toISOString(),
            });
        }

        const { error } = await supabase.from("leads").insert(leads);
        if (error) {
            console.error("Error inserting batch:", error);
        } else {
            console.log(`Inserted ${i + BATCH_SIZE} / ${TOTAL_LEADS}`);
        }
    }

    console.log("✅ Seed complete!");
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
