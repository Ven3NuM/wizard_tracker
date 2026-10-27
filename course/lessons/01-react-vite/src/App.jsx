export default function App() {
  const today = new Date().toLocaleDateString('el-GR')

  return (
    <main className="app">
      <h1 className="app__title">Wizard Tracker</h1>
      <p className="hint hint--center">Το πρώτο μας component, σήμερα {today}.</p>
    </main>
  )
}
