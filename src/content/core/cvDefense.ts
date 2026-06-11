import type { CvDefenseCard } from '../../types/content'

export const cvDefenseCards: CvDefenseCard[] = [
  {
    id: 'rabbitmq-to-kafka',
    title: 'RabbitMQ to Kafka migration',
    likelyChallenge: 'What exactly did you lead or propose, and why was Kafka the right choice?',
    strongAnswer:
      'I evaluated the platform needs around throughput, replayability, consumer scaling and operational visibility. The recommendation was not "Kafka because Kafka"; it was an incremental migration with idempotent consumers, schema discipline, partition strategy, metrics and rollback.',
    technicalDetails: ['RabbitMQ exchange/queue semantics vs Kafka topic/partition/offset semantics.', 'Consumer groups, partition keys and ordering guarantees.', 'Transactional outbox and idempotent consumers.', 'Lag, DLQ and throughput monitoring.'],
    metricsToClarify: ['Baseline throughput.', 'Target throughput.', 'Consumer lag before/after.', 'Failure or retry reduction.'],
    risksIfOverstated: ['Claiming sole ownership if it was team-led.', 'Implying exactly-once behavior without explaining boundaries.', 'Ignoring operational complexity.'],
    followUpQuestions: ['How did you choose partition keys?', 'How did you handle duplicate delivery?', 'How would you roll back?'],
    practicePrompt: 'Explain the migration in two minutes, then answer why not simply tune RabbitMQ.',
  },
  {
    id: 'events-100k',
    title: '100K+ events/sec',
    likelyChallenge: 'Was that sustained throughput, peak throughput, or a target?',
    strongAnswer:
      'I would clarify the measurement first: peak vs sustained, where it was measured, payload size and downstream processing. Then I would explain the architecture choices that made the throughput feasible and what bottlenecks we monitored.',
    technicalDetails: ['Batching and backpressure.', 'Consumer parallelism.', 'Serialization cost.', 'Database write amplification.', 'Lag and end-to-end latency.'],
    metricsToClarify: ['Peak vs sustained events/sec.', 'Payload size.', 'P95 processing latency.', 'Error rate and retry volume.'],
    risksIfOverstated: ['Using a headline number without context.', 'Confusing broker throughput with business processing throughput.', 'Not knowing how it was measured.'],
    followUpQuestions: ['Where was the bottleneck?', 'How did you test load?', 'How did the system degrade?'],
    practicePrompt: 'Defend the 100K+ number with measurement context and caveats.',
  },
  {
    id: 'mcp-rag',
    title: 'MCP server with RAG',
    likelyChallenge: 'What problem did MCP solve, and how did you keep RAG grounded?',
    strongAnswer:
      'The MCP server exposed controlled tools/resources to the assistant, while RAG provided relevant context. The important engineering work was permission-aware retrieval, context quality, model/tool boundaries, evaluation and failure handling.',
    technicalDetails: ['Chunking strategy.', 'Embedding refresh.', 'Retriever filters.', 'Tool invocation boundaries.', 'Citation and evaluation strategy.'],
    metricsToClarify: ['Answer quality evaluation method.', 'Latency.', 'Retrieval hit rate.', 'User feedback or adoption.'],
    risksIfOverstated: ['Saying it "understands everything".', 'Ignoring hallucination and permissions.', 'No evaluation story.'],
    followUpQuestions: ['How did you handle prompt injection?', 'How were documents updated?', 'When would you avoid RAG?'],
    practicePrompt: 'Explain the architecture to a CTO who worries about data leaks.',
  },
  {
    id: 'aws-bedrock',
    title: 'AWS Bedrock integration',
    likelyChallenge: 'Why Bedrock, and what production concerns did you handle?',
    strongAnswer:
      'Bedrock was useful when we wanted managed access to foundation models inside AWS boundaries. I focused on request shaping, latency, cost, error handling, observability and safe fallback behavior.',
    technicalDetails: ['Model selection trade-offs.', 'Token/cost controls.', 'Retries and timeouts.', 'IAM permissions.', 'Logging without leaking sensitive prompts.'],
    metricsToClarify: ['Latency per model.', 'Cost per request.', 'Failure rate.', 'Quality evaluation.'],
    risksIfOverstated: ['Treating model choice as purely technical.', 'No cost controls.', 'Logging sensitive data.'],
    followUpQuestions: ['How did you evaluate outputs?', 'How did you cap spend?', 'How did you handle provider errors?'],
    practicePrompt: 'Give a concise production-readiness checklist for Bedrock usage.',
  },
  {
    id: 'multi-tenant-streaming-platform',
    title: 'Multi-tenant streaming platform',
    likelyChallenge: 'How did you isolate tenants and avoid noisy-neighbor problems?',
    strongAnswer:
      'I would explain tenant scoping in data model, auth, topic/partition strategy where relevant, rate limits, observability by tenant and safeguards against cross-tenant access.',
    technicalDetails: ['Tenant-aware authorization.', 'Partitioning and resource quotas.', 'Per-tenant metrics.', 'Backpressure and throttling.', 'Data retention and deletion.'],
    metricsToClarify: ['Tenants supported.', 'Throughput per tenant.', 'Isolation incidents.', 'Latency under load.'],
    risksIfOverstated: ['Only discussing infrastructure isolation.', 'No permission model.', 'No noisy-neighbor strategy.'],
    followUpQuestions: ['How did you test tenant isolation?', 'How did you handle a hot tenant?', 'What data was shared?'],
    practicePrompt: 'Describe tenant isolation from request to storage to observability.',
  },
  {
    id: 'aws-media-pipeline',
    title: 'AWS MediaLive/MediaPackage/CloudFront/Lambda@Edge pipeline',
    likelyChallenge: 'What was your role in the media pipeline and what were the hard parts?',
    strongAnswer:
      'I would focus on the backend responsibilities: orchestration, configuration, deployment, monitoring, edge behavior, reliability and cost/performance trade-offs rather than claiming deep ownership of every AWS service.',
    technicalDetails: ['Live channel lifecycle.', 'CloudFront caching behavior.', 'Lambda@Edge constraints.', 'IAM and deployment flow.', 'Monitoring and incident response.'],
    metricsToClarify: ['Stream count.', 'Latency.', 'Availability.', 'Cost or performance improvements.'],
    risksIfOverstated: ['Claiming specialist-level media expertise if the role was backend orchestration.', 'Ignoring operational complexity.', 'No failure-mode discussion.'],
    followUpQuestions: ['How did you deploy Lambda@Edge?', 'How did cache invalidation work?', 'What happened on stream failure?'],
    practicePrompt: 'Explain this project as backend reliability work, not a list of AWS services.',
  },
  {
    id: 'postgres-optimization',
    title: 'PostgreSQL optimization',
    likelyChallenge: 'How did you know what to optimize?',
    strongAnswer:
      'I started with measurement: slow query logs, EXPLAIN ANALYZE, endpoint traces and real usage patterns. Then I applied targeted fixes such as indexes, query rewrites, batching, pagination or denormalized read models.',
    technicalDetails: ['EXPLAIN ANALYZE basics.', 'Composite indexes.', 'N+1 detection.', 'Keyset pagination.', 'Transaction and lock awareness.'],
    metricsToClarify: ['Before/after latency.', 'Rows scanned.', 'Query frequency.', 'Index size/write impact.'],
    risksIfOverstated: ['Saying "added an index" without plan evidence.', 'Ignoring write overhead.', 'No before/after metric.'],
    followUpQuestions: ['What did the query plan show?', 'Why that index order?', 'Did performance regress elsewhere?'],
    practicePrompt: 'Walk through one optimization from symptom to measurement to fix.',
  },
  {
    id: 'kubernetes-helm-gitlab',
    title: 'Kubernetes/Helm/GitLab CI/CD',
    likelyChallenge: 'Were you maintaining platform infrastructure or using it to ship services?',
    strongAnswer:
      'I used Kubernetes, Helm and GitLab CI/CD to make backend services deployable and observable. I can discuss charts, environment configuration, rollout safety, health checks and pipeline quality without overstating platform ownership.',
    technicalDetails: ['Helm values and templates.', 'Readiness/liveness probes.', 'Rollout and rollback.', 'Secrets/config management.', 'Pipeline stages and gates.'],
    metricsToClarify: ['Deployment frequency.', 'Rollback time.', 'Build duration.', 'Incident reduction.'],
    risksIfOverstated: ['Claiming SRE ownership if you mainly consumed the platform.', 'No security/secrets story.', 'No rollback plan.'],
    followUpQuestions: ['How did you structure Helm values?', 'What broke in deployment?', 'How did you handle migrations?'],
    practicePrompt: 'Explain how CI/CD protected backend delivery quality.',
  },
  {
    id: 'clean-architecture-python-fastapi',
    title: 'Clean architecture in Python/FastAPI',
    likelyChallenge: 'What does clean architecture mean in your actual code?',
    strongAnswer:
      'For me it means handlers stay thin, domain workflows are testable, infrastructure dependencies are explicit, and the codebase can change frameworks or persistence details where that flexibility is worth the cost.',
    technicalDetails: ['Routers/controllers vs services/use cases.', 'DTO/schema boundaries.', 'Repository trade-offs.', 'Dependency injection.', 'Testing without HTTP.'],
    metricsToClarify: ['Test speed.', 'Change lead time.', 'Defects prevented.', 'Areas where abstraction paid off.'],
    risksIfOverstated: ['Over-engineering small services.', 'Abstracting the ORM without value.', 'Architecture jargon without examples.'],
    followUpQuestions: ['Where did you put business logic?', 'What abstraction did you remove?', 'How does this map to Django?'],
    practicePrompt: 'Explain clean architecture with one concrete endpoint and its test strategy.',
  },
]
