import React, { useState, useEffect } from 'react'
import CommandesTable from './CommandesTable'
import CommandeForm from './CommandeForm'
import Filters from './Filters'
import { Commande, Client, CommandeStatut } from '../types'

interface DashboardProps {
    onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [commandes, setCommandes] = useState<Commande[]>([])
    const [filteredCommandes, setFilteredCommandes] = useState<Commande[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingCommande, setEditingCommande] = useState<Commande | null>(null)
    const [statutFilter, setStatutFilter] = useState<CommandeStatut | 'TOUS'>('TOUS')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterCommandes()
    }, [commandes, statutFilter, searchTerm])

    const loadData = async () => {
        setLoading(true)
        try {
            const [commandesData, clientsData] = await Promise.all([
                window.electronAPI.getCommandes(),
                window.electronAPI.getClients()
            ])
            setCommandes(commandesData)
            setClients(clientsData)
        } catch (error) {
            console.error('Erreur chargement données:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterCommandes = () => {
        let filtered = [...commandes]

        if (statutFilter !== 'TOUS') {
            filtered = filtered.filter(c => c.statut === statutFilter)
        }

        if (searchTerm) {
            filtered = filtered.filter(c => 
                c.client_nom?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredCommandes(filtered)
    }

    const handleCreateCommande = async (formData: any) => {
        try {
            await window.electronAPI.createCommande(formData)
            await loadData()
            setShowForm(false)
        } catch (error) {
            console.error('Erreur création commande:', error)
        }
    }

    const handleUpdateCommande = async (id: number, formData: any) => {
        try {
            await window.electronAPI.updateCommande(id, formData)
            await loadData()
            setEditingCommande(null)
        } catch (error) {
            console.error('Erreur mise à jour commande:', error)
        }
    }

    const handleUpdateStatut = async (id: number, statut: CommandeStatut) => {
        try {
            await window.electronAPI.updateCommandeStatut(id, statut)
            await loadData()
        } catch (error) {
            console.error('Erreur mise à jour statut:', error)
        }
    }

    const handleDeleteCommande = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            try {
                await window.electronAPI.deleteCommande(id)
                await loadData()
            } catch (error) {
                console.error('Erreur suppression commande:', error)
            }
        }
    }

    const handleEdit = (commande: Commande) => {
        setEditingCommande(commande)
    }

    if (loading) {
        return <div className="loading">Chargement...</div>
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>S-Market - Tableau de bord</h1>
                <div className="header-actions">
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        Nouvelle commande
                    </button>
                    <button onClick={onLogout} className="btn-secondary">
                        Déconnexion
                    </button>
                </div>
            </header>

            <Filters
                statutFilter={statutFilter}
                onStatutFilterChange={setStatutFilter}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <CommandesTable
                commandes={filteredCommandes}
                onUpdateStatut={handleUpdateStatut}
                onEdit={handleEdit}
                onDelete={handleDeleteCommande}
            />

            {(showForm || editingCommande) && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{editingCommande ? 'Modifier' : 'Nouvelle'} commande</h2>
                        <CommandeForm
                            clients={clients}
                            initialData={editingCommande}
                            onSubmit={editingCommande 
                                ? (data) => handleUpdateCommande(editingCommande.id, data)
                                : handleCreateCommande
                            }
                            onCancel={() => {
                                setShowForm(false)
                                setEditingCommande(null)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard