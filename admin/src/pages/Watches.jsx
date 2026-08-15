import { useEffect, useState } from 'react'
import { watchesAPI } from '../services/api'

export default function Watches() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    image_url: '',
    featured: false,
    active: true,
  })

  useEffect(() => {
    loadWatches()
  }, [])

  const loadWatches = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await watchesAPI.listAll()
      setWatches(response.data)
    } catch (err) {
      setError('Erro ao carregar catálogo. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...formData,
        price: formData.price === '' ? null : parseFloat(formData.price),
      }

      if (editingId) {
        await watchesAPI.update(editingId, payload)
        setSuccess('Relógio atualizado com sucesso!')
      } else {
        await watchesAPI.create(payload)
        setSuccess('Relógio criado com sucesso!')
      }

      await loadWatches()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar relógio.')
      console.error(err)
    }
  }

  const handleEdit = (watch) => {
    setFormData({
      name: watch.name,
      brand: watch.brand,
      description: watch.description || '',
      price: watch.price === null || watch.price === undefined ? '' : watch.price.toString(),
      image_url: watch.image_url || '',
      featured: watch.featured,
      active: watch.active,
    })
    setEditingId(watch.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este relógio?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await watchesAPI.delete(id)
      setSuccess('Relógio deletado com sucesso!')
      await loadWatches()
    } catch (err) {
      setError('Erro ao deletar relógio.')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      image_url: '',
      featured: false,
      active: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Catálogo de Relógios</h1>
        <div>
          {showForm && (
            <button className="secondary" onClick={resetForm} style={{ marginRight: '10px' }}>
              Cancelar
            </button>
          )}
          <button className="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Fechar Formulário' : '+ Novo Relógio'}
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
            {editingId ? 'Editar Relógio' : 'Novo Relógio'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Marca</label>
              <input
                id="brand"
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Preço</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                step="0.01"
                min="0"
                placeholder="Vazio = sob encomenda"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image_url">URL da Imagem</label>
              <input
                id="image_url"
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="4"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleFormChange}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                Destaque
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleFormChange}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                Ativo
              </label>
            </div>
          </div>

          <button type="submit" className="primary">
            {editingId ? 'Atualizar' : 'Criar'}
          </button>
        </form>
      )}

      {loading && <div className="loading">Carregando catálogo...</div>}

      {!loading && watches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
          Nenhum relógio no catálogo. Crie um para começar!
        </div>
      )}

      {!loading && watches.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Marca</th>
              <th>Preço</th>
              <th>Destaque</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {watches.map((watch) => (
              <tr key={watch.id}>
                <td>{watch.id}</td>
                <td>{watch.name}</td>
                <td>{watch.brand}</td>
                <td>
                  {watch.price === null || watch.price === undefined
                    ? 'Sob consulta'
                    : `R$ ${parseFloat(watch.price).toFixed(2).replace('.', ',')}`}
                </td>
                <td>{watch.featured ? 'Sim' : 'Não'}</td>
                <td>{watch.active ? 'Sim' : 'Não'}</td>
                <td>
                  <button
                    onClick={() => handleEdit(watch)}
                    className="primary"
                    style={{ marginRight: '8px', padding: '6px 12px', fontSize: '12px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(watch.id)}
                    className="danger"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
