import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../src/generated/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DATA_FILE = path.join(ROOT_DIR, 'backend', 'src', 'data', 'app-data.json');
const SNAPSHOT_DIR = path.join(ROOT_DIR, 'backend', 'src', 'data', 'snapshots');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL env var is required');
  process.exit(1);
}
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function parseIsoDate(d: unknown) {
  if (!d) return null;
  // Accept YYYY-MM-DD or full ISO
  return new Date(d);
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log(`No data file found at: ${DATA_FILE}`);
    return;
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const appData = JSON.parse(raw);

  // Import core tables
  // Use upsert by id to keep rerunnable.

  for (const p of appData.projects ?? []) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        platform: p.platform,
        genre: p.genre,
        status: p.status,
        color: p.color,
        createdAt: parseIsoDate(p.createdAt) ?? new Date(),
      },
      create: {
        id: p.id,
        name: p.name,
        platform: p.platform,
        genre: p.genre,
        status: p.status,
        color: p.color,
        createdAt: parseIsoDate(p.createdAt) ?? new Date(),
      },
    });
  }

  for (const m of appData.members ?? []) {
    await prisma.member.upsert({
      where: { id: m.id },
      update: {
        name: m.name,
        role: m.role,
        avatarColor: m.avatarColor,
        initials: m.initials,
        joinedAt: parseIsoDate(m.joinedAt) ?? new Date(),
      },
      create: {
        id: m.id,
        name: m.name,
        role: m.role,
        avatarColor: m.avatarColor,
        initials: m.initials,
        joinedAt: parseIsoDate(m.joinedAt) ?? new Date(),
      },
    });
  }

  // configs
  for (const s of appData.statuses ?? []) {
    await prisma.statusConfig.upsert({
      where: { id: s.id },
      update: { label: s.label, color: s.color, order: s.order },
      create: { id: s.id, label: s.label, color: s.color, order: s.order },
    });
  }

  for (const pr of appData.priorities ?? []) {
    await prisma.priorityConfig.upsert({
      where: { id: pr.id },
      update: {
        label: pr.label,
        color: pr.color,
        defaultWeight: pr.defaultWeight,
      },
      create: {
        id: pr.id,
        label: pr.label,
        color: pr.color,
        defaultWeight: pr.defaultWeight,
      },
    });
  }

  for (const t of appData.tasks ?? []) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {
        title: t.title,
        description: t.description,
        projectId: t.projectId,
        assigneeId: t.assigneeId,
        status: t.status,
        priority: t.priority,
        weight: t.weight,
        deadline: t.deadline ? parseIsoDate(t.deadline) : null,
        createdAt: parseIsoDate(t.createdAt) ?? new Date(),
        completedAt: t.completedAt ? parseIsoDate(t.completedAt) : null,
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
        deadline: t.deadline ? parseIsoDate(t.deadline) : null,
        createdAt: parseIsoDate(t.createdAt) ?? new Date(),
        completedAt: t.completedAt ? parseIsoDate(t.completedAt) : null,
        eisenhowerUrgent: t.eisenhower?.urgent ?? false,
        eisenhowerImportant: t.eisenhower?.important ?? false,
        eisenhowerAutoClassified: t.eisenhower?.autoClassified ?? false,
        tags: t.tags ?? null,
      },
    });
  }

  for (const sc of appData.scorecards ?? []) {
    await prisma.gameScorecard.upsert({
      where: { id: sc.id },
      update: {
        projectId: sc.projectId,
        week: parseIsoDate(sc.week) ?? new Date(),
        ratingsCoreLoop: sc.ratings.coreLoop,
        ratingsMonetization: sc.ratings.monetization,
        ratingsVisualUx: sc.ratings.visualUx,
        ratingsRetention: sc.ratings.retention,
        ratingsUsp: sc.ratings.usp,
        summary: sc.summary,
        authorId: sc.authorId,
        createdAt: parseIsoDate(sc.createdAt) ?? new Date(),
      },
      create: {
        id: sc.id,
        projectId: sc.projectId,
        week: parseIsoDate(sc.week) ?? new Date(),
        ratingsCoreLoop: sc.ratings.coreLoop,
        ratingsMonetization: sc.ratings.monetization,
        ratingsVisualUx: sc.ratings.visualUx,
        ratingsRetention: sc.ratings.retention,
        ratingsUsp: sc.ratings.usp,
        summary: sc.summary,
        authorId: sc.authorId,
        createdAt: parseIsoDate(sc.createdAt) ?? new Date(),
      },
    });
  }

  for (const ins of appData.insights ?? []) {
    await prisma.weeklyInsight.upsert({
      where: { id: ins.id },
      update: {
        week: parseIsoDate(ins.week) ?? new Date(),
        title: ins.title,
        overallStatus: ins.overallStatus,
        highlights: ins.highlights ?? null,
        risks: ins.risks ?? null,
        actionItems: ins.actionItems ?? null,
        authorId: ins.authorId,
        createdAt: parseIsoDate(ins.createdAt) ?? new Date(),
      },
      create: {
        id: ins.id,
        week: parseIsoDate(ins.week) ?? new Date(),
        title: ins.title,
        overallStatus: ins.overallStatus,
        highlights: ins.highlights ?? null,
        risks: ins.risks ?? null,
        actionItems: ins.actionItems ?? null,
        authorId: ins.authorId,
        createdAt: parseIsoDate(ins.createdAt) ?? new Date(),
      },
    });
  }

  // snapshots
  if (fs.existsSync(SNAPSHOT_DIR)) {
    const files = fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const datePart = f.replace(/\.json$/, '');
      const snapshotDate = new Date(datePart);
      const rawSnap = fs.readFileSync(path.join(SNAPSHOT_DIR, f), 'utf-8');
      const payload = JSON.parse(rawSnap);

      await prisma.snapshot.upsert({
        where: { snapshotDate },
        update: { payload },
        create: { snapshotDate, payload },
      });
    }
  }

  console.log('Import completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

