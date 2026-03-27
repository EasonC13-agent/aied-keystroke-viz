import Link from "next/link";

export default function VueExamplePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://github.com/EasonC13-agent/aied-keystroke-viz/tree/main/examples/vue" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/docs/vue" style={{ color: "var(--accent)" }}>Full Documentation ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Vue 3 Example</h1>
      <p className="mb-6">A Vue 3 composition API example with reactive keystroke tracking and form submission.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">TrackedQuestion.vue</h2>
      <pre className="mb-6"><code>{`<template>
  <div style="margin-bottom: 1.5rem">
    <label style="font-weight: bold">{{ label }}</label>
    <textarea
      ref="inputRef"
      rows="4"
      @keyup="updateStats"
      @paste="updateStats"
      style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;
        border-radius: 4px; border: 1px solid #ccc;
        font-size: 1rem"
    />
    <p style="font-size: 0.85rem; color: #666">
      Keypresses: {{ stats.keypresses }} |
      Pastes: {{ stats.pastes }} |
      Copies: {{ stats.copies }}
    </p>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useKeystrokeTracker } from "keystroke-tracker-sdk/vue";

const props = defineProps(["qid", "label"]);
const { inputRef, getData } = useKeystrokeTracker(props.qid);
const stats = reactive({ keypresses: 0, pastes: 0, copies: 0 });

function updateStats() {
  const data = getData();
  if (data) {
    stats.keypresses = data.keypresses;
    stats.pastes = data.pastes;
    stats.copies = data.copies;
  }
}

defineExpose({ getData });
</script>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">App.vue</h2>
      <pre className="mb-6"><code>{`<template>
  <div style="max-width: 640px; margin: 2rem auto;
    padding: 0 1rem">
    <h1>Vue 3 Keystroke Tracker</h1>
    <form @submit.prevent="handleSubmit">
      <TrackedQuestion
        v-for="q in questions"
        :key="q.qid"
        :ref="el => questionRefs[q.qid] = el"
        :qid="q.qid"
        :label="q.label"
      />
      <button type="submit" style="padding: 0.5rem 1rem;
        border: none; border-radius: 4px; background: #3b82f6;
        color: white; cursor: pointer; margin-right: 0.5rem">
        Submit
      </button>
      <button type="button" @click="downloadCSV" style="
        padding: 0.5rem 1rem; border: 1px solid #ccc;
        border-radius: 4px; background: white;
        cursor: pointer">
        Download CSV
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TrackedQuestion from "./TrackedQuestion.vue";

const questions = [
  { qid: "q1", label: "Describe your approach:" },
  { qid: "q2", label: "Explain the results:" }
];
const questionRefs = ref({});

function handleSubmit() {
  const allData = questions.map(q =>
    questionRefs.value[q.qid]?.getData()
  ).filter(Boolean);
  alert(JSON.stringify({ data: allData }, null, 2));
}

function downloadCSV() {
  const allData = questions.map(q =>
    questionRefs.value[q.qid]?.getData()
  ).filter(Boolean);

  const rows = [
    ["qid","keypresses","pastes","copies","text"]
  ];
  allData.forEach(d => {
    rows.push([
      d.qid, d.keypresses, d.pastes, d.copies,
      '"' + (d.text || "").replace(/"/g, '""') + '"'
    ]);
  });

  const csv = rows.map(r => r.join(",")).join("\\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "keystroke_data.csv";
  a.click();
}
</script>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Setup</h2>
      <pre className="mb-6"><code>{`npm create vue@latest my-survey
cd my-survey
npm install keystroke-tracker-sdk
# Add the components above
npm run dev`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The composable uses Vue&apos;s <code>onUnmounted</code> lifecycle hook to clean up event listeners automatically.
          No manual cleanup needed.
        </p>
      </div>
    </>
  );
}
