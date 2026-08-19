// js/auth.js

// Backend ka base URL
const API_BASE_URL = 'http://localhost:5000/api';

// --- UTILITY FUNCTIONS ---
function getCurrentUser() {
    const userStr = localStorage.getItem('glBajaj_user');
    return userStr ? JSON.parse(userStr) : null;
}

function getToken() {
    return localStorage.getItem('glBajaj_token');
}

function requireAuth() {
    // Agar token nahi hai, toh login par bhej do
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('glBajaj_token');
    localStorage.removeItem('glBajaj_user');
    window.location.href = 'login.html';
}

// --- SIGNUP LOGIC ---
async function handleSignup(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    // Agar koi error message ka div hai aapke HTML mein (optional)
    const errorBox = document.getElementById('signupError'); 
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                role: 'user' // Default role
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        } else {
            if(errorBox) {
                errorBox.textContent = data.message;
                errorBox.classList.remove('hidden');
            } else {
                alert(data.message);
            }
        }
    } catch (error) {
        console.error('Signup Error:', error);
        alert('Server error. Make sure backend is running.');
    }
}

// --- LOGIN LOGIC ---
async function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful! Save token and user details
            localStorage.setItem('glBajaj_token', data.token);
            localStorage.setItem('glBajaj_user', JSON.stringify(data.data));
            
            // Redirect to Dashboard
            window.location.href = 'dashboard.html';
        } else {
            if(errorBox) {
                errorBox.textContent = data.message || 'Invalid credentials';
                errorBox.classList.remove('hidden', 'flex');
                errorBox.classList.add('flex');
            } else {
                alert(data.message || 'Invalid credentials');
            }
        }
    } catch (error) {
        console.error('Login Error:', error);
        alert('Server error. Make sure backend is running.');
    }
}

// --- NAVBAR UI UPDATE (Existing Logic) ---
// Ye code check karta hai ki user logged in hai ya nahi, aur us hisaab se Navbar update karta hai
document.addEventListener('DOMContentLoaded', updateNavbarUI);

function updateNavbarUI() {
    const desktopAuthContainer = document.getElementById('desktopAuthContainer');
    if (!desktopAuthContainer) return;

    const user = getCurrentUser();

    if (user) {
        const firstName = user.name.split(' ')[0];
        desktopAuthContainer.innerHTML = `
            <div class="relative group py-6">
                <button class="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all duration-300">
                    <div class="w-7 h-7 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-xs font-bold">
                        ${firstName.charAt(0).toUpperCase()}
                    </div>
                    <span class="text-sm font-medium text-white">${firstName}</span>
                    <i class="ph-bold ph-caret-down text-gray-400 text-xs"></i>
                </button>
                <div class="absolute top-full right-0 mt-0 w-48 bg-navy-700 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                    <a href="dashboard.html" class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-colors border-b border-white/5">
                        Dashboard
                    </a>
                    <a href="dashboard.html#my-reports" class="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-colors border-b border-white/5">
                        My Reports
                    </a>
                    <button onclick="logout()" class="w-full text-left block px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        Logout
                    </button>
                </div>
            </div>
        `;
    } else {
        desktopAuthContainer.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="login.html" class="text-gray-300 text-sm font-medium hover:text-white transition-colors">Log In</a>
                <a href="signup.html" class="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-teal-500/25 hover:-translate-y-0.5">
                    Sign Up
                </a>
            </div>
        `;
    }
}