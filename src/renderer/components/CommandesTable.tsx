import React from 'react'
import { Commande, CommandeStatut } from '../types'

interface CommandesTableProps {
    commandes: Commande[]
    onUpdateStatut: (id: number, statut: CommandeStatut) => void
    onEdit: (commande: Commande) => void
    onDelete: (id: number) => void
}

const CommandesTable: React.FC<CommandesTableProps> = ({
    commandes,
    onUpdateStatut,
    onEdit,
    onDelete
}) => {
    const getStatutClass = (statut: CommandeStatut) => {
        switch (statut) {
            case 'EN_COURS': return 'statut-en-cours'
            case 'PRET': return 'statut-pret'
            case 'LIVRE': return 'statut-livre'
            default: return ''
        }
    }

    const getStatutLabel = (statut: CommandeStatut) => {
        switch (statut) {
            case 'EN_COURS': return 'En cours'
            case 'PRET': return 'Prêt'
            case 'LIVRE': return 'Livré'
            default: return statut
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatPrix = (prix: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(prix)
    }

    return (
        <div className="table-container">
            <table className="commandes-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {commandes.map(commande => (
                        <tr key={commande.id}>
                            <td>{formatDate(commande.date_commande)}</td>
                            <td>{commande.client_nom}</td>
                            <td>{commande.produit}</td>
                            <td>{commande.quantite}</td>
                            <td>{formatPrix(commande.prix_unitaire)}</td>
                            <td>{formatPrix(commande.quantite * commande.prix_unitaire)}</td>
                            <td>
                                <select
                                    value={commande.statut}
                                    onChange={(e) => onUpdateStatut(
                                        commande.id, 
                                        e.target.value as CommandeStatut
                                    )}
                                    className={getStatutClass(commande.statut)}
                                >
                                    <option value="EN_COURS">En cours</option>
                                    <option value="PRET">Prêt</option>
                                    <option value="LIVRE">Livré</option>
                                </select>
                            </td>
                            <td>
                                <button 
                                    onClick={() => onEdit(commande)}
                                    className="btn-icon btn-edit"
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button 
                                    onClick={() => onDelete(commande.id)}
                                    className="btn-icon btn-delete"
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    {commandes.length === 0 && (
                        <tr>
                            <td colSpan={8} className="text-center">
                                Aucune commande trouvée
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default CommandesTable