import Link from "next/link";

export default function VuePage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-6">
        <a href="https://anonymous.4open.science/r/aied-keystroke-viz/sdk/adapters/vue/index.js" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>View source on GitHub ↗</a>
        <span style={{ color: "var(--muted)" }}>·</span>
        <Link href="/examples/vue" style={{ color: "var(--accent)" }}>Live Example ↗</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Vue Integration</h1>
      <p className="mb-6">Use the <code>useKeystrokeTracker</code> composable in Vue 3 components.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Installation</h2>
      <pre className="mb-6"><code>{`# Download the SDK
wget -O keystroke-core.min.js "https://anonymous.4open.science/api/repo/aied-keystroke-viz/file/public/sdk/dist/keystroke-core.min.js"
// or
yarn add keystroke-tracker-sdk`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Basic Usage</h2>
      <pre className="mb-6"><code>{`<template>
  <div>
    <label>{{ label }}</label>
    <textarea ref="inputRef" rows="4" />
  </div>
</template>

<script setup>
import { useKeystrokeTracker } from "keystroke-tracker-sdk/vue";

const props = defineProps(["qid", "label"]);
const { inputRef, getData } = useKeystrokeTracker(props.qid);

// Call getData() on form submit to get keystroke data
defineExpose({ getData });
</script>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Full Form Example</h2>
      <pre className="mb-6"><code>{`<template>
  <form @submit.prevent="handleSubmit">
    <TrackedQuestion
      v-for="q in questions"
      :key="q.qid"
      :ref="el => questionRefs[q.qid] = el"
      :qid="q.qid"
      :label="q.label"
    />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import TrackedQuestion from "./TrackedQuestion.vue";

const questions = [
  { qid: "q1", label: "Explain your reasoning:" },
  { qid: "q2", label: "Describe the pattern:" }
];
const questionRefs = ref({});

function handleSubmit() {
  const allData = questions.map(q => {
    return questionRefs.value[q.qid]?.getData();
  });
  console.log(JSON.stringify({ data: allData }));
}
</script>`}</code></pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">Composable API</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Property", "Type", "Description"].map((h) => (
                <th key={h} className="text-left p-2 text-xs font-semibold" style={{ borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>inputRef</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>Ref</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Template ref to bind to your input element</td>
            </tr>
            <tr>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>getData()</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}><code>() =&gt; object</code></td>
              <td className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>Returns keystroke data for this field</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Reactive Stats</h2>
      <p className="mb-3">Display real-time keystroke statistics using Vue reactivity:</p>
      <pre className="mb-6"><code>{`<template>
  <div>
    <textarea ref="inputRef" rows="4" @keyup="updateStats" />
    <p>Keypresses: {{ stats.keypresses }} | Pastes: {{ stats.pastes }}</p>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useKeystrokeTracker } from "keystroke-tracker-sdk/vue";

const { inputRef, getData } = useKeystrokeTracker("q1");
const stats = reactive({ keypresses: 0, pastes: 0 });

function updateStats() {
  const data = getData();
  if (data) {
    stats.keypresses = data.keypresses;
    stats.pastes = data.pastes;
  }
}
</script>`}</code></pre>

      <div className="p-5 rounded-xl mt-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold mb-2">💡 Tip</h3>
        <p style={{ color: "var(--muted)" }}>
          The composable automatically cleans up event listeners when the component is unmounted via <code>onUnmounted</code>.
        </p>
      </div>
    </>
  );
}
