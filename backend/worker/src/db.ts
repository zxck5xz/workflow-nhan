import { neon } from '@neondatabase/serverless';

type NeonQuery = ReturnType<typeof neon>;

let sqlClient: NeonQuery | null = null;

export function getSql(databaseUrl: string): NeonQuery {
  if (!sqlClient) {
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
}

// Helper to ensure query results are arrays
function asRows(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object' && 'rows' in result) return result.rows;
  return [];
}

// ===== Auth Queries =====

export async function findMemberByEmail(sql: NeonQuery, email: string) {
  const rows = asRows(await sql`SELECT * FROM "Member" WHERE email = ${email} LIMIT 1`);
  return rows[0] || null;
}

export async function findMemberById(sql: NeonQuery, id: string) {
  const rows = asRows(await sql`SELECT * FROM "Member" WHERE id = ${id} LIMIT 1`);
  return rows[0] || null;
}

export async function listAllMembers(sql: NeonQuery) {
  return asRows(await sql`SELECT * FROM "Member" ORDER BY "joinedAt" DESC`);
}

export async function updateMemberRole(sql: NeonQuery, id: string, role: string) {
  const rows = asRows(await sql`UPDATE "Member" SET role = ${role} WHERE id = ${id} RETURNING *`);
  return rows[0] || null;
}

export async function deleteMember(sql: NeonQuery, id: string) {
  await sql`DELETE FROM "Member" WHERE id = ${id}`;
}

// ===== AppData Queries =====

export async function loadAllData(sql: NeonQuery) {
  const [projects, members, tasks, statuses, priorities, scorecards, insights] = await Promise.all([
    sql`SELECT * FROM "Project" ORDER BY "createdAt" ASC`,
    sql`SELECT id, name, email, role, "avatarColor", initials, "joinedAt" FROM "Member" ORDER BY "joinedAt" ASC`,
    sql`SELECT * FROM "Task" ORDER BY "createdAt" ASC`,
    sql`SELECT * FROM "StatusConfig" ORDER BY "order" ASC`,
    sql`SELECT * FROM "PriorityConfig" ORDER BY "defaultWeight" DESC`,
    sql`SELECT * FROM "GameScorecard" ORDER BY "week" ASC`,
    sql`SELECT * FROM "WeeklyInsight" ORDER BY "week" ASC`,
  ].map(p => p.then(asRows)));

  return {
    projects: projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      platform: p.platform,
      genre: p.genre,
      status: p.status,
      color: p.color,
      createdAt: p.createdAt?.toISOString?.() ?? null,
    })),
    members: members.map((m: any) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      avatarColor: m.avatarColor,
      initials: m.initials,
      joinedAt: m.joinedAt?.toISOString?.() ?? null,
    })),
    tasks: tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      projectId: t.projectId,
      assigneeId: t.assigneeId,
      status: t.status === 'in_testing' ? 'in-testing' : t.status,
      priority: t.priority,
      weight: t.weight,
      deadline: t.deadline?.toISOString?.() ?? null,
      createdAt: t.createdAt?.toISOString?.() ?? null,
      completedAt: t.completedAt?.toISOString?.() ?? null,
      eisenhower: {
        urgent: t.eisenhowerUrgent,
        important: t.eisenhowerImportant,
        autoClassified: t.eisenhowerAutoClassified,
      },
      tags: t.tags ?? null,
    })),
    statuses: statuses.map((s: any) => ({
      id: s.id === 'in_testing' ? 'in-testing' : s.id,
      label: s.label,
      color: s.color,
      order: s.order,
    })),
    priorities: priorities.map((pr: any) => ({
      id: pr.id,
      label: pr.label,
      color: pr.color,
      defaultWeight: pr.defaultWeight,
    })),
    scorecards: scorecards.map((sc: any) => ({
      id: sc.id,
      projectId: sc.projectId,
      week: sc.week?.toISOString?.() ?? null,
      ratings: {
        coreLoop: sc.ratingsCoreLoop,
        monetization: sc.ratingsMonetization,
        visualUx: sc.ratingsVisualUx,
        retention: sc.ratingsRetention,
        usp: sc.ratingsUsp,
      },
      summary: sc.summary,
      authorId: sc.authorId,
      createdAt: sc.createdAt?.toISOString?.() ?? null,
    })),
    insights: insights.map((ins: any) => ({
      id: ins.id,
      week: ins.week?.toISOString?.() ?? null,
      title: ins.title,
      overallStatus: ins.overallStatus,
      highlights: ins.highlights ?? null,
      risks: ins.risks ?? null,
      actionItems: ins.actionItems ?? null,
      authorId: ins.authorId,
      createdAt: ins.createdAt?.toISOString?.() ?? null,
    })),
    lastUpdated: new Date().toISOString(),
  };
}

function toPrismaStatus(s: string) {
  return s === 'in-testing' ? 'in_testing' : s;
}

export async function saveAllData(sql: NeonQuery, data: any) {
  const payload = { ...data, lastUpdated: new Date().toISOString() };

  for (const p of payload.projects ?? []) {
    await sql`
      INSERT INTO "Project" (id, name, platform, genre, status, color, "createdAt")
      VALUES (${p.id}, ${p.name}, ${p.platform}, ${p.genre}, ${p.status}, ${p.color}, ${p.createdAt ? new Date(p.createdAt) : new Date()})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name, platform = EXCLUDED.platform, genre = EXCLUDED.genre,
        status = EXCLUDED.status, color = EXCLUDED.color
    `;
  }

  for (const m of payload.members ?? []) {
    const email = m.email || `${m.id}@example.com`;
    await sql`
      INSERT INTO "Member" (id, name, email, role, "avatarColor", initials, "joinedAt", password)
      VALUES (${m.id}, ${m.name}, ${email}, ${m.role}, ${m.avatarColor}, ${m.initials}, ${m.joinedAt ? new Date(m.joinedAt) : new Date()}, 'default-sync-password')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role,
        "avatarColor" = EXCLUDED."avatarColor", initials = EXCLUDED.initials
    `;
  }

  for (const s of payload.statuses ?? []) {
    const id = toPrismaStatus(s.id);
    await sql`
      INSERT INTO "StatusConfig" (id, label, color, "order")
      VALUES (${id}, ${s.label}, ${s.color}, ${s.order})
      ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, color = EXCLUDED.color, "order" = EXCLUDED."order"
    `;
  }

  for (const pr of payload.priorities ?? []) {
    await sql`
      INSERT INTO "PriorityConfig" (id, label, color, "defaultWeight")
      VALUES (${pr.id}, ${pr.label}, ${pr.color}, ${pr.defaultWeight})
      ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, color = EXCLUDED.color, "defaultWeight" = EXCLUDED."defaultWeight"
    `;
  }

  for (const t of payload.tasks ?? []) {
    const status = toPrismaStatus(t.status);
    await sql`
      INSERT INTO "Task" (id, title, description, "projectId", "assigneeId", status, priority, weight, deadline, "createdAt", "completedAt",
        "eisenhowerUrgent", "eisenhowerImportant", "eisenhowerAutoClassified", tags, result)
      VALUES (${t.id}, ${t.title}, ${t.description}, ${t.projectId}, ${t.assigneeId}, ${status}, ${t.priority}, ${t.weight},
        ${t.deadline ? new Date(t.deadline) : null}, ${t.createdAt ? new Date(t.createdAt) : new Date()}, ${t.completedAt ? new Date(t.completedAt) : null},
        ${t.eisenhower?.urgent ?? false}, ${t.eisenhower?.important ?? false}, ${t.eisenhower?.autoClassified ?? false},
        ${t.tags ? JSON.stringify(t.tags) : null}, ${t.result ?? null})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title, description = EXCLUDED.description, "projectId" = EXCLUDED."projectId",
        "assigneeId" = EXCLUDED."assigneeId", status = EXCLUDED.status, priority = EXCLUDED.priority,
        weight = EXCLUDED.weight, deadline = EXCLUDED.deadline, "completedAt" = EXCLUDED."completedAt",
        "eisenhowerUrgent" = EXCLUDED."eisenhowerUrgent", "eisenhowerImportant" = EXCLUDED."eisenhowerImportant",
        "eisenhowerAutoClassified" = EXCLUDED."eisenhowerAutoClassified", tags = EXCLUDED.tags, result = EXCLUDED.result
    `;
  }

  for (const sc of payload.scorecards ?? []) {
    await sql`
      INSERT INTO "GameScorecard" (id, "projectId", week, "ratingsCoreLoop", "ratingsMonetization", "ratingsVisualUx", "ratingsRetention", "ratingsUsp", summary, "authorId", "createdAt")
      VALUES (${sc.id}, ${sc.projectId}, ${sc.week ? new Date(sc.week) : new Date()},
        ${sc.ratings?.coreLoop ?? 0}, ${sc.ratings?.monetization ?? 0}, ${sc.ratings?.visualUx ?? 0},
        ${sc.ratings?.retention ?? 0}, ${sc.ratings?.usp ?? 0},
        ${sc.summary}, ${sc.authorId}, ${sc.createdAt ? new Date(sc.createdAt) : new Date()})
      ON CONFLICT (id) DO UPDATE SET
        "projectId" = EXCLUDED."projectId", week = EXCLUDED.week,
        "ratingsCoreLoop" = EXCLUDED."ratingsCoreLoop", "ratingsMonetization" = EXCLUDED."ratingsMonetization",
        "ratingsVisualUx" = EXCLUDED."ratingsVisualUx", "ratingsRetention" = EXCLUDED."ratingsRetention",
        "ratingsUsp" = EXCLUDED."ratingsUsp", summary = EXCLUDED.summary
    `;
  }

  for (const ins of payload.insights ?? []) {
    await sql`
      INSERT INTO "WeeklyInsight" (id, week, title, "overallStatus", highlights, risks, "actionItems", "authorId", "createdAt")
      VALUES (${ins.id}, ${ins.week ? new Date(ins.week) : new Date()}, ${ins.title}, ${ins.overallStatus},
        ${ins.highlights ? JSON.stringify(ins.highlights) : null}, ${ins.risks ? JSON.stringify(ins.risks) : null},
        ${ins.actionItems ? JSON.stringify(ins.actionItems) : null}, ${ins.authorId}, ${ins.createdAt ? new Date(ins.createdAt) : new Date()})
      ON CONFLICT (id) DO UPDATE SET
        week = EXCLUDED.week, title = EXCLUDED.title, "overallStatus" = EXCLUDED."overallStatus",
        highlights = EXCLUDED.highlights, risks = EXCLUDED.risks, "actionItems" = EXCLUDED."actionItems"
    `;
  }

  return payload;
}

// ===== Snapshot Queries =====

function dateToDateOnly(d: Date | string) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toISOString().split('T')[0];
}

export async function saveSnapshot(sql: NeonQuery, data: any) {
  const snapshotDate = dateToDateOnly(new Date());
  await sql`
    INSERT INTO "Snapshot" ("snapshotDate", payload)
    VALUES (${snapshotDate}::date, ${JSON.stringify(data)}::json)
    ON CONFLICT ("snapshotDate") DO UPDATE SET payload = EXCLUDED.payload
  `;
  return `${snapshotDate}.json`;
}

export async function listSnapshots(sql: NeonQuery) {
  const rows = asRows(await sql`SELECT "snapshotDate" FROM "Snapshot" ORDER BY "snapshotDate" DESC`);
  return rows.map((r: any) => dateToDateOnly(r.snapshotDate));
}

export async function loadSnapshot(sql: NeonQuery, date: string) {
  const snapshotDate = dateToDateOnly(date);
  const rows = asRows(await sql`SELECT * FROM "Snapshot" WHERE "snapshotDate" = ${snapshotDate}::date LIMIT 1`);
  if (rows.length === 0) return null;
  const snap = rows[0] as any;
  return { ...snap.payload, snapshotDate };
}

// ===== Research Report Queries =====

export async function saveResearchReport(sql: NeonQuery, report: any) {
  const { id, type, title, packageName, technicalData, interpretation, markdownReport,
    sentimentScore, sentimentSummary, redditMentions, twitterMentions, authorId, createdAt } = report;

  if (id) {
    const rows = asRows(await sql`
      INSERT INTO "ResearchReport" (id, type, title, "packageName", "technicalData", interpretation, "markdownReport",
        "sentimentScore", "sentimentSummary", "redditMentions", "twitterMentions", "authorId", "createdAt")
      VALUES (${id}, ${type}, ${title}, ${packageName ?? null},
        ${technicalData ? JSON.stringify(technicalData) : null}, ${interpretation ? JSON.stringify(interpretation) : null},
        ${markdownReport ?? null}, ${sentimentScore ?? null}, ${sentimentSummary ?? null},
        ${redditMentions ? JSON.stringify(redditMentions) : null}, ${twitterMentions ? JSON.stringify(twitterMentions) : null},
        ${authorId ?? null}, ${createdAt ? new Date(createdAt) : new Date()})
      ON CONFLICT (id) DO UPDATE SET
        type = EXCLUDED.type, title = EXCLUDED.title, "packageName" = EXCLUDED."packageName",
        "technicalData" = EXCLUDED."technicalData", interpretation = EXCLUDED.interpretation,
        "markdownReport" = EXCLUDED."markdownReport", "sentimentScore" = EXCLUDED."sentimentScore",
        "sentimentSummary" = EXCLUDED."sentimentSummary", "redditMentions" = EXCLUDED."redditMentions",
        "twitterMentions" = EXCLUDED."twitterMentions"
      RETURNING *
    `);
    return rows[0];
  } else {
    const rows = asRows(await sql`
      INSERT INTO "ResearchReport" (type, title, "packageName", "technicalData", interpretation, "markdownReport",
        "sentimentScore", "sentimentSummary", "redditMentions", "twitterMentions", "authorId")
      VALUES (${type}, ${title}, ${packageName ?? null},
        ${technicalData ? JSON.stringify(technicalData) : null}, ${interpretation ? JSON.stringify(interpretation) : null},
        ${markdownReport ?? null}, ${sentimentScore ?? null}, ${sentimentSummary ?? null},
        ${redditMentions ? JSON.stringify(redditMentions) : null}, ${twitterMentions ? JSON.stringify(twitterMentions) : null},
        ${authorId ?? null})
      RETURNING *
    `);
    return rows[0];
  }
}

export async function listResearchReports(sql: NeonQuery) {
  return asRows(await sql`SELECT * FROM "ResearchReport" ORDER BY "createdAt" DESC`);
}

export async function loadResearchReport(sql: NeonQuery, id: string) {
  const rows = asRows(await sql`SELECT * FROM "ResearchReport" WHERE id = ${id} LIMIT 1`);
  return rows[0] || null;
}
