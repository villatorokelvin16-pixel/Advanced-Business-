import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [formData, setFormData] = useState({
    grossIncome: '',
    fuelExpenses: '',
    mileage: ''
  })
  const [netIncome, setNetIncome] = useState(0)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Dynamically calculate Net Income whenever inputs change
  useEffect(() => {
    const gross = parseFloat(formData.grossIncome) || 0
    const fuel = parseFloat(formData.fuelExpenses) || 0
    const net = gross - fuel
    setNetIncome(net)
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/summary')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (parseFloat(formData.fuelExpenses) < 0) {
      setMessage('Fuel Expenses cannot be negative.')
      return
    }

    setIsLoading(true)

    const payload = {
      grossIncome: parseFloat(formData.grossIncome) || 0,
      fuelExpenses: parseFloat(formData.fuelExpenses) || 0,
      mileage: parseFloat(formData.mileage) || 0,
      netIncome: netIncome
    }

    try {
      const response = await fetch('http://localhost:5005/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setMessage('Record saved successfully!')
        setFormData({ grossIncome: '', fuelExpenses: '', mileage: '' })
        fetchHistory() // Refresh history
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save record.')
      }
    } catch (error) {
      console.error('Error saving data:', error)
      setMessage('Error connecting to server.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>DriveFlow Analytics</h1>
        <p>Your ultimate tracking dashboard for ride-share earnings</p>
      </header>

      <main className="main-content">
        <section className="dashboard-section">
          <div className="card form-card">
            <h2>Add New Entry</h2>
            {message && <div className="toast-message">{message}</div>}

            <form onSubmit={handleSubmit} className="entry-form">
              <div className="form-group">
                <label htmlFor="grossIncome">Gross Income ($)</label>
                <input
                  type="number"
                  id="grossIncome"
                  name="grossIncome"
                  value={formData.grossIncome}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuelExpenses">Fuel Expenses ($)</label>
                <input
                  type="number"
                  id="fuelExpenses"
                  name="fuelExpenses"
                  value={formData.fuelExpenses}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mileage">Mileage (miles)</label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="summary-box">
                <h3>Calculated Net Income</h3>
                <h2 className="net-income-value">${netIncome.toFixed(2)}</h2>
              </div>

              <button type="submit" className="submit-btn" disabled={!formData.grossIncome || isLoading}>
                {isLoading ? 'Saving...' : 'Save Record'}
              </button>
            </form>
          </div>

          <div className="card history-card">
            <h2>Recent History</h2>
            {history.length === 0 ? (
              <p className="empty-state">No records found. Setup Firebase or save a mock entry.</p>
            ) : (
              <ul className="history-list">
                {history.map((item, idx) => (
                  <li key={item.id || idx} className="history-item">
                    <div className="history-details">
                      <span className="history-net">Net: ${parseFloat(item.netIncome).toFixed(2)}</span>
                      <span className="history-gross">Gross: ${parseFloat(item.grossIncome).toFixed(2)}</span>
                      <span className="history-fuel">Fuel: ${parseFloat(item.fuelExpenses).toFixed(2)}</span>
                      <span className="history-mileage">Miles: {item.mileage}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
