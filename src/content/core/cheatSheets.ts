import type { CheatSheet } from '../../types/content'

export const cheatSheets: CheatSheet[] = [
  {
    id: 'python-live-coding-patterns',
    title: 'Python live coding patterns',
    tags: ['python', 'live-coding'],
    sections: [
      {
        title: 'Before coding',
        points: ['Restate input and output.', 'Clarify malformed rows, duplicates, ordering and money precision.', 'Name the brute force idea before the optimized data structure.'],
      },
      {
        title: 'Core patterns',
        points: ['Use dict/defaultdict for grouping.', 'Use set for deduplication.', 'Use sorted with tuple keys for deterministic output.', 'Use topological sort for dependency ordering.'],
      },
      {
        title: 'Finish strongly',
        points: ['Run through one edge case.', 'State complexity.', 'Mention production concerns such as Decimal, idempotency or constraints.'],
      },
    ],
  },
  {
    id: 'django-orm',
    title: 'Django ORM',
    tags: ['django', 'orm'],
    sections: [
      {
        title: 'QuerySet basics',
        points: ['QuerySets are lazy and composable.', 'Evaluation happens on iteration, list(), count(), exists(), slicing with step or serialization.', 'Keep filtering in the database for large data.'],
      },
      {
        title: 'Relationships',
        points: ['select_related for ForeignKey and OneToOne.', 'prefetch_related for reverse FK and ManyToMany.', 'Use Prefetch for filtered related collections.'],
      },
      {
        title: 'Calculations',
        points: ['aggregate for whole-query totals.', 'annotate for per-row or grouped computed fields.', 'Check SQL when joins can multiply rows.'],
      },
    ],
  },
  {
    id: 'django-transactions',
    title: 'Django transactions',
    tags: ['django', 'transactions'],
    sections: [
      {
        title: 'Principles',
        points: ['Use transaction.atomic for multi-step writes that must commit together.', 'Keep transactions short.', 'Do not call external services while holding locks.'],
      },
      {
        title: 'Jobs',
        points: ['Enqueue background work with transaction.on_commit.', 'Make workers idempotent.', 'Store job state and retry metadata.'],
      },
      {
        title: 'Concurrency',
        points: ['Use F expressions for counters.', 'Use select_for_update for critical row updates.', 'Use unique constraints for deduplication.'],
      },
    ],
  },
  {
    id: 'sql-performance',
    title: 'SQL performance',
    tags: ['sql', 'postgresql'],
    sections: [
      {
        title: 'Measure',
        points: ['Start with slow query logs, traces or endpoint metrics.', 'Use EXPLAIN ANALYZE with BUFFERS in safe environments.', 'Compare estimated and actual rows.'],
      },
      {
        title: 'Fixes',
        points: ['Add indexes based on filters, joins and ordering.', 'Rewrite row-multiplying joins before aggregation.', 'Use keyset pagination for deep pages.', 'Consider materialized views for repeated expensive aggregations.'],
      },
      {
        title: 'SaaS safeguards',
        points: ['Tenant_id is usually part of critical indexes.', 'Cache keys must include tenant and permission context.', 'Avoid unbounded report queries.'],
      },
    ],
  },
  {
    id: 'system-design-checklist',
    title: 'System design checklist',
    tags: ['system-design'],
    sections: [
      {
        title: 'Open',
        points: ['Clarify users, goals, data volume, latency, consistency and failure tolerance.', 'Define core entities and workflows before components.', 'State assumptions explicitly.'],
      },
      {
        title: 'Design',
        points: ['Separate write path, read path and background jobs.', 'Choose data model and APIs.', 'Address tenant isolation, permissions and auditability.'],
      },
      {
        title: 'Close',
        points: ['Discuss scaling, failure modes, observability and trade-offs.', 'Summarize why the design meets the requirements.'],
      },
    ],
  },
  {
    id: 'behavioral-star',
    title: 'Behavioral answer structure',
    tags: ['behavioral'],
    sections: [
      {
        title: 'STAR',
        points: ['Situation: one or two sentences of context.', 'Task: the responsibility or problem.', 'Action: what you personally did.', 'Result: measurable or concrete outcome.'],
      },
      {
        title: 'Senior signal',
        points: ['Name trade-offs.', 'Show communication.', 'Explain what you learned or changed afterward.', 'Tie technical work to product value.'],
      },
    ],
  },
  {
    id: 'kafka-basics',
    title: 'Kafka basics',
    tags: ['kafka'],
    sections: [
      {
        title: 'Vocabulary',
        points: ['Topic: named event stream.', 'Partition: ordered log and unit of parallelism.', 'Consumer group: consumers sharing partition work.', 'Offset: position in a partition.'],
      },
      {
        title: 'Design',
        points: ['Pick partition key for ordering and distribution.', 'Use idempotent consumers.', 'Monitor lag and DLQs.', 'Version schemas.'],
      },
      {
        title: 'Migration',
        points: ['Use producer abstraction.', 'Dual-run or bridge carefully.', 'Compare outputs.', 'Have rollback and observability.'],
      },
    ],
  },
  {
    id: 'aws-backend-basics',
    title: 'AWS backend basics',
    tags: ['aws'],
    sections: [
      {
        title: 'Core services',
        points: ['RDS PostgreSQL for managed relational storage.', 'S3 for durable objects and exports.', 'SQS for queues.', 'CloudWatch for logs and metrics.', 'IAM for permissions.'],
      },
      {
        title: 'Production habits',
        points: ['Least privilege IAM.', 'Timeouts and retries.', 'Alarms and dashboards.', 'Secrets outside code.', 'Cost monitoring.'],
      },
    ],
  },
  {
    id: 'fastapi-to-django',
    title: 'FastAPI to Django translation',
    tags: ['fastapi', 'django'],
    sections: [
      {
        title: 'Translate concepts',
        points: ['FastAPI router maps to Django app/api module.', 'Pydantic schemas map to serializers/forms or service DTOs.', 'Depends maps to middleware, decorators or explicit service parameters.', 'SQLAlchemy/repository habits map to QuerySet discipline.'],
      },
      {
        title: 'Interview angle',
        points: ['Do not apologize for FastAPI strength.', 'Show Django-specific refresh: ORM, migrations, transactions, testing.', 'Emphasize backend principles that transfer.'],
      },
    ],
  },
]
