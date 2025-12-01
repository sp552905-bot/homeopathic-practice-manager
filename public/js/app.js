const API_URL = window.location.origin + '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showMainContent();
        loadDashboard();
    }
});

// Authentication
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            authToken = data.token;
            currentUser = data.physician;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainContent();
            loadDashboard();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const license_number = document.getElementById('regLicense').value;
    const specialization = document.getElementById('regSpecialization').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, license_number, specialization })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            document.querySelector('[href="#login"]').click();
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (error) {
        alert('Registration error: ' + error.message);
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = {};
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('mainNav').style.display = 'none';
}

function showMainContent() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('mainNav').style.display = 'block';
}

// Navigation
function showSection(section) {
    const sections = ['dashboard', 'patients', 'repertory', 'remedies'];
    sections.forEach(s => {
        document.getElementById(s + 'Section').style.display = 'none';
    });
    document.getElementById(section + 'Section').style.display = 'block';

    if (section === 'patients') loadPatients();
    if (section === 'remedies') loadRemedies();
}

// Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/patients`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        document.getElementById('totalPatients').textContent = data.patients?.length || 0;
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

// Patients
async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        displayPatients(data.patients || []);
    } catch (error) {
        console.error('Load patients error:', error);
    }
}

function displayPatients(patients) {
    const list = document.getElementById('patientsList');
    if (patients.length === 0) {
        list.innerHTML = '<p class="text-muted">No patients found</p>';
        return;
    }

    list.innerHTML = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(p => `
                    <tr>
                        <td>${p.name}</td>
                        <td>${p.age || '-'}</td>
                        <td>${p.gender || '-'}</td>
                        <td>${p.contact || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewPatient('${p.id}')">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="newConsultation('${p.id}')">
                                <i class="bi bi-file-medical"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddPatientModal() {
    const modal = `
        <div class="modal fade" id="addPatientModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Patient</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addPatientForm">
                            <div class="mb-3">
                                <label class="form-label">Name *</label>
                                <input type="text" class="form-control" id="patientName" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Age</label>
                                    <input type="number" class="form-control" id="patientAge">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Gender</label>
                                    <select class="form-control" id="patientGender">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Contact</label>
                                <input type="text" class="form-control" id="patientContact">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="patientEmail">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea class="form-control" id="patientAddress" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Medical History</label>
                                <textarea class="form-control" id="patientHistory" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="savePatient()">Save Patient</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    const modalEl = new bootstrap.Modal(document.getElementById('addPatientModal'));
    modalEl.show();
}

async function savePatient() {
    const patientData = {
        name: document.getElementById('patientName').value,
        age: parseInt(document.getElementById('patientAge').value) || null,
        gender: document.getElementById('patientGender').value,
        contact: document.getElementById('patientContact').value,
        email: document.getElementById('patientEmail').value,
        address: document.getElementById('patientAddress').value,
        medical_history: document.getElementById('patientHistory').value
    };

    try {
        const response = await fetch(`${API_URL}/patients`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert('Patient added successfully!');
            bootstrap.Modal.getInstance(document.getElementById('addPatientModal')).hide();
            loadPatients();
        } else {
            const data = await response.json();
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error saving patient: ' + error.message);
    }
}

async function searchPatients(query) {
    if (query.length < 2) {
        loadPatients();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/patients/search/${query}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        displayPatients(data.patients || []);
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Remedies
async function loadRemedies() {
    try {
        const response = await fetch(`${API_URL}/remedies`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        displayRemedies(data.remedies || []);
    } catch (error) {
        console.error('Load remedies error:', error);
    }
}

function displayRemedies(remedies) {
    const list = document.getElementById('remediesList');
    if (remedies.length === 0) {
        list.innerHTML = '<p class="text-muted">No remedies found</p>';
        return;
    }

    list.innerHTML = remedies.map(r => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${r.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${r.common_name || ''}</h6>
                <p class="card-text">${r.description || ''}</p>
                <button class="btn btn-sm btn-primary" onclick="viewRemedyDetails('${r.id}')">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

async function searchRemedies(query) {
    if (query.length < 2) {
        loadRemedies();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/remedies/search/${query}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        displayRemedies(data.remedies || []);
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Repertorization
let selectedSymptomIds = [];

async function searchSymptoms(query) {
    if (query.length < 3) return;

    try {
        const response = await fetch(`${API_URL}/repertory/symptoms/search/${query}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        // Display symptoms for selection
    } catch (error) {
        console.error('Search symptoms error:', error);
    }
}

async function analyzeSymptoms() {
    if (selectedSymptomIds.length === 0) {
        alert('Please select at least one symptom');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/repertory/analyze`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symptom_ids: selectedSymptomIds })
        });

        const data = await response.json();
        displayRepertoryResults(data.results || []);
    } catch (error) {
        console.error('Analyze error:', error);
    }
}

function displayRepertoryResults(results) {
    const container = document.getElementById('repertoryResults');
    if (results.length === 0) {
        container.innerHTML = '<p class="text-muted">No remedies found for selected symptoms</p>';
        return;
    }

    container.innerHTML = `
        <h5>Suggested Remedies</h5>
        <table class="table">
            <thead>
                <tr>
                    <th>Remedy</th>
                    <th>Score</th>
                    <th>Coverage</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${results.map(r => `
                    <tr>
                        <td>${r.remedy.name}</td>
                        <td>${r.total_score}</td>
                        <td>${r.coverage.toFixed(1)}%</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewRemedyDetails('${r.remedy.id}')">
                                View
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
