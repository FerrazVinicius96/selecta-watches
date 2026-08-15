import { useEffect, useState } from 'react'
import { leadsAPI } from '../services/api'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await leadsAPI.list()
      setLeads(response.data)
    } catch (err) {
      setError('Erro ao carregar leads. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Leads Capturados</h1>
        <button className="primary" onClick={loadLeads} disabled={loading}>
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading && <div className="loading">Carregando leads...</div>}

      {!loading && leads.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
          Nenhum lead capturado ainda.
        </div>
      )}

      {!loading && leads.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Contato</th>
              <th>Interesse</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>{lead.name}</td>
                <td>{lead.contact}</td>
                <td>{lead.interest || '—'}</td>
                <td>{new Date(lead.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
