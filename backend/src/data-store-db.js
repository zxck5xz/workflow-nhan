import { PrismaClient } from './generated/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma = null;

function getPrisma() {
  if (prisma) return prisma;
  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  return prisma;
}

function dateToDateOnly(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().split('T')[0];
}

function toAppDataPayload(db) {
  return {
    projects: db.projects,
    members: db.members,
    tasks: db.tasks,
    statuses: db.statuses,
    priorities: db.priorities,
    scorecards: db.scorecards,
    insights: db.insights,
    lastUpdated: new Date().toISOString(),
  };
}

export class DataStoreDB {
  constructor() {
    // no-op
  }

  async loadData() {
    const p = getPrisma();
    const [
      projects,
      members,
      tasks,
      statuses,
      priorities,
      scorecards,
      insights,
    ] = await Promise.all([
      p.project.findMany({ orderBy: { createdAt: 'asc' } }),
      p.member.findMany({ orderBy: { joinedAt: 'asc' } }),
      p.task.findMany({ orderBy: { createdAt: 'asc' } }),
      p.statusConfig.findMany({ orderBy: { order: 'asc' } }),
      p.priorityConfig.findMany({ orderBy: { defaultWeight: 'desc' } }),
      p.gameScorecard.findMany({ orderBy: { week: 'asc' } }),
      p.weeklyInsight.findMany({ orderBy: { week: 'asc' } }),
    ]);

    return toAppDataPayload({
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        platform: p.platform,
        genre: p.genre,
        status: p.status,
        color: p.color,
        createdAt: p.createdAt?.toISOString?.() ?? null,
      })),
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatarColor: m.avatarColor,
        initials: m.initials,
        joinedAt: m.joinedAt?.toISOString?.() ?? null,
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        projectId: t.projectId,
        assigneeId: t.assigneeId,
        status: t.status,
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
      statuses: statuses.map((s) => ({
        id: s.id,
        label: s.label,
        color: s.color,
        order: s.order,
      })),
      priorities: priorities.map((pr) => ({
        id: pr.id,
        label: pr.label,
        color: pr.color,
        defaultWeight: pr.defaultWeight,
      })),
      scorecards: scorecards.map((sc) => ({
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
      insights: insights.map((ins) => ({
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
    });
  }

  async saveData(data) {
    const payload = { ...data, lastUpdated: new Date().toISOString() };

    const p = getPrisma();
    await p.$transaction(async (tx) => {
      // projects
      for (const p of payload.projects ?? []) {
        await tx.project.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            platform: p.platform,
            genre: p.genre,
            status: p.status,
            color: p.color,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          },
          create: {
            id: p.id,
            name: p.name,
            platform: p.platform,
            genre: p.genre,
            status: p.status,
            color: p.color,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          },
        });
      }

      // members
      for (const m of payload.members ?? []) {
        await tx.member.upsert({
          where: { id: m.id },
          update: {
            name: m.name,
            role: m.role,
            avatarColor: m.avatarColor,
            initials: m.initials,
            joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
          },
          create: {
            id: m.id,
            name: m.name,
            role: m.role,
            avatarColor: m.avatarColor,
            initials: m.initials,
            joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
          },
        });
      }

      // status configs
      for (const s of payload.statuses ?? []) {
        await tx.statusConfig.upsert({
          where: { id: s.id },
          update: { label: s.label, color: s.color, order: s.order },
          create: { id: s.id, label: s.label, color: s.color, order: s.order },
        });
      }

      // priority configs
      for (const pr of payload.priorities ?? []) {
        await tx.priorityConfig.upsert({
          where: { id: pr.id },
          update: { label: pr.label, color: pr.color, defaultWeight: pr.defaultWeight },
          create: {
            id: pr.id,
            label: pr.label,
            color: pr.color,
            defaultWeight: pr.defaultWeight,
          },
        });
      }

      // tasks
      for (const t of payload.tasks ?? []) {
        await tx.task.upsert({
          where: { id: t.id },
          update: {
            title: t.title,
            description: t.description,
            projectId: t.projectId,
            assigneeId: t.assigneeId,
            status: t.status,
            priority: t.priority,
            weight: t.weight,
            deadline: t.deadline ? new Date(t.deadline) : null,
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            completedAt: t.completedAt ? new Date(t.completedAt) : null,
            eisenhowerUrgent: t.eisenhower?.urgent ?? false,
            eisenhowerImportant: t.eisenhower?.important ?? false,
            eisenhowerAutoClassified: t.eisenhower?.autoClassified ?? false,
            tags: t.tags ?? null,
          },
          create: {
            id: t.id,
            title: t.title,
            description: t.description,
            projectId: t.projectId,
            assigneeId: t.assigneeId,
            status: t.status,
            priority: t.priority,
            weight: t.weight,
            deadline: t.deadline ? new Date(t.deadline) : null,
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            completedAt: t.completedAt ? new Date(t.completedAt) : null,
            eisenhowerUrgent: t.eisenhower?.urgent ?? false,
            eisenhowerImportant: t.eisenhower?.important ?? false,
            eisenhowerAutoClassified: t.eisenhower?.autoClassified ?? false,
            tags: t.tags ?? null,
          },
        });
      }

      // scorecards
      for (const sc of payload.scorecards ?? []) {
        await tx.gameScorecard.upsert({
          where: { id: sc.id },
          update: {
            projectId: sc.projectId,
            week: sc.week ? new Date(sc.week) : new Date(),
            ratingsCoreLoop: sc.ratings?.coreLoop ?? 0,
            ratingsMonetization: sc.ratings?.monetization ?? 0,
            ratingsVisualUx: sc.ratings?.visualUx ?? 0,
            ratingsRetention: sc.ratings?.retention ?? 0,
            ratingsUsp: sc.ratings?.usp ?? 0,
            summary: sc.summary,
            authorId: sc.authorId,
            createdAt: sc.createdAt ? new Date(sc.createdAt) : new Date(),
          },
          create: {
            id: sc.id,
            projectId: sc.projectId,
            week: sc.week ? new Date(sc.week) : new Date(),
            ratingsCoreLoop: sc.ratings?.coreLoop ?? 0,
            ratingsMonetization: sc.ratings?.monetization ?? 0,
            ratingsVisualUx: sc.ratings?.visualUx ?? 0,
            ratingsRetention: sc.ratings?.retention ?? 0,
            ratingsUsp: sc.ratings?.usp ?? 0,
            summary: sc.summary,
            authorId: sc.authorId,
            createdAt: sc.createdAt ? new Date(sc.createdAt) : new Date(),
          },
        });
      }

      // insights
      for (const ins of payload.insights ?? []) {
        await tx.weeklyInsight.upsert({
          where: { id: ins.id },
          update: {
            week: ins.week ? new Date(ins.week) : new Date(),
            title: ins.title,
            overallStatus: ins.overallStatus,
            highlights: ins.highlights ?? null,
            risks: ins.risks ?? null,
            actionItems: ins.actionItems ?? null,
            authorId: ins.authorId,
            createdAt: ins.createdAt ? new Date(ins.createdAt) : new Date(),
          },
          create: {
            id: ins.id,
            week: ins.week ? new Date(ins.week) : new Date(),
            title: ins.title,
            overallStatus: ins.overallStatus,
            highlights: ins.highlights ?? null,
            risks: ins.risks ?? null,
            actionItems: ins.actionItems ?? null,
            authorId: ins.authorId,
            createdAt: ins.createdAt ? new Date(ins.createdAt) : new Date(),
          },
        });
      }

      // NOTE: we intentionally do not delete missing rows for now,
      // to avoid accidental destructive updates from partial payloads.
    });

    return payload;
  }

  async saveSnapshot(data) {
    const snapshotDate = dateToDateOnly(new Date());
    // keep same contract: return snapshotFile-like string
    const p = getPrisma();
    await p.snapshot.upsert({
      where: { snapshotDate },
      update: { payload: data },
      create: { snapshotDate, payload: data },
    });

    return `${snapshotDate}.json`;
  }

  async listSnapshots() {
    const p = getPrisma();
    const rows = await p.snapshot.findMany({
      select: { snapshotDate: true },
      orderBy: { snapshotDate: 'desc' },
    });
    return rows.map((r) => dateToDateOnly(r.snapshotDate));
  }

  async loadSnapshot(date) {
    const snapshotDate = dateToDateOnly(date);
    const p = getPrisma();
    const snap = await p.snapshot.findUnique({ where: { snapshotDate } });
    if (!snap) return null;
    return { ...snap.payload, snapshotDate };
  }
}

