class AirdropTracker {
    constructor() {
        // Add localStorage availability check
        this.storageAvailable = this.checkStorageAvailability();
        
        this.airdrops = JSON.parse(localStorage.getItem('airdrops')) || [];
        this.currentId = JSON.parse(localStorage.getItem('currentId')) || 1;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.setupEventListeners();
        this.renderAirdrops();
        this.applyTheme(this.currentTheme);
    }

    checkStorageAvailability() {
        try {
            const storage = window.localStorage;
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            console.warn('localStorage is not available');
            return false;
        }
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('addAirdropBtn').addEventListener('click', () => this.openModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('airdropForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Filters
        document.getElementById('searchInput').addEventListener('input', () => this.renderAirdrops());
        document.getElementById('priorityFilter').addEventListener('change', () => this.renderAirdrops());

        // Theme selector
        document.getElementById('themeSelector').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        // Export/Import controls
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importInput').click();
        });
        document.getElementById('importInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importData(e.target.files[0]).then(success => {
                    if (success) {
                        alert('Data imported successfully!');
                        e.target.value = ''; // Reset file input
                    } else {
                        alert('Failed to import data. Please check the file format.');
                    }
                });
            }
        });
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        document.getElementById('themeSelector').value = theme;
    }

    openModal(airdrop = null) {
        const modal = document.getElementById('airdropModal');
        const form = document.getElementById('airdropForm');
        
        if (airdrop) {
            form.dataset.id = airdrop.id;
            document.getElementById('projectName').value = airdrop.projectName;
            document.getElementById('fundingAmount').value = this.formatAmount(airdrop.fundingAmount).slice(1); // remove $ sign
            document.getElementById('priority').value = airdrop.priority;
            document.getElementById('investedAmount').value = this.formatAmount(airdrop.investedAmount).slice(1); // remove $ sign
            document.getElementById('guideLink').value = airdrop.guideLink;
            document.getElementById('notes').value = airdrop.notes;
            document.getElementById('airdropType').value = airdrop.airdropType;
            document.getElementById('checkInFrequency').value = airdrop.checkInFrequency;
        } else {
            form.reset();
            delete form.dataset.id;
        }
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('airdropModal').style.display = 'none';
    }

    parseAmount(value) {
        if (!value) return 0;
        // Remove $ and any whitespace
        value = value.toString().replace(/[\$\s]/g, '');
        // Try to parse as number with suffix, if fails return the original text
        const match = value.match(/^(\d+\.?\d*)\s*([kmb])?$/i);
        if (!match) return value;
        
        const num = parseFloat(match[1]);
        const suffix = (match[2] || '').toLowerCase();
        
        const multipliers = {
            'k': 1000,
            'm': 1000000,
            'b': 1000000000
        };
        
        return num * (multipliers[suffix] || 1);
    }

    formatAmount(amount) {
        if (!amount) return '';
        if (typeof amount !== 'number') return '$' + amount;
        if (amount >= 1000000000) {
            return `$${(amount / 1000000000).toFixed(1)}B`;
        }
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toFixed(2)}`;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const airdropData = {
            id: form.dataset.id ? parseInt(form.dataset.id) : this.currentId++,
            projectName: document.getElementById('projectName').value,
            fundingAmount: this.parseAmount(document.getElementById('fundingAmount').value),
            priority: document.getElementById('priority').value,
            airdropType: document.getElementById('airdropType').value,
            checkInFrequency: document.getElementById('checkInFrequency').value,
            investedAmount: this.parseAmount(document.getElementById('investedAmount').value),
            guideLink: document.getElementById('guideLink').value || '',
            notes: document.getElementById('notes').value,
            date: new Date().toISOString()
        };

        if (form.dataset.id) {
            const index = this.airdrops.findIndex(a => a.id === parseInt(form.dataset.id));
            this.airdrops[index] = airdropData;
        } else {
            this.airdrops.push(airdropData);
        }

        this.saveToLocalStorage();
        this.renderAirdrops();
        this.closeModal();
    }

    deleteAirdrop(id) {
        if (confirm('Are you sure you want to delete this airdrop?')) {
            this.airdrops = this.airdrops.filter(a => a.id !== id);
            this.saveToLocalStorage();
            this.renderAirdrops();
        }
    }

    saveToLocalStorage() {
        if (!this.storageAvailable) return;
        
        try {
            localStorage.setItem('airdrops', JSON.stringify(this.airdrops));
            localStorage.setItem('currentId', JSON.stringify(this.currentId));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    // Add export functionality
    exportData() {
        const data = {
            airdrops: this.airdrops,
            currentId: this.currentId,
            theme: this.currentTheme,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `airdrop-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Add import functionality
    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.airdrops && Array.isArray(data.airdrops)) {
                this.airdrops = data.airdrops;
                this.currentId = data.currentId || this.currentId;
                this.applyTheme(data.theme || this.currentTheme);
                this.saveToLocalStorage();
                this.renderAirdrops();
                return true;
            }
            return false;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    }

    renderAirdrops() {
        const grid = document.getElementById('airdropGrid');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const priorityFilter = document.getElementById('priorityFilter').value;

        let filteredAirdrops = this.airdrops
            .filter(airdrop => 
                airdrop.projectName.toLowerCase().includes(searchTerm) &&
                (priorityFilter === '' || airdrop.priority === priorityFilter)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        grid.innerHTML = filteredAirdrops.map(airdrop => `
            <div class="airdrop-card">
                <div class="card-header">
                    <h3>${airdrop.projectName}</h3>
                    <span class="priority priority-${airdrop.priority.toLowerCase()}">${airdrop.priority}</span>
                </div>
                <div class="card-body">
                    <p>Type: ${airdrop.airdropType}</p>
                    <p>Check-in: ${airdrop.checkInFrequency}</p>
                    ${airdrop.fundingAmount ? `<p>Funding: ${this.formatAmount(airdrop.fundingAmount)}</p>` : ''}
                    ${airdrop.investedAmount ? `<p>Invested: ${this.formatAmount(airdrop.investedAmount)}</p>` : ''}
                    ${airdrop.guideLink ? `<p><a href="${airdrop.guideLink}" target="_blank">View Guide</a></p>` : ''}
                    ${airdrop.notes ? `<p>Notes: ${airdrop.notes}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-primary edit-btn" data-airdrop-id="${airdrop.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-primary" onclick="tracker.deleteAirdrop(${airdrop.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for edit buttons
        grid.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const airdropId = parseInt(e.target.dataset.airdropId);
                const airdrop = this.airdrops.find(a => a.id === airdropId);
                if (airdrop) {
                    this.openModal(airdrop);
                }
            });
        });
    }
}

const tracker = new AirdropTracker();
