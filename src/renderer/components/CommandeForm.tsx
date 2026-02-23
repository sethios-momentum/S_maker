import React, { useState } from 'react'
import { Client, Commande, CommandeFormData, CommandeStatut } from '../types'

interface CommandeFormProps {
    clients: Client[]
    initialData?: Commande | null
    onSubmit: (data: CommandeFormData) => void
    onCancel: () => void
}

const CommandeForm: React.FC<CommandeFormProps> = ({
    clients,
    initialData,
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState<CommandeFormData>({
        client_id: initialData?.client_id || 0,
        produit: initialData?.produit || '',
        quantite: initialData?.quantite || 1,
        prix_unitaire: initialData?.prix_unitaire || 0,
        statut: initialData?.statut || 'EN_COURS',
        notes: initialData?.notes || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="commande-form">
            <div className="form-group">
                <label htmlFor="client_id">Client *</label>
                <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.nom}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="produit">Produit *</label>
                <input
                    type="text"
                    id="produit"
                    name="produit"
                    value={formData.produit}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="quantite">Quantité *</label>
                    <input
                        type="number"
                        id="quantite"
                        name="quantite"
                        min="1"
                        value={formData.quantite}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="prix_unitaire">Prix unitaire (€) *</label>
                    <input
                        type="number"
                        id="prix_unitaire"
                        name="prix_unitaire"
                        min="0"
                        step="0.01"
                        value={formData.prix_unitaire}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="statut">Statut *</label>
                <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    required
                >
                    <option value="EN_COURS">En cours</option>
                    <option value="PRET">Prêt</option>
                    <option value="LIVRE">Livré</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Annuler
                </button>
                <button type="submit" className="btn-primary">
                    {initialData ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    )
}

export default CommandeForm