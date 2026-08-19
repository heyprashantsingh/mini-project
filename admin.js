// js/admin.js

const DB_USERS_KEY = 'glBajaj_users';
const DB_REPORTS_KEY = 'glBajaj_reports';

document.addEventListener('DOMContentLoaded', () => {
    seedMockReports(); 
});

// --- ADMIN AUTHENTICATION ---
window.handleAdminLogin = function(event) {
    event.preventDefault();
    const errorBox = document.getElementById('loginError');
    errorBox.classList.add('hidden');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Strict Credentials Check
    if (email === 'admin@glbajaj.ac.in' && password === 'Admin@123') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin-dashboard.html';
    } else {
        errorBox.textContent = "Invalid Admin Credentials.";
        errorBox.classList.remove('hidden');
    }
}

window.requireAdminAuth = function() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.replace('admin-login.html');
    }
}

// STRICT LOGOUT FUNCTION
window.adminLogout = function() {
    // 1. Remove the login state completely
    localStorage.removeItem('adminLoggedIn');
    // 2. Fallback overwrite just to be 100% safe
    localStorage.setItem('adminLoggedIn', 'false'); 
    // 3. Force redirect to login page
    window.location.href = 'admin-login.html';
}

// --- DATABASE SIMULATION (Seeding if empty) ---
function seedMockReports() {
    if (!localStorage.getItem(DB_REPORTS_KEY)) {
        const mockReports = [
            { id: 'wallet', userId: '123', itemName: 'Black Leather Wallet', type: 'LOST', category: 'Personal', description: 'Lost my black leather wallet containing my ID and some cash.', location: 'Canteen', date: 'Aug 10, 2026', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', status: 'Pending' },
            { id: 'earbuds', userId: '123', itemName: 'White Wireless Earbuds', type: 'LOST', category: 'Electronics', description: 'Left my AirPods Pro case on the reading table in the quiet zone.', location: 'Library', date: 'Aug 11, 2026', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80', status: 'Approved' },
            { id: 'bottle', userId: '123', itemName: 'Milton Blue Water Bottle', type: 'FOUND', category: 'Other', description: 'Found a metallic blue flask outside the Chemistry Lab on the 2nd floor.', location: 'Lab Block', date: 'Aug 02, 2026', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', status: 'Pending' },
            { id: 'calculator', userId: '123', itemName: 'Casio Scientific Calculator', type: 'FOUND', category: 'Electronics', description: 'Found a Casio fx-991EX calculator on the corner table near the billing counter.', location: 'Canteen', date: 'Jul 28, 2026', image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80', status: 'Resolved' }
        ];
        localStorage.setItem(DB_REPORTS_KEY, JSON.stringify(mockReports));
    }
}

// --- DATA ACCESS METHODS ---
window.getReports = function() { return JSON.parse(localStorage.getItem(DB_REPORTS_KEY)) || []; }
window.saveReports = function(reports) { localStorage.setItem(DB_REPORTS_KEY, JSON.stringify(reports)); }
window.getUsers = function() { return JSON.parse(localStorage.getItem(DB_USERS_KEY)) || []; }
window.saveUsers = function(users) { localStorage.setItem(DB_USERS_KEY, JSON.stringify(users)); }

// --- ADMIN ACTIONS ---
window.updateReportStatus = function(reportId, newStatus) {
    let reports = window.getReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index !== -1) {
        reports[index].status = newStatus;
        window.saveReports(reports);
        return true;
    }
    return false;
}

window.deleteReport = function(reportId) {
    let reports = window.getReports();
    reports = reports.filter(r => r.id !== reportId);
    window.saveReports(reports);
}

window.toggleUserBlock = function(userId) {
    let users = window.getUsers();
    const index = users.findIndex(u => String(u.id) === String(userId));
    if (index !== -1) {
        users[index].status = users[index].status === 'Blocked' ? 'Active' : 'Blocked';
        window.saveUsers(users);
    }
}

window.deleteUser = function(userId) {
    let users = window.getUsers();
    users = users.filter(u => String(u.id) !== String(userId));
    window.saveUsers(users);
}

window.getStatusBadgeClass = function(status) {
    switch(status.toLowerCase()) {
        case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'approved': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
        case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'resolved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
}

window.toggleMobileSidebar = function() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('-translate-x-full');
}