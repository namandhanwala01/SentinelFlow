async function runVerification() {
  const base = 'http://localhost:5000/api/v1';
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}${details ? ` - ${details}` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}${details ? ` - ${details}` : ''}`);
      failed++;
    }
  }

  console.log('\n==================================================');
  console.log('🛡️  SENTINELFLOW AI — SYSTEM ENDPOINT VERIFICATION');
  console.log('==================================================\n');

  // 1. Healthcheck
  console.log('--- 1. Healthcheck ---');
  try {
    const res = await fetch(`${base}/health`);
    const data = await res.json();
    assert('GET /health', res.status === 200 && data.status === 'online', `Service: ${data.service}`);
  } catch (err: any) {
    assert('GET /health', false, err.message);
  }

  // 2. Threats Metrics
  console.log('\n--- 2. Threats & Metrics ---');
  try {
    const res = await fetch(`${base}/threats/metrics`);
    const data = await res.json();
    assert('GET /threats/metrics', res.status === 200 && data.success, `Total Threats: ${data.data?.totalThreats}`);
  } catch (err: any) {
    assert('GET /threats/metrics', false, err.message);
  }

  // 3. Threats List & Filtering
  try {
    const res = await fetch(`${base}/threats?risk=HIGH`);
    const data = await res.json();
    assert('GET /threats (filtered)', res.status === 200 && Array.isArray(data.data), `Count: ${data.count}`);
  } catch (err: any) {
    assert('GET /threats', false, err.message);
  }

  // 4. Single Threat Retrieval
  try {
    const res = await fetch(`${base}/threats/THREAT-001`);
    const data = await res.json();
    assert('GET /threats/THREAT-001', res.status === 200 && data.data?.id === 'THREAT-001', `Name: ${data.data?.name}`);
  } catch (err: any) {
    assert('GET /threats/:id', false, err.message);
  }

  // 5. Threat Status Update
  try {
    const res = await fetch(`${base}/threats/THREAT-001/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Investigating' }),
    });
    const data = await res.json();
    assert('PATCH /threats/THREAT-001/status', res.status === 200 && data.data?.status === 'Investigating', `Status: ${data.data?.status}`);
  } catch (err: any) {
    assert('PATCH /threats/:id/status', false, err.message);
  }

  // 6. Events Telemetry Stream
  console.log('\n--- 3. Events Telemetry Stream ---');
  try {
    const res = await fetch(`${base}/events?limit=5`);
    const data = await res.json();
    assert('GET /events', res.status === 200 && Array.isArray(data.events), `Total: ${data.total}, Page: ${data.page}`);
  } catch (err: any) {
    assert('GET /events', false, err.message);
  }

  // 7. Event Ingestion Pipeline
  try {
    const res = await fetch(`${base}/events/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event_type: 'login',
        user: 'svc_backup_admin',
        source_ip: '194.26.29.114',
        destination_host: 'DC-01',
        destination_ip: '10.0.4.12',
        status: 'failed',
        severity: 'HIGH',
        device: 'Suricata IDS',
      }),
    });
    const data = await res.json();
    assert('POST /events/ingest', res.status === 201 && data.success, `Threat detected: ${data.threatDetected}`);
  } catch (err: any) {
    assert('POST /events/ingest', false, err.message);
  }

  // 8. Systems Inventory
  console.log('\n--- 4. Monitored Systems Inventory ---');
  try {
    const res = await fetch(`${base}/systems`);
    const data = await res.json();
    assert('GET /systems', res.status === 200 && Array.isArray(data.data), `Systems count: ${data.count}`);
  } catch (err: any) {
    assert('GET /systems', false, err.message);
  }

  // 9. AI Forecasting
  console.log('\n--- 5. AI Forecasting Engine ---');
  try {
    const res = await fetch(`${base}/forecast/THREAT-001`);
    const data = await res.json();
    assert('GET /forecast/THREAT-001', res.status === 200 && data.success, `Next stage: ${data.nextLikelyStage} (${data.nextLikelyProbability}%)`);
  } catch (err: any) {
    assert('GET /forecast/:id', false, err.message);
  }

  // 10. AI Explainability
  console.log('\n--- 6. AI Explainability Engine ---');
  try {
    const res = await fetch(`${base}/explainability/THREAT-001`);
    const data = await res.json();
    assert('GET /explainability/THREAT-001', res.status === 200 && data.success, `Factors count: ${data.contributingFactors?.length}`);
  } catch (err: any) {
    assert('GET /explainability/:id', false, err.message);
  }

  // 11. What-If Simulation
  console.log('\n--- 7. What-If Defense Simulator ---');
  try {
    const res = await fetch(`${base}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threatId: 'THREAT-001', actionIds: ['block_ip', 'force_pwd_reset'] }),
    });
    const data = await res.json();
    assert('POST /simulate', res.status === 200 && data.data?.projectedRiskScore !== undefined, `Baseline: ${data.data?.baselineRiskScore} -> Projected: ${data.data?.projectedRiskScore} (-${data.data?.totalRiskReductionPercent}%)`);
  } catch (err: any) {
    assert('POST /simulate', false, err.message);
  }

  // 12. Recommendations Engine
  console.log('\n--- 8. Prioritized Recommendations ---');
  try {
    const res = await fetch(`${base}/recommendations/THREAT-001`);
    const data = await res.json();
    assert('GET /recommendations/THREAT-001', res.status === 200 && data.success, `Recs count: ${data.recommendations?.length}`);
  } catch (err: any) {
    assert('GET /recommendations/:id', false, err.message);
  }

  // 13. Simulator Scenarios & Execution
  console.log('\n--- 9. Security Event Simulator Scenarios ---');
  try {
    const res = await fetch(`${base}/simulator/scenarios`);
    const data = await res.json();
    assert('GET /simulator/scenarios', res.status === 200 && data.count === 8, `8 scenarios available`);
  } catch (err: any) {
    assert('GET /simulator/scenarios', false, err.message);
  }

  try {
    const res = await fetch(`${base}/simulator/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: 'multi_stage_attack' }),
    });
    const data = await res.json();
    assert('POST /simulator/trigger (multi_stage_attack)', res.status === 200 && data.success, `Events generated: ${data.data?.eventsGeneratedCount}`);
  } catch (err: any) {
    assert('POST /simulator/trigger', false, err.message);
  }

  console.log('\n==================================================');
  console.log(`TOTAL VERIFIED: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('[Verification Script Error]:', err);
  process.exit(1);
});
