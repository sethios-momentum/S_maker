import React from 'react'
import { CommandeStatut } from '../types'

interface FiltersProps {
    statutFilter: CommandeStatut | 'TOUS'
    onStatutFilterChange: (statut: CommandeStatut | 'TOUS') => void
    searchTerm: string
    onSearchChange: (term: string) => void
}

const Filters: React.FC<FiltersProps> = ({
    statutFilter,
    onStatutFilterChange,
    searchTerm,
    onSearchChange
}) => {
    return (
        <div className="filters">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Rechercher par client..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                    <button 
                        className="clear-search"
                        onClick={() => onSearchChange('')}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="statut-filters">
                <button
                    className={statutFilter === 'TOUS' ? 'active' : ''}
                    onClick={() => onStatutFilterChange('TOUS')}
                >
                    Tous
                </button>
                <button
                    className={statutFilter === 'EN_COURS' ? 'active' : ''}
                    onClick={() => onStatutFilterChange('EN_COURS')}
                >
                    En cours
                </button>
                <button
                    className={statutFilter === 'PRET' ? 'active' : ''}
                    onClick={() => onStatutFilterChange('PRET')}
                >
                    Prêt
                </button>
                <button
                    className={statutFilter === 'LIVRE' ? 'active' : ''}
                    onClick={() => onStatutFilterChange('LIVRE')}
                >
                    Livré
                </button>
            </div>
        </div>
    )
}

export default Filters